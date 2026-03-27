# WeatherRank - Frontend (UI) 🟢

The frontend of WeatherRank is an interactive dashboard built with [React 19](https://react.dev/), [Vite](https://vitejs.dev/), and [Tailwind CSS v4](https://tailwindcss.com/).

## 🌟 Highlights

- **Dynamic Search:** Real-time city results with debounced search.
- **7-Day Forecast:** Detailed view of upcoming weather, including rain and snow predictions.
- **Activity Ranking:** Smart scoring logic for activities:
  - **Skiing:** Ranks based on snowfall, snow depth, and sub-zero temperatures.
  - **Surfing:** Ranks based on wind speed and comfortable temperatures.
  - **Sightseeing:** Ranks based on average temperatures and precipitation.
- **Modern UI:** Glassmorphism effects, starfield background, and smooth animations.

## 🛠️ Setup & Run

### Install Dependencies
```bash
npm install
```

### Run Dev Server
```bash
# Starts the frontend at http://localhost:5173
npm run dev
```

### Run Tests
```bash
# Unit and component tests using Vitest
npm test
```

## 🏗️ Architecture

- **`src/components`**: Custom UI components and [shadcn/ui](https://ui.shadcn.com/) primitives.
- **`src/lib/graphql.ts`**: Minimalist fetch-based GraphQL client.
- **`src/lib/weather.ts`**: Weather aggregation and activity ranking logic.
- **`src/types`**: Shared TypeScript definitions.

## 🎨 Tech Stack Detail

- **Vite:** High-performance bundler.
- **Tailwind v4:** Using the new `@tailwindcss/vite` plugin for lightning-fast styling.
- **jsdom:** Virtual browser environment for testing React components.
