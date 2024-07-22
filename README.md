# NestJS Two-Factor Authentication Project

## Description

This backend application, built with the Nest framework, serves as the server-side component for a job application project. It handles user authentication, including two-factor authentication via email, and interacts with a PostgreSQL database using TypeORM.

## Technologies Used

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=fingerprintjs,nestjs,typeorm,postgres,jwt,nodemailer" />
  </a>
</p>

## Modules

### AppModule

**Imports:**
- `ConfigModule`: Loads environment variables.
- `TypeOrmModule`: Configures TypeORM with PostgreSQL.
- `AuthModule`, `UsersModule`, `MailModule`: Custom application modules for authentication, user management, and mailing functionalities.

## Services

### AuthService

- `signUp`: Handles user registration, including password hashing.
- `logIn`: Handles user login, verifying credentials and checking for 2FA.
- `verifyEmail`: Sends a verification email with a JWT token.
- `verifiedLogin`: Verifies the JWT token from the email link and completes the login process.

### UsersService

- `addUserDetails`: Adds a new user to the database.
- `getAllUsers`: Retrieves all users.
- `getUserByEmail`: Retrieves a user by email.
- `checkUserExists`: Checks if a user exists by email or visitorId.
- `logIn`: Validates user credentials and 2FA status.
- `change2FAStatus`: Updates the 2FA status of a user.

### MailService

- `verifyEmail`: Sends a verification email with a token link.

## Controllers

### AuthController

- `signUp (POST /auth/sign-up)`: Registers a new user.
- `logIn (POST /auth/log-in)`: Logs in an existing user.
- `verifyEmail (POST /auth/verify-email)`: Sends a verification email.
- `verifiedLogin (POST /auth/verified-log-in)`: Verifies email link and logs in the user.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/kssampson/fingerprint-project-backend.git
    cd fingerprint-project-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up the environment variables by creating a `.env` file in the root directory and adding the following:
    ```env
    DATABASE_HOST=your_database_host
    DATABASE_PORT=your_database_port
    DATABASE_USERNAME=your_database_username
    DATABASE_PASSWORD=your_database_password
    DATABASE_NAME=your_database_name
    GMAIL_USER=your_gmail_user
    GMAIL_PASSWORD=your_gmail_password
    ```
<br>
## Running the app

To start the application, run:

```bash
# development mode
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```
## ✉ Find me on:
<br />
<p align="left">
 <a href="https://www.linkedin.com/in/sampsonkyle/" target="_blank" rel="noopener noreferrer">
  <img src="https://skillicons.dev/icons?i=linkedin" alt="LinkedIn" height="40" style="vertical-align:top; margin:4px 10px 4px 0;">
 </a>
 <a href="mailto:kylesampsonmusic@gmail.com">
  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/gmail.svg" alt="Email" height="40" style="vertical-align:top; margin:4px 0 4px 10px;">
 </a>
</p>
