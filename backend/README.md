# 👟 JutaHindustani — Backend API

An enterprise-ready REST API built with **Spring Boot 3.3**, utilizing **Spring Security & JWT** for stateless authentication, **Spring Data JPA** for data access, and **MySQL** for persistence.

---

## 🛠️ Tech Stack & Key Libraries
* **Framework**: Spring Boot 3.3.0
* **Security**: Spring Security & JJWT (JSON Web Token) v0.12.5
* **ORM**: Spring Data JPA & Hibernate
* **Database**: MySQL 8.x
* **Utility**: Lombok (reduces boilerplate)
* **Build tool**: Maven wrapper (`mvnw`)

---

## 📁 Packages Structure

```text
backend/src/main/java/com/jutahindustani/
├── admin/                  # Administrative tools and reporting logic
├── auth/                   # JWT creation, claim parsing, and auth filters
├── cart/                   # Shopping cart storage and computation
├── category/               # Product category mapping
├── config/                 # Security configs, CORS settings, password encoders
├── controller/             # REST endpoints (exposing JSON APIs)
├── dto/                    # Data Transfer Objects for clean request/response serialization
├── entity/                 # Hibernate/JPA persistent database entities
├── exception/              # Global custom exception handling controls
├── order/                  # Customer order checkout, processing, and status management
├── product/                # Inventory details, product retrieval, and searches
├── repository/             # Spring Data JPA DB interface files
├── security/               # UserDetailsService and authentication providers
├── service/                # Business logic layer
├── user/                   # User profiles and role permissions management
├── util/                   # Utility helpers
├── DatabaseSeeder.java     # Seeds mock shoes and default accounts on startup
└── JutaHindustaniApplication.java # Spring Boot application main class
```

---

## ⚙️ REST API Endpoints & Routes

The application secures specific endpoints using JWT authorization headers.

| Endpoint | Method | Access | Description |
| :--- | :---: | :---: | :--- |
| `/api/auth/login` | `POST` | Public | Authenticates credentials, returns JWT |
| `/api/auth/register` | `POST` | Public | Registers a new Customer user |
| `/api/products` | `GET` | Public | Retrieves all active shoes in inventory |
| `/api/products/{id}` | `GET` | Public | Retrieves detailed metadata of a specific shoe |
| `/api/cart` | `GET` | Customer | Views active shopping cart |
| `/api/cart/add` | `POST` | Customer | Adds an item or increments item quantity |
| `/api/cart/remove/{id}` | `DELETE`| Customer | Removes an item from the cart |
| `/api/orders` | `POST` | Customer | Submits a shipping form & executes checkout |
| `/api/orders/my-orders`| `GET` | Customer | Lists past orders placed by the current customer |
| `/api/admin/**` | `*` | Admin | Full product CRUD & order management console |

---

## ⚡ Setup & Development

### 1. Database Connection Configuration
Make sure your local MySQL instance is running. Configure credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 2. Launch the Application
Run the boot task using the Maven Wrapper:
```bash
# PowerShell
.\mvnw spring-boot:run

# Windows Command Prompt (CMD)
mvnw spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

The application is configured with `ddl-auto=create`, which creates the schema and executes `DatabaseSeeder.java` to pre-populate products, user accounts, and test scenarios.

### 3. Production Build
Compile and bundle the service into a single executable JAR file:
```bash
.\mvnw clean package
```
The compiled jar file is written to `target/backend-0.0.1-SNAPSHOT.jar`. Run it with `java -jar target/backend-0.0.1-SNAPSHOT.jar`.
