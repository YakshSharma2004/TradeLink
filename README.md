# TradeLink

TradeLink is a platform connecting Builders and Tradesmen in the construction industry. It facilitates project management, trade listings, and real-time communication between professionals.

## Features

### For Builders
*   **Project Management**: Create construction projects with descriptions and images for showcasing.
*   **Find Tradesmen**: Browse and filter trade listings by trade type, area, and rate.
*   **Direct Communication**: Chat directly with tradesmen to discuss opportunities.

### For Tradesmen
*   **Create Listings**: Post trade listings to showcase services, rates, and experience.
*   **Find Projects**: (Future feature) Browse available projects posted by builders.
*   **Profile Management**: Manage professional profile and portfolio.

### General Features
*   **Role-Based Authentication**: Secure signup and login for Builders and Tradesmen.
*   **Real-time Messaging**: Instant chat functionality powered by Socket.io.
*   **Dark Mode**: Fully responsive UI with light and dark theme support.
*   **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

### Frontend (`Trade_Link`)
*   **Framework**: React (Vite)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, Shadcn UI
*   **State Management**: React Hooks
*   **Routing**: React Router
*   **Icons**: Lucide React

### Backend (`server`)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose)
*   **Real-time**: Socket.io

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file.

### Backend (`server/.env`)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Port for the backend server | `3001` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/tradelink` |
| `CLIENT_ORIGIN` | URL of the frontend application | `http://localhost:3000` |

### Frontend (`Trade_Link/.env`)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL of the backend API | `http://localhost:3001/api` |

## Prerequisites

*   Node.js (v18 or higher)
*   MongoDB (Local instance or Atlas URI)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YakshSharma2004/TradeLink.git
cd TradeLink
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory based on the example:
```bash
cp .env.example .env
# Edit .env to match your configuration
```

Start the backend server:
```bash
# Development mode with auto-reload
npx nodemon index.js

# OR standard node
node index.js
```
The server runs on `http://localhost:3001`.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd Trade_Link
npm install
```

Create a `.env` file in the `Trade_Link` directory based on the example:
```bash
cp .env.example .env
# Edit .env to match your configuration
```

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## Running Tests

The project includes a comprehensive API test suite located in `server/tests`.

To run the tests:
1.  Ensure the backend server is running (`node server/index.js`).
2.  Run the test script:
    ```bash
    node server/tests/run_tests.js
    ```

This will verify:
*   Authentication (Signup/Login)
*   User Management
*   Project Operations
*   Trade Listings
*   Messaging Functionality

## Project Structure

```
TradeLink/
├── server/                 # Backend Node.js/Express application
│   ├── models/             # Mongoose schemas (User, Project, TradeListing, Message)
│   ├── routes/             # API routes
│   ├── tests/              # API test scripts
│   └── index.js            # Server entry point
│
├── Trade_Link/             # Frontend React application
│   ├── src/
│   │   ├── components/     # React components (UI, Pages, Features)
│   │   ├── lib/            # Utilities and API client
│   │   └── ...
│   └── ...
└── ...
```

## Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License

This project is not licensed.
