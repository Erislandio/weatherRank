# WeatherRank - Backend (API) 🔵

The backend of WeatherRank is built with [NestJS](https://nestjs.com/) and provides a GraphQL API to search for cities and fetch weather data.

## 🚀 Features

- **GraphQL API:** Clean and typed interface for the frontend.
- **Open-Meteo Integration:** Consumes real-time weather data from Open-Meteo.
- **Coordinate Conversion:** Searches for cities and returns latitude/longitude.
- **Secure:** CORS enabled for local development.

## 🛠️ Development

### Setup
```bash
npm install
```

### Running
```bash
# Watch mode (auto-reload)
npm run start:dev
```

### Testing
```bash
# Unit tests
npm run test
```

## 📜 API Documentation

Once the server is running, visit:
`http://localhost:3000/graphql` to explore the schema and test queries.

### Example Query

```graphql
query {
  cities(city: "London") {
    name
    country
    latitude
    longitude
  }
}
```

## 🏗️ Technical Details

- **Module:** `WeatherModule`
- **Service:** `WeatherService` (handles external API calls)
- **Controller:** REST endpoints (alternative to GraphQL)
- **Resolver:** GraphQL implementation
- **DTOs:** Type definitions for API responses
