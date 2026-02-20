# Mercado Frontend

Frontend application for **Mercado – Product Intelligence Engine**.
This UI allows users to submit products for analysis, track job progress in real time, and download AI-generated intelligence reports produced by the backend microservices system.

The frontend is built with **React + Vite** and communicates with a production-grade backend via REST APIs.

---

## Project Overview

Mercado Frontend provides a clean and minimal interface to:

* Submit product research requests
* Track analysis progress (async jobs)
* View structured results
* Download PDF intelligence reports

It acts as the **presentation layer** for the backend Product Intelligence Engine.

 **Backend Repository:**
[https://github.com/pavithra2870/Mercado-Backend](https://github.com/pavithra2870/Mercado-Backend)

---

## Tech Stack

| Category        | Technology        | Purpose                             |
| --------------- | ----------------- | ----------------------------------- |
| Framework       | React 18          | UI rendering                        |
| Build Tool      | Vite              | Fast development & optimized builds |
| Language        | JavaScript (ES6+) | Application logic                   |
| Styling         | CSS Modules       | Component-level styling             |
| HTTP            | Fetch API         | Backend communication               |
| Linting         | ESLint            | Code quality                        |
| Package Manager | npm               | Dependency management               |

---

## Application Features

* **Landing Page**
  High-level introduction to the product intelligence workflow.

* **Product Research Page**

  * Submit product name and metrics
  * Trigger backend analysis
  * Poll job status
  * Display progress updates

* **Report Access**

  * Download AI-generated PDF reports
  * View structured JSON results (if enabled)

* **API Abstraction Layer**
  Centralized API logic for backend communication.

---

## Project Structure

```bash
frontend/
├── node_modules/              # Installed dependencies
├── public/                    # Static assets
│
├── src/
│   ├── assets/                # Images, icons, static media
│   │
│   ├── services/              # API communication layer
│   │   └── api.js              # Backend API calls
│   │
│   ├── App.jsx                # Root React component
│   ├── App.css                # Global app styles
│   │
│   ├── LandingPage.jsx        # Landing page UI
│   ├── LandingPage.css        # Landing page styles
│   │
│   ├── Layout.jsx             # Shared layout (navbar, wrapper)
│   ├── Layout.css             # Layout styling
│   │
│   ├── ProductResearch.jsx    # Product research workflow UI
│   ├── ProductResearch.css    # Product research styles
│   │
│   ├── index.css              # Base styles
│   ├── main.jsx               # App entry point
│
├── index.html                 # HTML entry
├── eslint.config.js           # ESLint configuration
├── package.json               # Dependencies & scripts
├── package-lock.json          # Locked dependency versions
├── vite.config.js             # Vite configuration
└── README.md                  # This file
```

---

## Frontend ↔ Backend Interaction

The frontend communicates with the backend via REST APIs exposed by the **Gateway Service**.

### Key Backend Endpoints Used

| Endpoint           | Method | Purpose                    |
| ------------------ | ------ | -------------------------- |
| `/analyze`         | POST   | Start product research job |
| `/status/{job_id}` | GET    | Poll job progress          |
| `/report/{job_id}` | GET    | Download PDF report        |

All API logic is centralized in:

```js
src/services/api.js
```

This makes it easy to:

* Swap backend URLs
* Add authentication later
* Handle errors consistently

---

## Environment Setup

### Prerequisites

* Node.js **18+**
* npm **9+**
* Backend running locally or deployed
   [https://github.com/pavithra2870/Mercado-Backend](https://github.com/pavithra2870/Mercado-Backend)

---

### Local Setup Instructions

```bash
# 1. Clone the frontend repository
git clone <frontend-repo-url>
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

---

## Backend Configuration

By default, the frontend expects the backend to run locally.

In `src/services/api.js`, configure the base URL:

```js
const BASE_URL = "http://localhost:8000";
```

If the backend is deployed, replace it with the deployed URL:

```js
const BASE_URL = "https://your-backend-url.com";
```

---

## Running with Backend (Local Dev)

Recommended workflow:

```bash
# Terminal 1: Start backend
cd Mercado-Backend
docker-compose up --build

# Terminal 2: Start frontend
cd frontend
npm run dev
```

---

## Linting & Code Quality

```bash
# Run ESLint
npm run lint
```

---

## Build for Production

```bash
npm run build
```

Build output will be generated in:

```
dist/
```

This can be deployed to:

* Vercel
* Netlify
* Cloudflare Pages
* Nginx / static hosting

---

## Design Philosophy

* **Simple, functional UI** over heavy animations
* **API-driven architecture**
* **Minimal state**, backend is source of truth
* **Easy extensibility** for future features:
---

## Related Repository

**Mercado Backend (Microservices, AI Pipelines):**
 [https://github.com/pavithra2870/Mercado-Backend](https://github.com/pavithra2870/Mercado-Backend)

---
