# React Frontend Project

A React frontend application with Redux for state management, connected to the Rails API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Features

- User authentication (Login/Signup)
- Items CRUD operations
- Redux for state management
- Protected routes
- Modern UI with inline styles

## Project Structure

```
src/
  components/
    Login.js          - Login component
    Signup.js         - Signup component
    ItemsList.js      - Items list and management
    ItemForm.js       - Create/Edit item form
  store/
    store.js          - Redux store configuration
    authSlice.js      - Authentication state management
    itemsSlice.js     - Items state management
  services/
    api.js            - Axios API client configuration
```

## API Configuration

The frontend is configured to connect to the Rails API at `http://localhost:3000/api/v1`. Make sure the Rails server is running before starting the frontend.

## Usage

1. Start the Rails API server first
2. Start the React frontend
3. Navigate to `http://localhost:3000`
4. Sign up for a new account or login
5. Create, view, edit, and delete items
