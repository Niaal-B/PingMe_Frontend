# PingMe Frontend

Modern React-based frontend for PingMe, a real-time chat application with WebSocket support.

## Features

- **User Authentication**: Login and registration with JWT token management
- **Room Management**: Create, view, and manage chat rooms
- **Real-time Chat**: WebSocket-based instant messaging
- **Typing Indicators**: Real-time typing status for other users
- **Emoji Support**: Emoji picker for enhanced messaging
- **Message History**: Automatic message loading and persistence
- **Responsive Design**: Modern UI with Tailwind CSS
- **Protected Routes**: Secure navigation with authentication guards

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **WebSockets**: Native WebSocket API
- **UI Components**: 
  - Lucide React (icons)
  - Radix UI (toast notifications)
  - Framer Motion (animations)
  - Emoji Picker React
- **State Management**: React Context API

## Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8000`

## Installation

1. **Navigate to frontend directory**
   ```bash
   cd PingMe_Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed)
   
   Update the API base URL in `src/api/axiosInstance.js` if your backend runs on a different port:
   ```javascript
   const API_BASE_URL = "http://localhost:8000";
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Preview the production build locally before deploying.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## Project Structure

```
PingMe_Frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API service functions
│   │   ├── auth.jsx       # Authentication API calls
│   │   ├── axiosInstance.js  # Axios configuration
│   │   ├── dashboardApi.jsx  # Dashboard API calls
│   │   └── roomsApi.jsx   # Room management API calls
│   ├── auth/              # Authentication context and utilities
│   │   ├── AuthContext.jsx    # Auth context provider
│   │   ├── PrivateRoute.jsx   # Protected route component
│   │   └── useAuth.js     # Auth hook
│   ├── components/        # Reusable UI components
│   │   ├── Dashboard/     # Dashboard-specific components
│   │   │   ├── CreateRoomForm.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── RoomList.jsx
│   │   │   └── WelcomeSection.jsx
│   │   ├── Chatbot.jsx
│   │   ├── CreateRoomModal.jsx
│   │   ├── FeedbackForm.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── PublicRoute.jsx
│   │   └── Toast.jsx
│   ├── pages/             # Page components
│   │   ├── ChatRoom.jsx   # Main chat room interface
│   │   ├── Dashboard.jsx  # Dashboard/home page
│   │   └── Login.jsx      # Login/registration page
│   ├── routes/            # Routing configuration
│   │   └── AppRouter.jsx  # Main router setup
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Root component
│   ├── App.css            # Global styles
│   ├── index.css          # Base styles and Tailwind imports
│   └── main.jsx           # Application entry point
├── eslint.config.js       # ESLint configuration
├── vite.config.js         # Vite configuration
└── package.json           # Project dependencies
```

## Key Features

### Authentication

- User registration with email and username validation
- JWT token-based authentication
- Automatic token storage in localStorage
- Protected routes that redirect unauthenticated users

### Chat Room

- Real-time messaging via WebSocket
- Message history loading on room join
- Typing indicators showing who's typing
- Emoji picker for message enhancement
- Message grouping for consecutive messages from same user
- Join/leave notifications
- Auto-scroll to latest message
- Responsive full-screen chat interface

### Dashboard

- View all available chat rooms
- View rooms created by you
- Create new chat rooms
- Navigate to chat rooms
- User profile information

## API Integration

The frontend communicates with the backend API at `http://localhost:8000`:

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Room Endpoints
- `GET /rooms/` - Get all rooms
- `GET /rooms/my-rooms` - Get user's rooms
- `POST /rooms/` - Create new room
- `DELETE /rooms/{room_id}` - Delete room

### WebSocket
- `WS /ws/{room_id}` - Connect to chat room

## Environment Configuration

Update the API base URL in `src/api/axiosInstance.js`:

```javascript
const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:8000";
```

Or create a `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

## WebSocket Connection

The chat room uses WebSocket for real-time communication:

- **Connection**: Automatically connects when entering a room
- **Reconnection**: Handles disconnections and reconnects automatically
- **Message Types**:
  - `message` - Regular chat messages
  - `join` - User joined notification
  - `leave` - User left notification
  - `typing_start` - User started typing
  - `typing_stop` - User stopped typing
  - `history` - Message history on connect

## Styling

The project uses Tailwind CSS for styling:

- Utility-first CSS framework
- Responsive design with mobile-first approach
- Custom animations and transitions
- Dark mode ready (can be extended)

## Development

### Adding New Features

1. Create components in `src/components/`
2. Add pages in `src/pages/`
3. Add API calls in `src/api/`
4. Update routes in `src/routes/AppRouter.jsx`
5. Use Tailwind classes for styling

### Code Style

- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### WebSocket Connection Issues

- Ensure backend is running on `http://localhost:8000`
- Check browser console for WebSocket errors
- Verify JWT token is valid in localStorage

### API Request Failures

- Check API base URL configuration
- Verify backend server is running
- Check network tab in browser DevTools

### Build Issues

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## License

This project is part of the PingMe application.
