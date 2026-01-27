# Quizora – AI-Assisted Online Quiz Platform

Quizora is a **full-stack, AI-augmented academic quiz platform** designed for modern classrooms and online evaluations.
It enables **faculty to create, control, and publish quizzes efficiently**, while allowing **students to securely access and attempt quizzes using a unique quiz code**.

The platform integrates **Large Language Models (LLMs)** via **Spring AI** to generate **syllabus-aligned, academically grounded questions**, while preserving **full faculty control** over final quiz content.

---

## 1. Project Overview

Quizora addresses limitations in traditional quiz systems such as manual question creation, unsecured access, and lack of scalability.
Faculty can either:
- Automatically generate questions from a topic using AI (grounded via RAG/Context).
- Manually create and edit questions with complete academic control.

Once a quiz is published, a **unique quiz code** is generated. Students enter this code to access the quiz directly.

The system follows a strict **role-based architecture**:
- **Faculty:** Quiz creation, AI generation, publishing, analytics.
- **Students:** Quiz access, attempts, results.

---

## 2. Key Features

- **Role-based Access Control:** Secure Faculty and Student logins.
- **Multi-Factor Authentication (2FA):** Email-based OTP verification for enhanced security.
- **AES-256 Encryption:** Secure encryption for sensitive user data.
- **QR Code Generation:** User identity verification via QR codes.
- **AI-Assisted Question Generation:** Upload a PDF (Syllabus/Notes) and generate questions automatically using Groq/OpenAI models.
- **Manual Question Management:** Full CRUD capabilities for quiz questions.
- **Unique Quiz Codes:** Secure, code-based access for students (no complex enrollment needed).
- **Auto-Evaluation:** Instant scoring and result generation.
- **Analytics Dashboard:** Faculty can view performance metrics and student attempts.
- **Secure Architecture:** JWT-based authentication and BCrypt password hashing.

For detailed security features documentation, see [SECURITY_FEATURES.md](SECURITY_FEATURES.md).

---

## 3. Technology Stack

### Backend
- **Language:** Java 17
- **Framework:** Spring Boot 3.4.1
- **AI Integration:** Spring AI (Groq / OpenAI compatible)
- **Database:** MySQL
- **ORM:** Spring Data JPA
- **Authentication:** JWT (JSON Web Tokens) & Spring Security
- **Security:** 2FA with OTP, AES-256 Encryption, QR Code Generation
- **Build Tool:** Maven

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** CSS3 / Lucide React Icons
- **HTTP Client:** Axios
- **Routing:** React Router DOM

---

## 4. Getting Started

### Prerequisites
- Java 17 SDK
- Maven
- MySQL Server
- Node.js (npm)

---

## 5. Backend Setup

1. **Configure Database:**
   Update `backend/src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/quizora_db
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
Backend runs on:
```
http://localhost:8081
```

---

## 6. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## 7. Project Structure

```
Quizora/
├── frontend/
├── backend/
└── README.md
```


---

## 8. Author

**Kireeti**  
GitHub: https://github.com/kireeti-ai

---

## 9. Conclusion

Quizora represents a modern AI-augmented academic assessment platform combining automation, control, security, and scalability—ideal for both real-world deployment and B.Tech final-year evaluation.
