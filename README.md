# Interview Project

This project consists of two applications:

1. **Rails API** - Backend API for listings search and city autocomplete
2. **React Frontend** - Frontend application with listings search interface

## Quick Start

### 1. Start the Rails API

```bash
cd api
bundle install
rails db:create
rails db:migrate
rails cities:import  # Import cities for autocomplete (see below)
BOOM_CLIENT_SECRET=<boom_client_secret> BOOM_CLIENT_ID=<boom_client_id> rails server
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

## Importing Cities for Autocomplete

The city autocomplete feature requires importing city data into the database. After running migrations, import cities using:

```bash
cd api
rails cities:import
```

This will import unique city names from `db/seed_data/uscities.csv` into the database. The import process:
- Reads from `db/seed_data/uscities.csv`
- Extracts unique city names
- Inserts them in batches for performance
- Shows progress and final count

**Note:** Make sure the CSV file exists at `api/db/seed_data/uscities.csv` before running the import task.

## Features

### Rails API
- Listings search via Boom Booking API integration
- City autocomplete for search functionality
- RESTful API endpoints
- CORS configured for React frontend

### React Frontend
- Redux Toolkit for state management
- Listings search with city, check-in, and check-out dates
- City autocomplete with suggestions
- Listing details view with extended information
- Pagination support
- Modern UI with inline styles

## API Endpoints

- `GET /api/v1/listings` - Search listings by city and dates
  - Query params: `city`, `check_in`, `check_out`, `page` (optional)
- `GET /api/v1/cities` - City autocomplete
  - Query params: `q` (search query)

## Project Structure

```
interview2/
  api/              - Rails API application
  frontend/         - React frontend application
```

See individual README files in each directory for more details.
