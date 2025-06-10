# Task Manager REST API Documentation

## Overview

This is a comprehensive documentation for the Task Manager REST API built with Node.js (Express) and MongoDB. The API provides JWT authentication, rate limiting, CRUD operations with pagination, and automated tests. This backend is designed to work with the [Task Manager Frontend React App](https://github.com/nonso-uj/react-auth-app).

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [API Endpoints](#api-endpoints)
6. [Authentication](#authentication)
7. [Rate Limiting](#rate-limiting)
8. [Pagination](#pagination)
9. [Error Handling](#error-handling)
10. [Testing](#testing)
11. [API Documentation](#api-documentation)
12. [Deployment](#deployment)

## Features

- **JWT Authentication**: Secure user authentication with access and refresh tokens
- **Rate Limiting**: Protection against brute force attacks
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for tasks
- **Pagination**: Efficient data retrieval with page and limit parameters
- **Automated Tests**: Comprehensive test suite using Jest
- **Swagger Documentation**: Interactive API documentation
- **Password Reset**: Secure password reset functionality via email
- **Google OAuth**: User registration/login via Google

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Rate Limiting**: rate-limiter-flexible with Redis
- **Testing**: Jest
- **API Documentation**: Swagger UI
- **Package Manager**: Yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)

4. Start the development server:
   ```bash
   yarn dev
   ```

5. For production:
   ```bash
   yarn start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
APP_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/task-manager
LOCAL_DATABASE_URL=mongodb://localhost:27017/task-manager

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Email (for password reset)
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_email_password

# Redis (for rate limiting)
REDIS_URL=redis://localhost:6379
```

## API Endpoints

### Authentication

| Method | Endpoint                     | Description                     |
|--------|------------------------------|---------------------------------|
| POST   | /api/auth-backend/register    | Register a new user             |
| POST   | /api/auth-backend/google      | Register/login with Google      |
| POST   | /api/auth-backend/login       | Login and get JWT tokens        |
| POST   | /api/auth-backend/refresh-token | Refresh access token            |
| POST   | /api/auth-backend/forgot-password | Request password reset        |
| POST   | /api/auth-backend/set-new-password | Reset password with token    |

### Tasks

| Method | Endpoint                     | Description                     |
|--------|------------------------------|---------------------------------|
| GET    | /api/task-backend/task       | Get all tasks (paginated)       |
| POST   | /api/task-backend/task       | Create a new task               |
| PATCH  | /api/task-backend/task/:taskId | Update a task                  |
| DELETE | /api/task-backend/task/:taskId | Delete a task                  |

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. 

1. Register a user at `/api/auth-backend/register`
2. Login at `/api/auth-backend/login` to receive:
   - Access token (valid for 15 minutes)
   - Refresh token (stored in HTTP-only cookie, valid for 1 day)
3. Include the access token in subsequent requests in the Authorization header:
   ```
   Authorization: Bearer <access-token>
   ```
4. When the access token expires, request a new one at `/api/auth-backend/refresh-token`

## Rate Limiting

The API implements rate limiting to protect against abuse:

- Production: 3 requests per 2 minutes per user
- Development: 100 requests per 2 minutes per user

If rate limited, the API will respond with:
```json
{
  "error": "Rate Limit Exceded, retry after X seconds"
}
```
and include a `Retry-After` header.

## Pagination

Task lists support pagination with the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 5)

Example response:
```json
{
  "success": true,
  "tasks": [...],
  "page": 1,
  "limit": 5,
  "total": 20,
  "pages": 4
}
```

## Error Handling

The API returns consistent error responses:

- **400 Bad Request**: Validation errors or invalid data
- **401 Unauthorized**: Missing or invalid authentication
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server errors

Example error response:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Testing

The API includes automated tests using Jest. To run tests:

```bash
yarn test
```

## API Documentation

Interactive API documentation is available at:
```
/api/docs
```

The documentation is powered by Swagger UI and includes:

- All available endpoints
- Request/response schemas
- Example requests
- Authentication requirements

## License

[MIT License](LICENSE)
