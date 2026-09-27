import { ResumeData } from '../types/resumeBuilder';

export const INITIAL_RESUME_DATA: ResumeData = {
  contact: {
    fullName: 'Alex Chen',
    jobTitle: 'Software Engineer',
    email: 'alex.chen@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen-dev',
    github: 'github.com/alexchen',
    portfolio: 'alexchen.dev',
  },
  summary:
    'Results-driven Software Engineer with 4+ years of experience building resilient microservices, high-throughput REST APIs, and scalable distributed systems. Proven track record in reducing latency by 45%, automating CI/CD pipelines, and driving cloud migration on AWS/GCP.',
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science in Computer Science',
      location: 'Berkeley, CA',
      startDate: 'Aug 2018',
      endDate: 'May 2022',
      gpa: '3.85 / 4.0',
      coursework: 'Data Structures, Algorithms, Distributed Systems, Database Systems, Computer Networks',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'TechFlow Systems',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: 'Jun 2022',
      endDate: 'Present',
      bullets: [
        'Architected and deployed asynchronous microservices using Python (FastAPI) and PostgreSQL, handling over 12M daily requests with 99.98% uptime.',
        'Refactored legacy data synchronization pipelines with Redis caching and Apache Kafka, slashing p99 API response latencies from 420ms to 65ms (84% reduction).',
        'Spearheaded transition to Docker containerization and Kubernetes orchestration on AWS EKS, accelerating deployment cycles by 3.5x.',
        'Mentored 4 junior engineers on test-driven development, automated linting, and system design best practices.',
      ],
    },
    {
      id: 'exp-2',
      company: 'CloudMatrix Inc.',
      position: 'Software Engineering Intern',
      location: 'San Jose, CA',
      startDate: 'May 2021',
      endDate: 'Aug 2021',
      bullets: [
        'Engineered an automated log parsing service utilizing Python and Elasticsearch, cutting manual incident triage time by 40% across 15 engineering squads.',
        'Constructed end-to-end integration test suites with PyTest and GitHub Actions CI, boosting code coverage from 68% to 92%.',
        'Authored comprehensive technical documentation and OpenAPI specifications for 8 public client-facing API endpoints.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Distributed Task Queue (FastQueue)',
      technologies: 'Python, Redis, Docker, FastAPI, Prometheus',
      link: 'github.com/alexchen/fastqueue',
      startDate: 'Jan 2023',
      endDate: 'Apr 2023',
      bullets: [
        'Built a lightweight, fault-tolerant distributed background task execution engine processing 5,000 tasks/second with automatic retries and exponential backoff.',
        'Implemented Prometheus metrics exporter and Grafana telemetry dashboards to monitor queue depth, worker saturation, and error rates in real time.',
      ],
    },
    {
      id: 'proj-2',
      name: 'Semantic Code Search Engine',
      technologies: 'TypeScript, React, Node.js, PyTorch, FAISS',
      link: 'github.com/alexchen/code-lens',
      startDate: 'Sep 2022',
      endDate: 'Dec 2022',
      bullets: [
        'Developed a vector-embedding search tool enabling natural language semantic search across 100,000+ open-source GitHub repositories.',
        'Integrated FAISS vector indexing to deliver sub-50ms search query speeds with 94% relevance recall.',
      ],
    },
  ],
  skills: {
    languages: 'Python, TypeScript, JavaScript, Go, SQL, C++, HTML5, CSS3',
    frameworks: 'FastAPI, Django, Flask, React, Node.js, Express, Next.js, Tailwind CSS',
    developerTools: 'Git, Docker, Kubernetes, Linux, AWS (EC2, S3, RDS, Lambda), CI/CD, Terraform',
    librariesCloud: 'PostgreSQL, Redis, Apache Kafka, Elasticsearch, PyTest, Celery, REST APIs, GraphQL',
  },
  certifications: [
    'AWS Certified Solutions Architect – Associate (2023)',
    'Certified Kubernetes Application Developer (CKAD) (2024)',
  ],
};
