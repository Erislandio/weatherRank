# WeatherRank 🌍☀️

WeatherRank is a modern monorepo application that helps you find the best cities for your favorite activities based on the 7-day weather forecast.

Whether you're looking for the perfect snow to **Ski** 🎿, the best waves to **Surf** 🏄, or just want to know if it's a good day for **Outdoor Sightseeing** 🗺️ vs **Indoor Sightseeing** 🏛️, WeatherRank ranks it for you.

## 🚀 Built With

### Frontend (User Interface)
- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Testing:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### Backend (API)
- **Framework:** [NestJS](https://nestjs.com/)
- **API Protocol:** [GraphQL](https://graphql.org/) + [Apollo Server](https://www.apollographql.com/)
- **HTTP Client:** [Axios](https://axios-http.com/) (to consume [Open-Meteo API](https://open-meteo.com/))
- **Testing:** [Jest](https://jestjs.io/)

---

## 🏗️ Project Structure

```
weatherRank/
├── backend/            # NestJS API (GraphQL)
│   ├── src/weather/    # Core logic (Service, Controller, Resolver)
│   └── test/           # Unit and E2E tests
├── frontend/           # React + Vite UI
│   ├── src/components/ # Shared UI components (shadcn/ui)
│   ├── src/lib/        # Utilities and GraphQL client
│   └── src/types/      # TypeScript definitions
└── docker-compose.yml  # Orchestration for Dev environment
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js 22+](https://nodejs.org/)
- [Docker](https://www.docker.com/) (optional, for containerized dev)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Running with Docker (Recommended)

To run both backend and frontend with **hot reload** enabled:

```bash
docker compose up --build
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:3000](http://localhost:3000)
- **GraphQL Playground:** [http://localhost:3000/graphql](http://localhost:3000/graphql)

### Local Development (Manual)

#### 1. Start the Backend
```bash
cd backend
npm install
npm run start:dev
```

#### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Documentation & Testing

### Running Unit Tests

#### Backend
```bash
cd backend
npm test
```

#### Frontend
```bash
cd frontend
npm test
```

### Activity Scoring Logic

We use a custom algorithm in `frontend/src/lib/weather.ts` that analyzes:
- **Temperature:** Average, Min, Max
- **Precipitation:** Total rain and snow
- **Wind Speed:** Daily averages
- **Snow Depth:** Current and forecast levels

Activities are then ranked from **🥈 Excellent** to **❌ Poor** to provide the best recommendation.

---

## 📄 License
This project is licensed under the UNLICENSED (Private) license.
