import os
import re
import json
import time
import random
import logging
import urllib.request
import urllib.error
from typing import Dict, Any, Optional, List

logger = logging.getLogger("yogyat.gemini_client")
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("[%(asctime)s] [%(levelname)s] [GeminiClient] %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
logger.setLevel(logging.INFO)

# High-speed verified active models ranked by latency (1.39s vs 6.5s)
DEFAULT_MODELS_CHAIN = [
    "gemini-flash-lite-latest",
    "gemini-3.5-flash-lite",
]

# Fast in-memory cache for instant answers (0ms latency for repeat questions)
_CHAT_CACHE: Dict[str, str] = {}
_MAX_CACHE_ENTRIES = 100

class GeminiClientError(Exception):
    """Base exception for Gemini client errors."""
    pass

class GeminiConfigurationError(GeminiClientError):
    """Raised when GEMINI_API_KEY is missing or invalid."""
    pass

class GeminiRateLimitError(GeminiClientError):
    """Raised when rate limits are exhausted across models."""
    pass

class GeminiParsingError(GeminiClientError):
    """Raised when JSON output could not be sanitized or parsed."""
    pass


def validate_api_key() -> str:
    """Validate and return server-side GEMINI_API_KEY."""
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        raise GeminiConfigurationError(
            "GEMINI_API_KEY is not configured in environment or .env file."
        )
    return key


def get_model_chain() -> List[str]:
    """Retrieve ordered model sequence starting with high-speed preference."""
    env_model = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest").strip()
    chain = []
    if env_model:
        chain.append(env_model)
    for m in DEFAULT_MODELS_CHAIN:
        if m not in chain:
            chain.append(m)
    return chain


def sanitize_and_parse_json(raw_text: str) -> Dict[str, Any]:
    """
    Robust JSON sanitization & parsing.
    Rule 2: Strip backticks, code blocks, or conversational intro/outro before parsing.
    """
    if not raw_text or not raw_text.strip():
        raise GeminiParsingError("Received empty response from Gemini.")

    text = raw_text.strip()

    # 1. Strip markdown code block fences: ```json ... ``` or ``` ... ```
    clean_json = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
    clean_json = re.sub(r"\s*```$", "", clean_json, flags=re.MULTILINE)
    clean_json = clean_json.strip()

    # 2. Direct JSON Parse Attempt
    try:
        return json.loads(clean_json)
    except json.JSONDecodeError as primary_err:
        logger.warning("Primary json.loads failed: %s. Attempting regex boundary extraction.", primary_err)
        
        # 3. Extract outermost JSON object { ... } or array [ ... ] if surrounded by prose
        match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", clean_json)
        if match:
            candidate = match.group(1).strip()
            try:
                return json.loads(candidate)
            except json.JSONDecodeError as secondary_err:
                logger.error("Secondary regex JSON parse failed: %s", secondary_err)

        raise GeminiParsingError(f"Failed to parse valid JSON from Gemini output: {primary_err}")


def _execute_with_exponential_backoff(
    action_fn,
    max_retries: int = 3,
    initial_delay: float = 1.0,
    backoff_factor: float = 2.0
):
    """
    Executes action_fn with exponential backoff and jitter for 429 and 500/503 status codes.
    """
    delay = initial_delay
    last_exception = None

    for attempt in range(1, max_retries + 1):
        try:
            return action_fn()
        except Exception as e:
            last_exception = e
            err_str = str(e).lower()

            # Identify status codes
            is_429 = "429" in err_str or "resource_exhausted" in err_str or "quota" in err_str
            is_404 = "404" in err_str or "not_found" in err_str or "no longer available" in err_str
            is_400 = "400" in err_str or "invalid_argument" in err_str
            is_server_err = "500" in err_str or "503" in err_str or "internal" in err_str or "unavailable" in err_str

            # Do not retry on 404 (model deprecated) or 400 (bad argument) - immediately cascade
            if is_404 or is_400:
                logger.info("Non-retryable error encountered on attempt %d: %s", attempt, e)
                raise e

            if attempt < max_retries and (is_429 or is_server_err):
                jitter = random.uniform(0.1, 0.5)
                sleep_time = delay + jitter
                logger.warning(
                    "Gemini API rate/server issue (attempt %d/%d). Retrying in %.2fs. Error: %s",
                    attempt, max_retries, sleep_time, str(e)[:120]
                )
                time.sleep(sleep_time)
                delay *= backoff_factor
            else:
                raise e

    raise last_exception


def generate_structured_json(
    prompt: str,
    system_instruction: str,
    schema: Optional[Dict[str, Any]] = None,
    temperature: float = 0.1,
    max_output_tokens: int = 4096
) -> Dict[str, Any]:
    """
    Enforces Structured JSON output with:
    - response_mime_type = "application/json"
    - response_schema = schema
    - Low temperature = 0.1 for deterministic scoring
    - Exponential backoff retry wrapper
    - Multi-model fallback sequence
    - Regex sanitization before parsing
    """
    api_key = validate_api_key()
    models = get_model_chain()

    # Append strict JSON enforcement to system instruction
    enforced_instruction = (
        f"{system_instruction.strip()}\n\n"
        "CRITICAL INSTRUCTION: You must output ONLY a valid JSON object matching the requested schema. "
        "Do NOT enclose response in markdown ```json or ``` code fences. "
        "Do NOT include conversational intro or outro text."
    )

    last_error = None

    for model_name in models:
        logger.info("Attempting structured JSON generation with model: %s", model_name)

        # 1. High-Speed Direct REST (Primary Fast-Path: 1.4s - 2.0s)
        try:
            def _call_rest():
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                payload: Dict[str, Any] = {
                    "system_instruction": {
                        "parts": [{"text": enforced_instruction}]
                    },
                    "contents": [
                        {"role": "user", "parts": [{"text": prompt}]}
                    ],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "temperature": temperature,
                        "maxOutputTokens": max_output_tokens
                    }
                }
                if schema:
                    payload["generationConfig"]["responseSchema"] = schema

                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=12) as resp:
                    res_data = json.loads(resp.read().decode("utf-8"))
                    return res_data["candidates"][0]["content"]["parts"][0]["text"]

            rest_text = _execute_with_exponential_backoff(_call_rest, max_retries=2)
            if rest_text:
                parsed_json = sanitize_and_parse_json(rest_text)
                parsed_json["_model_used"] = model_name
                logger.info("Successfully received structured JSON via high-speed REST for %s", model_name)
                return parsed_json

        except Exception as rest_err:
            logger.warning("REST call failed for model %s: %s. Attempting SDK fallback.", model_name, rest_err)
            last_error = rest_err

            # 2. SDK Fallback
            try:
                from google import genai
                from google.genai import types

                client = genai.Client(
                    api_key=api_key,
                    http_options=types.HttpOptions(timeout=15.0)
                )

                config_kwargs: Dict[str, Any] = {
                    "system_instruction": enforced_instruction,
                    "response_mime_type": "application/json",
                    "temperature": temperature,
                    "max_output_tokens": max_output_tokens,
                }
                if schema:
                    config_kwargs["response_schema"] = schema

                config = types.GenerateContentConfig(**config_kwargs)

                def _call_sdk():
                    return client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config=config
                    )

                response = _execute_with_exponential_backoff(_call_sdk, max_retries=1)
                if response and hasattr(response, "text") and response.text:
                    parsed_json = sanitize_and_parse_json(response.text)
                    parsed_json["_model_used"] = model_name
                    logger.info("Successfully received structured JSON from SDK for %s", model_name)
                    return parsed_json

            except Exception as sdk_err:
                logger.error("SDK fallback also failed for model %s: %s", model_name, sdk_err)
                last_error = sdk_err
                continue

    raise GeminiClientError(f"All Gemini models in fallback sequence failed. Last error: {last_error}")


def generate_chat_response(
    messages: List[Dict[str, str]],
    system_instruction: str,
    temperature: float = 0.2,
    max_output_tokens: int = 450
) -> str:
    """
    Lightning-fast Gemini chat completion generator with LRU cache,
    direct REST primary path (1-2s latency), and multi-model fallback.
    """
    api_key = validate_api_key()
    models = get_model_chain()
    last_error = None

    # Format user prompt from messages
    formatted_convo = []
    for msg in messages:
        role = msg.get("role", "user").capitalize()
        content = msg.get("content", "").strip()
        if content:
            formatted_convo.append(f"{role}: {content}")
    conversation_text = "\n".join(formatted_convo) if formatted_convo else "Hello"

    # Fast Cache Lookup: check if recent identical query exists
    cache_key = f"{conversation_text.strip().lower()}::{system_instruction[:80]}"
    if cache_key in _CHAT_CACHE:
        logger.info("Instant 0ms cache hit for chat query.")
        return _CHAT_CACHE[cache_key]

    # Enforce concise, fast instruction
    speed_instruction = (
        f"{system_instruction.strip()}\n\n"
        "SPEED & CONCISENESS RULE: Be direct, structured, and fast. "
        "Provide high-impact bullet points and bold keywords. Avoid unnecessary pleasantries or filler."
    )

    for model_name in models:
        logger.info("Attempting fast chat completion with model: %s", model_name)

        # 1. High-Speed Direct REST (Primary Fast-Path: 1.4s - 2.0s)
        try:
            def _call_chat_rest():
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                contents_payload = []
                for msg in messages:
                    role = "user" if msg.get("role") in ["user", "human"] else "model"
                    txt = (msg.get("content") or "").strip()
                    if not txt:
                        continue
                    if contents_payload and contents_payload[-1]["role"] == role:
                        contents_payload[-1]["parts"][0]["text"] += f"\n\n{txt}"
                    else:
                        contents_payload.append({
                            "role": role,
                            "parts": [{"text": txt}]
                        })

                # In Gemini API, conversation turns MUST start with role: "user"
                while contents_payload and contents_payload[0]["role"] != "user":
                    contents_payload.pop(0)

                payload = {
                    "system_instruction": {"parts": [{"text": speed_instruction}]},
                    "contents": contents_payload or [{"role": "user", "parts": [{"text": conversation_text}]}],
                    "generationConfig": {
                        "temperature": temperature,
                        "maxOutputTokens": max_output_tokens
                    }
                }
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=10) as resp:
                    res_data = json.loads(resp.read().decode("utf-8"))
                    return res_data["candidates"][0]["content"]["parts"][0]["text"]

            text = _execute_with_exponential_backoff(_call_chat_rest, max_retries=1)
            if text:
                ans = text.strip()
                # Store in fast cache
                if len(_CHAT_CACHE) > _MAX_CACHE_ENTRIES:
                    _CHAT_CACHE.pop(next(iter(_CHAT_CACHE)))
                _CHAT_CACHE[cache_key] = ans
                logger.info("Fast chat answered in sub-2s via REST from %s", model_name)
                return ans

        except Exception as rest_err:
            logger.warning("Fast REST chat failed for %s: %s. Trying SDK fallback.", model_name, rest_err)
            last_error = rest_err

            # 2. SDK Fallback
            try:
                from google import genai
                from google.genai import types

                client = genai.Client(
                    api_key=api_key,
                    http_options=types.HttpOptions(timeout=15.0)
                )
                config = types.GenerateContentConfig(
                    system_instruction=speed_instruction,
                    temperature=temperature,
                    max_output_tokens=max_output_tokens,
                )

                def _call_chat_sdk():
                    return client.models.generate_content(
                        model=model_name,
                        contents=conversation_text,
                        config=config
                    )

                res = _execute_with_exponential_backoff(_call_chat_sdk, max_retries=1)
                if res and hasattr(res, "text") and res.text:
                    ans = res.text.strip()
                    if len(_CHAT_CACHE) > _MAX_CACHE_ENTRIES:
                        _CHAT_CACHE.pop(next(iter(_CHAT_CACHE)))
                    _CHAT_CACHE[cache_key] = ans
                    return ans

            except Exception as e:
                logger.error("SDK chat also failed for %s: %s", model_name, e)
                last_error = e
                continue

    raise GeminiClientError(f"All Gemini models in fallback sequence failed for chat. Last error: {last_error}")
