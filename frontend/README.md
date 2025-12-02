# React Frontend Project

A React frontend application for searching and viewing property listings, with city autocomplete and Redux state management.

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

- Listings search with city, check-in, and check-out date filters
- City autocomplete with suggestions dropdown
- Listing details view with extended information
- Pagination support for search results
- Redux Toolkit for state management
- Modern UI with inline styles

## Project Structure

```
src/
  components/
    SearchPage.js      - Main search and listings display component
  store/
    store.js          - Redux store configuration
    listingsSlice.js  - Listings state management
  services/
    api.js            - Axios API client configuration
```

## API Configuration

The frontend connects to the Rails API. The API URL can be configured via environment variable:

### Default Configuration

By default, the frontend connects to `http://localhost:3000/api/v1`.

### Custom API URL

To use a different API URL, create a `.env` file in the `frontend` directory:

```bash
REACT_APP_API_URL=http://your-api-host:port/api/v1
```

For example:
- `REACT_APP_API_URL=http://localhost:3000/api/v1` (default)
- `REACT_APP_API_URL=http://api.example.com/api/v1` (production)
- `REACT_APP_API_URL=http://192.168.1.100:3000/api/v1` (local network)

**Note:** After changing the `.env` file, restart the development server for changes to take effect.

Make sure the Rails server is running and accessible at the configured URL before starting the frontend.

## Usage

1. Start the Rails API server first
2. Ensure cities are imported in the database (see API README)
3. Start the React frontend
4. Navigate to `http://localhost:3000`
5. Enter a city name (autocomplete will suggest cities)
6. Select check-in and check-out dates (defaults to next week)
7. Click "Search" to view listings
8. Click on any listing card to view detailed information

## Default Dates

The search form automatically sets default dates:
- Check-in: Next Monday (start of next week)
- Check-out: Next Sunday (end of next week)

These can be changed by the user before searching.
