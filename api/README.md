# Rails API Project

A Rails API-only application for listings search and city autocomplete, integrated with the Boom Booking API.

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

3. Import cities for autocomplete:
```bash
rails cities:import
```

This imports unique city names from `db/seed_data/uscities.csv`. The CSV file should be present in the `db/seed_data/` directory.

4. Start the Rails server:
```bash
BOOM_CLIENT_SECRET=<boom_client_secret> BOOM_CLIENT_ID=<boom_client_id> rails server
```

The API will be available at `http://localhost:3000`

## Database Configuration

- Database: MySQL
- Username: admin
- Password: pass12345
- Host: localhost

## Environment Variables

The API requires the following environment variables for Boom Booking API integration:

- `BOOM_CLIENT_ID` - Boom API client ID
- `BOOM_CLIENT_SECRET` - Boom API client secret

Set these in your environment or `.env` file before starting the server.

## Importing Cities

The city autocomplete feature requires city data to be imported into the database. After running migrations, execute:

```bash
rails cities:import
```

This task:
- Reads city names from `db/seed_data/uscities.csv`
- Extracts unique city names (ignoring duplicates)
- Inserts them in batches of 1000 for performance
- Displays progress and final count

**Note:** Ensure `db/seed_data/uscities.csv` exists before running the import task.

## API Endpoints

### Listings

- `GET /api/v1/listings` - Search listings
  - Query parameters:
    - `city` (required) - City name to search
    - `check_in` (required) - Check-in date (YYYY-MM-DD)
    - `check_out` (required) - Check-out date (YYYY-MM-DD)
    - `page` (optional) - Page number for pagination
  - Returns: Listings with pagination info from Boom Booking API

### Cities

- `GET /api/v1/cities` - City autocomplete
  - Query parameters:
    - `q` (required) - Search query (minimum 2 characters recommended)
  - Returns: Array of cities matching the query (max 10 results)

## Boom Booking API Integration

The listings endpoint integrates with the Boom Booking API to fetch available listings. The API:
- Authenticates using client credentials
- Forwards search parameters to Boom
- Returns listings with full details including pricing, images, and location information
