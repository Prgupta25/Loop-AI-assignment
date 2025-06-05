# Data Ingestion API System

This project implements a simple data ingestion API system with a backend built using Node.js and Express.js, and a basic frontend for interaction. The system processes data ingestion requests in batches, asynchronously, while respecting a rate limit and processing requests based on priority.

## Requirements

The system fulfills the following requirements:

-   **Ingestion API (`POST /ingest`):** Accepts a JSON payload with a list of integer IDs and a priority (HIGH, MEDIUM, or LOW).
-   **Status API (`GET /status/:ingestionId`):** Retrieves the processing status of a given ingestion request.
-   Processes IDs in batches of 3.
-   Enqueues each batch as a job to be processed asynchronously.
-   Simulates fetching data for each ID with a delay and static response.
-   Respects a rate limit of 1 batch processed per 5 seconds.
-   Prioritizes higher-priority requests and processes based on creation time for the same priority.
-   Persists ingestion and batch statuses in memory (for this implementation).

## Project Structure

The project is structured into two main directories:

-   `backend`: Contains the Node.js/Express.js application code for the API.
    -   `src/`: Source files for the backend (app setup, server, routes, controllers, services, in-memory store).
    -   `package.json`: Backend dependencies.
    -   `.env`: Environment variables for configuration.
-   `frontend`: Contains the basic HTML and JavaScript for a simple web interface.
    -   `public/`: Static files (index.html).
    -   `src/`: Frontend JavaScript (main.js).
    -   `package.json`: Frontend dependencies (Parcel for development).
-   `.gitignore`: Specifies files and directories to be ignored by Git (like `node_modules`).
-   `README.md`: Project documentation (this file).

## Setup and Running Locally

**Prerequisites:**

-   Node.js (v14 or later recommended)
-   npm (comes with Node.js)
-   Git

**1. Clone the repository:**

```bash
git clone https://github.com/Prgupta25/Loop-AI-assignment.git
cd Loop-AI-assignment
```

**2. Backend Setup:**

-   Navigate into the `backend` directory:
    ```bash
    cd backend
    ```
-   Install backend dependencies:
    ```bash
    npm install
    ```
-   Create a `.env` file in the `backend` directory and add the following (or modify as needed):
    ```env
    PORT=5000
    BATCH_SIZE=3
    RATE_LIMIT_MS=5000
    ```
-   Start the backend server:
    ```bash
    npm start
    ```
    The backend API will run on `http://localhost:5000` (or the port specified in your `.env` file).

**3. Frontend Setup:**

-   Open a new terminal and navigate into the `frontend` directory:
    ```bash
    cd frontend
    ```
-   Install frontend dependencies:
    ```bash
    npm install
    ```
-   Start the frontend development server using Parcel:
    ```bash
    npm start
    ```
    The frontend will be available at `http://localhost:3000`.

## API Endpoints

**1. Ingestion API**

-   **Endpoint:** `POST /ingest`
-   **URL (Local):** `http://localhost:5000/ingest`
-   **URL (Deployed - based on screenshot):** `https://loop-ai-assignment-4avg7.onrender.com/ingest`
-   **Method:** `POST`
-   **Content-Type:** `application/json`
-   **Body:**
    ```json
    {
      "ids": [integer, ...],
      "priority": "HIGH" | "MEDIUM" | "LOW"
    }
    ```
-   **Response:**
    ```json
    {
      "ingestion_id": "unique-uuid"
    }
    ```

**2. Status API**

-   **Endpoint:** `GET /status/:ingestionId`
-   **URL (Local):** `http://localhost:5000/status/:ingestionId`
-   **URL (Deployed - based on screenshot):** `https://loop-ai-assignment-4avg7.onrender.com/status/:ingestionId`
-   **Method:** `GET`
-   **Parameters:** `:ingestionId` (the ID returned by the Ingestion API)
-   **Response:**
    ```json
    {
      "ingestion_id": "unique-uuid",
      "status": "yet_to_start" | "triggered" | "completed",
      "batches": [
        {
          "batch_id": "batch-uuid",
          "ids": [integer, ...],
          "status": "yet_to_start" | "triggered" | "completed"
        },
        // ... more batches
      ]
    }
    ```

## How the Project Works (Behavior Implementation)

-   **Batching (3 IDs):** The `backend/src/services/ingestionService.js` file defines `batchSize = 3`. The `handleIngestion` function splits the incoming list of IDs into batches of this size.
-   **Asynchronous Processing & Queue:** The `handleIngestion` function adds new ingestion requests (containing their batches) to an in-memory `queue` (`backend/src/store/memoryStore.js`). The `processQueue` function runs independently and processes requests from this queue.
-   **Simulated External API:** The `processBatch` function in `ingestionService.js` simulates external calls using `setTimeout` with a delay and returns a static "processed" response for each ID.
-   **Rate Limit (1 batch per 5 seconds):** A `setTimeout` with a duration of `rateLimitMs` (configured via environment variable, default 5000ms) is used in `processQueue` to pause between processing batches.
-   **Priority and Creation Time Ordering:** The `processQueue` function sorts the `store.queue` based on a mapped priority value (HIGH > MEDIUM > LOW) and then by the `createdAt` timestamp to ensure higher priority requests are processed first, and older requests of the same priority are handled earlier.
-   **Status Tracking:** Statuses are stored in the `store.ingestions` object in `memoryStore.js`. The `getIngestionStatus` function determines the overall status based on the statuses of individual batches.

## Data Storage

Data (ingestion requests, batches, and statuses) is stored in a simple in-memory object (`backend/src/store/memoryStore.js`). This means the data is not persistent and will be lost if the backend server restarts.

## Testing

A test file is required to fully verify the functionality, particularly the rate limiting and priority queueing. You would typically use a testing framework (like Mocha, Jest, or Supertest) to send requests to the API and assert the responses and processing behavior over time.

## Deployment

The screenshots indicate the backend has been deployed to Render.com, which is a suitable platform for hosting the Node.js backend with its queueing mechanism.

The frontend, which is a static site, can be hosted on platforms like Vercel, Netlify, or also Render.

To get a single hosted web link for the frontend, you would:
1.  Deploy the backend to a platform like Render (which appears to be done).
2.  Get the public URL of the deployed backend.
3.  Update the `backendUrl` variable in `frontend/src/main.js` to this public URL.
4.  Deploy the `frontend` directory as a static site on a platform like Vercel or Render.

## Screenshots

Below are screenshots demonstrating the API interaction using a tool like Postman or a similar API client.

**Ingestion Request Example:**

![Ingestion Request Example](images/ingestion-request.png)

**Status Check Example:**

![Status Check Example](images/status-check.png)

---

**Note:** Please place your screenshot image files in an `images` folder at the root of the project and ensure the filenames match the paths above. If you save them elsewhere, update the paths in this README file accordingly.