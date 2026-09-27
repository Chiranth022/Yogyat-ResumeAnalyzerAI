import os
import pymupdf
import docx

SAMPLE_RESUME_TEXT = """ALEX CHEN
San Francisco, CA • alex.chen@example.com • (555) 234-5678 • linkedin.com/in/alexchen • github.com/alexchen

PROFESSIONAL SUMMARY
Passionate Software Engineer with 3+ years of experience developing responsive web applications and backend services. Skilled in Python, Java, SQL, React, and MongoDB with a strong interest in Machine Learning. Proven track record of architecting user-friendly solutions and collaborating in agile engineering teams.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley
Graduated: May 2023 | GPA: 3.8 / 4.0

TECHNICAL SKILLS
Languages: Python, Java, SQL, JavaScript, HTML, CSS
Frameworks & Libraries: React, Node.js, Express, Flask, scikit-learn, Pandas, NumPy
Databases: MongoDB, PostgreSQL, SQLite
Tools & Practices: Git, Agile, Scrum, Object-Oriented Programming (OOP), RESTful Web Services

WORK EXPERIENCE
Software Engineer | DataSphere Labs
June 2023 - Present | San Francisco, CA
• Designed and maintained full-stack web applications using React on the frontend and Python backend microservices.
• Developed relational and document database queries with SQL and MongoDB, processing over 100,000 records daily.
• Created a machine learning project to classify customer feedback sentiments, achieving strong baseline accuracy.
• Handled database queries and backend API requests for customer-facing dashboards.
• Collaborated with product managers and QA engineers using Git version control and bi-weekly agile sprints.

Junior Software Developer Intern | NexaTech Solutions
June 2022 - August 2022 | San Jose, CA
• Built interactive UI components with React, HTML, and CSS, improving page load speed by 20%.
• Assisted in migrating legacy Java codebase to modern Spring-inspired service modules.
• Authored comprehensive unit and integration tests, increasing code coverage across core repositories.

KEY PROJECTS
Customer Sentiment Intelligence Platform
• Developed an end-to-end data pipeline utilizing Python, scikit-learn, and Flask to classify customer sentiment.
• Implemented interactive React charts for visualizing historical trend lines and real-time alerts.

Distributed Task Queue Dashboard
• Engineered a real-time dashboard in React and Node.js for tracking asynchronous worker jobs.
• Utilized MongoDB for persistence and implemented WebSocket streams for status broadcasts.

CERTIFICATIONS
• Meta Front-End Developer Professional Certificate (2023)
• Python Data Structures & Algorithms Specialization - Coursera
"""

SAMPLE_JOB_DESCRIPTION = """Senior / Full-Stack Software Engineer
Company: CloudScale Technologies
Location: San Francisco, CA (Hybrid)

About the Role:
CloudScale is looking for a talented Software Engineer to join our core platform engineering team. You will be designing high-throughput web applications, building scalable REST APIs, and maintaining cloud-native services in a fast-paced environment.

Key Responsibilities:
• Build, scale, and maintain robust web applications using Python, Java, and modern frontend frameworks like React.
• Architect and optimize relational databases (SQL, PostgreSQL) and high-concurrency data storage systems.
• Experience developing RESTful APIs and backend microservices that serve millions of daily requests.
• Containerize microservices using Docker and orchestrate workloads with Kubernetes.
• Deploy, monitor, and scale infrastructure across Amazon Web Services (AWS) and Linux server environments.
• Champion engineering best practices, including Git workflows, automated CI/CD pipelines, code reviews, and test automation.

Required Qualifications & Skills:
• Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience.
• 2+ years of professional software development experience.
• Strong proficiency in Python, Java, or modern backend languages.
• Solid foundation in SQL databases and schema design.
• Hands-on experience developing REST APIs and integrating third-party services.
• Experience with Git version control and modern Linux command-line tooling.
• Working knowledge of containerization (Docker) and Cloud platforms (AWS, GCP, or Azure).
• Familiarity with Machine Learning concepts or data processing is a plus.
"""

def generate_sample_pdf(output_path: str):
    doc = pymupdf.open()
    page = doc.new_page(width=595, height=842) # A4
    rect = pymupdf.Rect(50, 50, 545, 800)
    page.insert_textbox(rect, SAMPLE_RESUME_TEXT, fontsize=10, fontname="helv", color=(0.1, 0.15, 0.2))
    doc.save(output_path)
    doc.close()

def generate_sample_docx(output_path: str):
    doc = docx.Document()
    for line in SAMPLE_RESUME_TEXT.split("\n"):
        doc.add_paragraph(line)
    doc.save(output_path)
