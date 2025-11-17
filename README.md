# Ticket Management API

A simple REST API for creating and managing tickets with Swagger documentation.

## Features

- ✅ Create tickets with title and description
- ✅ Retrieve all tickets
- ✅ File-based JSON storage (easy to handle with Node.js)
- ✅ Swagger UI documentation
- ✅ Unique ticket IDs (UUID)
- ✅ Automatic timestamp on creation

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

The server will start at `http://localhost:3000`

## API Endpoints

### Create a Ticket

**POST** `/tickets`

Request body:

```json
{
  "title": "Fix login bug",
  "description": "Users are unable to login with special characters in password"
}
```

Response (201 Created):

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Fix login bug",
  "description": "Users are unable to login with special characters in password",
  "createdAt": "2025-11-17T10:30:00.000Z"
}
```

### Get All Tickets

**GET** `/tickets`

Response (200 OK):

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Fix login bug",
    "description": "Users are unable to login with special characters in password",
    "createdAt": "2025-11-17T10:30:00.000Z"
  }
]
```

### Health Check

**GET** `/health`

Response (200 OK):

```json
{
  "status": "OK"
}
```

## Swagger Documentation

Access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

## Data Storage

All tickets are stored in `tickets.json` in JSON format, making it easy to work with in Node.js.

Example `tickets.json`:

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Fix login bug",
    "description": "Users are unable to login with special characters in password",
    "createdAt": "2025-11-17T10:30:00.000Z"
  }
]
```

## Schema

Each ticket contains:

- **id**: Unique identifier (UUID v4)
- **title**: Ticket title (required)
- **description**: Detailed description (required)
- **createdAt**: ISO 8601 timestamp

## Dependencies

- `express`: Web framework
- `swagger-ui-express`: Swagger UI middleware
- `swagger-jsdoc`: Swagger documentation generator
- `uuid`: UUID generation
