# quizApp

A quiz application built with Java and Spring Boot.

## Features

- Create, manage, and take quizzes
- Supports multiple question types (multiple choice, true/false, etc.)
- Track user scores and performance
- RESTful API endpoints for easy integration
- User-friendly interface (can be extended with frontend frameworks)

## Technology Stack

- **Language:** Java
- **Framework:** Spring Boot
- **Build Tool:** Maven 
- **Database:**  PostgreSQL
- **Testing:** JUnit, Spring Boot Test

## Getting Started

### Prerequisites

- Java  17 or later
- Maven


### Setup & Run

1. **Clone the repository:**
    ```bash
    git clone https://github.com/kireeti-ai/quizApp.git
    cd quizApp
    ```

2. **Configure the database:**
   - Edit `src/main/resources/application.properties` to set your database connection details.

3. **Build the project:**
    ```bash
    # For Maven
    mvn clean install
    ```

4. **Run the application:**
    ```bash
    # With Maven
    mvn spring-boot:run
    # Or run the generated jar
    java -jar target/quizApp.jar
    ```

5. **Access the API:**
    - By default, the application runs on `http://localhost:8081`
    - API docs may be available at `/swagger-ui/` if Swagger is enabled

### Example Endpoints

- `GET /api/quizzes` — List all quizzes
- `POST /api/quizzes` — Create a new quiz
- `GET /api/questions` — List all questions
- `POST /api/questions` — Add a new question to a quiz

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.


## Author

[kireeti-ai](https://github.com/kireeti-ai)
