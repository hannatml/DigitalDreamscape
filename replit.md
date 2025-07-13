# Digital Beings World

## Overview

This is a real-time interactive digital world application where users can create and observe digital characters (beings) that inhabit different zones. The application features a React frontend with a Node.js/Express backend, real-time WebSocket communication, and a PostgreSQL database managed through Drizzle ORM. Characters autonomously migrate between zones and users can interact with them through a visual canvas interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack TypeScript architecture with clear separation between client and server code:

- **Frontend**: React 18 with Vite build system
- **Backend**: Express.js server with WebSocket support
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Real-time Communication**: WebSockets for live updates
- **State Management**: TanStack Query for server state, React state for UI

## Key Components

### Frontend Architecture
- **React SPA**: Single-page application with wouter for routing
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Canvas Rendering**: HTML5 Canvas for visualizing the digital world
- **Real-time Updates**: WebSocket client for live character updates
- **Form Management**: React Hook Form with Zod validation

### Backend Architecture
- **Express Server**: RESTful API with WebSocket support
- **Storage Layer**: Abstracted storage interface with memory-based implementation
- **Character Migration**: Automated system for character movement between zones
- **WebSocket Broadcasting**: Real-time updates to all connected clients

### Database Schema
- **Characters Table**: Stores digital beings with properties (name, creator, shape, color, size, position, zone)
- **Zones Table**: Defines world areas with coordinates and dimensions
- **Timestamps**: Creation tracking for character age calculation

## Data Flow

1. **Character Creation**: User submits form → API validation → Database storage → WebSocket broadcast → UI update
2. **Real-time Updates**: Server migration system → Database updates → WebSocket broadcast → All clients update
3. **World Visualization**: Canvas component renders characters and zones based on live data
4. **User Interaction**: Click events on canvas → Character selection → Modal display with details

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Router (wouter)
- **Backend Framework**: Express.js with HTTP server
- **Database**: Drizzle ORM with PostgreSQL (Neon serverless)
- **WebSockets**: ws library for real-time communication

### UI and Styling
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for consistent iconography

### Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **TypeScript**: Full type safety across frontend and backend
- **Validation**: Zod for runtime type checking and form validation

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite development server with HMR
- **Concurrent Development**: Single command runs both client and server
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Database Migration**: Drizzle Kit handles schema changes

### Deployment Considerations
- **Database**: Requires PostgreSQL database (configured for Neon serverless)
- **WebSocket Support**: Server must support WebSocket connections
- **Environment Setup**: Proper DATABASE_URL configuration required
- **Asset Serving**: Express configured to serve static files from build directory

The application is designed for easy deployment on platforms like Replit, with automatic database provisioning and WebSocket support built-in.