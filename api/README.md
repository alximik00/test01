# Rails API Project

A Rails API-only application with Devise authentication and Items CRUD operations.

## Setup

1. Install dependencies:
```bash
bundle install
```

2. Create and setup the database:
```bash
rails db:create
rails db:migrate
```

3. Start the Rails server:
```bash
rails server
```

The API will be available at `http://localhost:3000`

## Database Configuration

- Database: MySQL
- Username: admin
- Password: pass12345
- Host: localhost

## API Endpoints

### Authentication

- `POST /api/v1/signup` - Create a new user account
  - Body: `{ "user": { "email": "user@example.com", "password": "password", "password_confirmation": "password" } }`

- `POST /api/v1/login` - Login
  - Body: `{ "email": "user@example.com", "password": "password" }`

- `DELETE /api/v1/logout` - Logout
  - Headers: `Authorization: Bearer <token>`

### Items

All items endpoints require authentication token in the header: `Authorization: Bearer <token>`

- `GET /api/v1/items` - List all items for the current user
- `GET /api/v1/items/:id` - Get a specific item
- `POST /api/v1/items` - Create a new item
  - Body: `{ "item": { "name": "Item Name", "description": "Item Description" } }`
- `PUT /api/v1/items/:id` - Update an item
  - Body: `{ "item": { "name": "Updated Name", "description": "Updated Description" } }`
- `DELETE /api/v1/items/:id` - Delete an item

## Authentication

The API uses token-based authentication. After login or signup, you'll receive an `authentication_token` that should be included in subsequent requests as a Bearer token in the Authorization header.
