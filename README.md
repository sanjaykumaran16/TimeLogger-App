<<<<<<< HEAD
# TimeLogger - Productivity Time Tracking Application

A comprehensive web application for tracking daily activities and boosting productivity. Built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### Core Features
- **Daily Activity Logging**: Track time spent on activities with custom categories and notes
- **Date-based Filtering**: View and manage logs for any specific date
- **Activity Search**: Search and filter logs by activity name
- **Real-time Statistics**: View daily totals and activity summaries
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Advanced Features
- **Dashboard Analytics**: Comprehensive overview with productivity insights
- **Statistics & Charts**: Detailed analytics and trend analysis
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Category Management**: Organize activities with custom categories
- **Notes & Tags**: Add detailed notes and tags to your logs
- **Data Export**: Export your data for backup or analysis

### Technical Features
- **RESTful API**: Clean and well-documented backend API
- **Real-time Updates**: Instant updates across all components
- **Error Handling**: Comprehensive error handling and user feedback
- **Input Validation**: Robust validation on both frontend and backend
- **Performance Optimized**: Fast loading times and smooth interactions

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Date-fns** - Date manipulation utilities

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Morgan** - HTTP request logger

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd timelogger
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure MongoDB**
   - Start your MongoDB instance
   - Update the connection string in `backend/config.env`:
     ```
     MONGODB_URI=mongodb://localhost:27017/timelogger
     ```

4. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```
   
   This will start both the backend (port 5000) and frontend (port 5173) servers.

### Alternative Setup

You can also run the servers separately:

```bash
# Backend (from backend directory)
node server.js


# Frontend (from frontend directory)
npm run dev
```

## 🏃‍♂️ Quick Start

1. **Start the application**: `npm run dev`
2. **Open your browser**: Navigate to `http://localhost:5173`
3. **Add your first log**: Click "Add Activity" and start tracking your time
4. **Explore features**: Check out the dashboard, statistics, and settings

## 📁 Project Structure

```
timelogger/
├── backend/
│   ├── models/
│   │   └── Log.js              # MongoDB schema
│   ├── routes/
│   │   ├── logs.js             # Log CRUD operations
│   │   ├── stats.js            # Statistics endpoints
│   │   └── dashboard.js        # Dashboard data
│   ├── config.env              # Environment variables
│   ├── package.json            # Backend dependencies
│   └── server.js               # Express server
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── contexts/           # React contexts
│   │   ├── pages/              # Page components
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
├── package.json                # Root package.json
└── README.md                   # This file
```

## 🔧 API Endpoints

### Logs
- `GET /api/logs` - Get all logs with pagination
- `GET /api/logs/date/:date` - Get logs for specific date
- `POST /api/logs` - Create new log entry
- `PUT /api/logs/:id` - Update log entry
- `DELETE /api/logs/:id` - Delete log entry

### Statistics
- `GET /api/stats/overview` - Get overall statistics
- `GET /api/stats/weekly` - Get weekly statistics
- `GET /api/stats/activities` - Get activity statistics
- `GET /api/stats/categories` - Get category statistics
- `GET /api/stats/trends` - Get productivity trends

### Dashboard
- `GET /api/dashboard` - Get dashboard data
- `GET /api/dashboard/insights` - Get productivity insights

## 🎨 UI/UX Features

### Design System
- **Modern Interface**: Clean, intuitive design with smooth animations
- **Responsive Layout**: Adapts to all screen sizes
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages and recovery

### Color Scheme
- **Primary**: Blue (#3B82F6) for main actions and highlights
- **Secondary**: Gray scale for text and backgrounds
- **Success**: Green for positive actions
- **Warning**: Yellow for caution states
- **Error**: Red for error states

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use a process manager like PM2
3. Set up MongoDB Atlas or similar cloud database
4. Configure CORS for your frontend domain

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure the API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
=======

