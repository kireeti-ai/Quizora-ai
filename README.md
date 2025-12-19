# Quizora – AI-Assisted Quiz Platform

Quizora is a **full-stack academic quiz platform** built with **Spring Boot (backend)** and **React (frontend)**.  
It enables **faculty to create quizzes efficiently**—either by **automatically generating questions from a topic** or by **manually adding questions**—and allows **students to securely access quizzes using a unique quiz code**.

---

## ✨ Key Features

- Role-based system for **Faculty** and **Students**
- **AI-assisted question generation** from faculty-provided topics
- **Manual question creation and editing**
- **Quiz access via unique quiz codes**
- Timed quizzes with automated evaluation
- Student score tracking and result summaries
- RESTful API–driven architecture
- Responsive and user-friendly interface

---

## 🧱 Architecture Overview

- Faculty create quizzes → generate or add questions → publish quiz → share quiz code  
- Students enter quiz code → attempt quiz → submit answers → view results  
- All communication is handled through secure backend APIs with role-based access control.

---

## 🛠️ Technology Stack

### Backend
- **Language:** Java 17
- **Framework:** Spring Boot
- **Build Tool:** Maven
- **Database:** PostgreSQL
- **ORM:** Spring Data JPA

### Frontend
- **Library:** React
- **API Client:** Axios
- **Routing:** React Router DOM

---

## 🚀 Getting Started

The project consists of two services that must run **simultaneously**:
- `backend` → Spring Boot REST API
- `frontend` → React application

---

## 🔧 Prerequisites

- Java 17 or later
- Maven
- PostgreSQL
- Node.js (with npm)

---

## ▶️ Backend Setup (Spring Boot)

```bash
cd backend
```

### Configure Database

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/quizora
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Build & Run Backend

```bash
mvn clean install
mvn spring-boot:run
```

Backend will run at:

```
http://localhost:8081
```

---

## 🎨 Frontend Setup (React)

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Environment Configuration

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8081
```

### Run Frontend

```bash
npm start
```

or (if using Vite):

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## 🌐 Access the Application

Once both backend and frontend are running, open:

```
http://localhost:5173
```

---

## 🔌 API Overview

Base URL:

```
http://localhost:8081
```

### Quiz APIs (`/quiz`)
- `POST /quiz/create` — Create a quiz (faculty)
- `GET /quiz/code/{code}` — Fetch quiz using quiz code (student)
- `GET /quiz/all` — List all quizzes (faculty)
- `POST /quiz/submit/{quizId}` — Submit quiz and evaluate
- `DELETE /quiz/delete/{id}` — Delete quiz

### Question APIs (`/question`)
- `POST /question/generate` — Generate questions from a topic (AI-assisted)
- `POST /question/add` — Manually add a question
- `POST /question/add-batch` — Add multiple questions
- `GET /question/quiz/{quizId}` — Get questions for a quiz

---

## 👥 Team & Work Division

- **Backend & System Design:** Authentication, APIs, quiz logic, evaluation, database
- **Frontend & UX:** Dashboards, quiz flow, quiz code entry, results UI

---

## 📌 Use Cases

- Classroom quizzes
- Online assessments
- Faculty-led evaluations with controlled access
- Automated yet customizable quiz creation

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch  
3. Commit your changes  
4. Submit a pull request  

---

## 👤 Author

**Kireeti**  
GitHub: https://github.com/kireeti-ai

---

