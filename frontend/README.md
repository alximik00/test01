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

The frontend is configured to connect to the Rails API at `http://localhost:3000/api/v1`. Make sure the Rails server is running before starting the frontend.

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
