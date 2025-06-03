# Charging Station Management System

A modern web application for managing electric vehicle charging stations. Built with Vue.js for the frontend and Node.js/Express for the backend.

## Features

### 🔋 Station Management

- Create, view, edit, and delete charging stations
- Detailed station information including:
  - Location (address, latitude, longitude)
  - Power output
  - Connector type
  - Operational status

### 🗺️ Interactive Views

- List view with detailed station cards
- Interactive map view using OpenStreetMap
- Real-time station status updates

### 🔍 Advanced Filtering

- Search by station name or address
- Filter by:
  - Operational status (Active/Inactive)
  - Minimum power output
  - Connector type
- Clear filters functionality

### 👤 User Authentication

- Secure user registration and login
- JWT-based authentication
- Protected routes and operations
- User-specific station management

### 🎨 Modern UI/UX

- Responsive design for all devices
- Clean and intuitive interface
- Real-time feedback and loading states
- Success/error notifications

## Tech Stack

### Frontend

- Vue.js 3
- Vue Router
- Axios
- Tailwind CSS
- Leaflet (for maps)

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/dev-ruchi/charging-station-management-system.git
cd charging-station-management-system
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd frontend
npm install
```

4. Create a `.env` file in the backend directory:

## Copy .env file from .env.example:

`cp .env.example .env`
Update the values in the `.env` file

### Running the Application

1. Start the backend server:

```bash
cd backend
npm start
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Stations

- `GET /api/stations` - Get all stations
- `GET /api/stations/:id` - Get specific station
- `POST /api/stations` - Create new station
- `PUT /api/stations/:id` - Update station
- `DELETE /api/stations/:id` - Delete station

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenStreetMap for map data
- Tailwind CSS for styling
- Vue.js team for the amazing framework
