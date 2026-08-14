# RentSphere – Property Rental Management System

RentSphere is a full-stack property rental management platform designed to simplify interactions between **tenants, landlords, and administrators**. The system supports property listing and approval, property discovery, rent negotiation, booking management, online payments, authentication, and role-based dashboards.

The project follows a service-oriented architecture with a React frontend, an ASP.NET Core authentication service, and Spring Boot services for property, booking, and payment operations.

## Features

### Tenant
- Register and log in securely
- Browse and search available rental properties
- View detailed property information and photos
- Add properties to wishlist
- Negotiate rent with landlords
- Send booking requests
- Track booking status
- Make online payments through Razorpay
- View payment receipts
- Access tenant profile, lease, maintenance, and negotiation sections

### Landlord
- Access a dedicated landlord dashboard
- Add new rental properties
- Edit and manage existing property listings
- Track property approval status
- Review rent negotiations
- Manage booking requests
- View payment-related information
- Access maintenance and profile sections

### Administrator
- Access an admin dashboard
- Review property listings
- Approve or reject properties
- Manage users and properties
- Monitor bookings and payments
- View rent inquiries and reports
- Manage admin profile and location-related information

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, React Router, Axios, Bootstrap, Framer Motion, React Toastify, React Icons |
| Authentication Service | ASP.NET Core 8, Entity Framework Core, JWT Authentication, BCrypt |
| Property Service | Spring Boot, Spring Data JPA, MySQL, Multipart File Upload |
| Booking Service | Spring Boot, Spring Data JPA, MySQL, REST APIs |
| Payment Service | Spring Boot, Spring Data JPA, MySQL, Razorpay Java SDK |
| Database | MySQL |
| Build Tools | Maven, npm, .NET CLI |
| Version Control | Git and GitHub |

## Project Architecture

```text
React Frontend
      |
      | REST API calls
      v
+----------------------+        +----------------------+
| ASP.NET Auth Service |        | Property Service     |
| JWT Authentication   |        | Property Management  |
+----------------------+        +----------------------+
                                         |
                                         v
                               +----------------------+
                               | Booking Service      |
                               | Booking/Negotiation  |
                               +----------------------+
                                         |
                                         v
                               +----------------------+
                               | Payment Service      |
                               | Razorpay Integration |
                               +----------------------+

Each backend service uses its own MySQL database.
```

## Project Structure

```text
RentSphere/
├── auth-service/        # ASP.NET Core authentication and JWT service
├── booking-service/     # Booking and rent negotiation service
├── frontend/            # React frontend application
├── payment-service/     # Payment processing and Razorpay integration
├── property-service/    # Property listing, approval and image handling
├── .gitignore
└── README.md
```

## Backend Services

### Authentication Service

The authentication service is implemented using **ASP.NET Core 8**.

Main responsibilities:
- User registration
- User login
- Password hashing using BCrypt
- JWT generation and validation
- Role-based authentication
- Forgot-password and OTP-related flows
- MySQL access through Entity Framework Core

Typical local URL:

```text
http://localhost:5279
```

### Property Service

The property service manages rental property information.

Main responsibilities:
- Create properties
- Update property details
- Retrieve property listings
- Property approval/rejection workflow
- Rental and approval status management
- Upload and retrieve property photos

Default port:

```text
8081
```

### Booking Service

The booking service manages property bookings and rent negotiations.

Main responsibilities:
- Create booking requests
- Approve/reject bookings
- Maintain booking status
- Create rent negotiation requests
- Accept/reject negotiation actions
- Communicate with the property service
- Process booking updates after successful payments

Default port:

```text
8082
```

### Payment Service

The payment service handles payment creation and verification.

Main responsibilities:
- Create Razorpay orders
- Verify successful payments
- Store payment information
- Generate receipt numbers
- Notify the booking service after successful payment

Default port:

```text
8083
```

## Databases

RentSphere uses separate MySQL databases for its backend services:

```text
rentsphere_auth
rentsphere_property
rentsphere_booking
rentsphere_payment
```

Spring Data JPA and Entity Framework Core are used for persistence depending on the service.

## Application Flow

```text
User Registration / Login
          |
          v
Role-Based Dashboard
          |
          +-------------------------------+
          |                               |
          v                               v
   Browse Properties               Landlord Adds Property
          |                               |
          v                               v
   Property Details                 Admin Approval
          |
          v
   Rent Negotiation
          |
          v
    Booking Request
          |
          v
 Landlord Approval
          |
          v
     Online Payment
          |
          v
 Razorpay Verification
          |
          v
 Booking Confirmation
```

## Prerequisites

Install the following before running the project:

- Node.js 20 or later
- npm
- .NET 8 SDK
- Java 21 for property and booking services
- Java 17 or later for payment service
- Maven
- MySQL
- Razorpay test account and API credentials for payment testing

## Running the Project

### 1. Clone the repository

```bash
git clone https://github.com/HarshadaGhate20/RentSphere.git
cd RentSphere
```

### 2. Configure MySQL

Create/configure the required databases and update the database connection settings for each backend service.

> For security, database passwords, JWT secrets and API keys should be stored in environment variables or local configuration that is not committed to GitHub.

### 3. Run the Authentication Service

```bash
cd auth-service
dotnet restore
dotnet run
```

### 4. Run the Property Service

Open a new terminal:

```bash
cd property-service
./mvnw spring-boot:run
```

On Windows Command Prompt/PowerShell, use:

```bash
mvnw.cmd spring-boot:run
```

### 5. Run the Booking Service

```bash
cd booking-service
./mvnw spring-boot:run
```

### 6. Configure Razorpay

Set your Razorpay test credentials as environment variables before starting the payment service:

```bash
export RAZORPAY_KEY_ID="your_test_key_id"
export RAZORPAY_KEY_SECRET="your_test_key_secret"
```

### 7. Run the Payment Service

```bash
cd payment-service
./mvnw spring-boot:run
```

### 8. Run the React Frontend

```bash
cd frontend
npm install
npm start
```

The frontend normally runs at:

```text
http://localhost:3000
```

## API Communication

The frontend communicates with the backend services through REST APIs. The backend services also communicate with each other where required, for example:

```text
Booking Service -> Property Service
Payment Service -> Booking Service
```

This separation keeps property, booking, authentication, and payment responsibilities independently organized.

## Security

The application includes:

- JWT-based authentication
- Role-based protected routes
- BCrypt password hashing
- Backend validation
- CORS configuration
- Razorpay payment verification

Sensitive values such as database passwords, JWT signing keys and payment secrets should not be committed to the repository.

## Screenshots

Add screenshots of the application here to make the repository easier to understand.

Recommended screenshots:

- Home page
- Login / registration
- Explore Properties
- Property Details
- Tenant Dashboard
- Landlord Dashboard
- Admin Dashboard
- Property Approval
- Rent Negotiation
- Booking
- Razorpay Payment

Example structure:

```text
screenshots/
├── home.png
├── tenant-dashboard.png
├── landlord-dashboard.png
├── admin-dashboard.png
└── payment.png
```

Then display them in this README using:

```markdown
![Home Page](screenshots/home.png)
```

## Future Enhancements

Possible future improvements include:

- Email/SMS notifications
- Cloud deployment
- Docker-based deployment
- API gateway and centralized service discovery
- Advanced property recommendations
- Real-time notifications
- Document upload and lease management enhancements
- Automated testing and CI/CD pipeline

## Author

**Harshada Ghate**

GitHub: [HarshadaGhate20](https://github.com/HarshadaGhate20)

---

This project was developed as a full-stack property rental management solution to demonstrate frontend development, REST API integration, authentication, microservice-style backend design, database operations, and online payment integration.
