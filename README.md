# Interview Project

This project consists of two applications:

1. **Rails API** - Backend API with Devise authentication and Items CRUD
2. **React Frontend** - Frontend application with Redux

## Quick Start

### 1. Start the Rails API

```bash
cd api
bundle install
rails db:create
rails db:migrate
rails server
```

The API will run on `http://localhost:3000`

### 2. Start the React Frontend

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000` (or another port if 3000 is taken)

## Database Setup

The Rails API uses MySQL with the following credentials:
- Username: `admin`
- Password: `pass12345`
- Host: `localhost`

Make sure MySQL is running and accessible with these credentials before running `rails db:create`.

## Features

### Rails API
- Devise authentication with token-based auth
- Items model with name and description
- RESTful API endpoints
- CORS configured for React frontend

### React Frontend
- Redux Toolkit for state management
- User authentication (login/signup)
- Items CRUD operations
- Protected routes
- Modern UI

## Project Structure

```
interview2/
  api/              - Rails API application
  frontend/         - React frontend application
```

See individual README files in each directory for more details.

