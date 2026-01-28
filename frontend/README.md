# SKiss Frontend

Modern React + TypeScript + Vite frontend for the SKiss earning platform.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Redux Toolkit** - State management
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Toastify** - Notifications
- **Recharts** - Charts and analytics

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API layer (axios, auth API)
│   ├── components/       # React components
│   │   └── shared/       # Shared/reusable components
│   │       ├── Layout/   # Layout components (Header, Sidebar, Footer)
│   │       └── UI/       # UI components (Button, Input, Modal, etc.)
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   └── dashboard/    # Dashboard pages
│   ├── routes/           # Route configuration
│   ├── store/            # Redux store and slices
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your backend API URL
VITE_API_URL=http://localhost:3000/api
```

### Development

```bash
# Start development server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Features

### Authentication
- ✅ Login with email/username
- ✅ Registration with validation
- ✅ Two-factor authentication (2FA)
- ✅ Token refresh mechanism
- ✅ Protected routes

### UI Components
- Button (variants: primary, secondary, danger, ghost)
- Input (with icons, error states, validation)
- Modal (overlay, backdrop, keyboard support)
- Card (hover effects, click handlers)
- Alert (success, error, warning, info)
- Spinner (loading indicators)
- Toast (notifications)

### Layout
- Responsive header with user menu
- Sidebar navigation
- Footer with links
- Dark theme design

### State Management
- Redux Toolkit for global state
- Auth slice with login/register/logout
- Type-safe hooks (useAppDispatch, useAppSelector)
- LocalStorage persistence

### Routing
- React Router v6
- Private routes (requires authentication)
- Admin routes (requires admin role)
- Automatic redirects

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:3000/api |

## Design System

### Colors
- **Primary**: Blue (#0ea5e9)
- **Secondary**: Purple (#a855f7)
- **Dark**: Slate tones (#0f172a - #f8fafc)

### Typography
- **Font Family**: Inter (sans-serif)
- **Font Weights**: 300-800

### Spacing
- Following Tailwind's default spacing scale

## API Integration

The frontend communicates with the backend via Axios with:
- Request/response interceptors
- Automatic token injection
- Token refresh on 401
- Error handling and toast notifications

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow the component naming conventions
4. Keep components small and focused
5. Use Tailwind utility classes for styling
6. Add proper error handling

## License

MIT
