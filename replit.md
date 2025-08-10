# Overview

This is a complete Arabic inventory management web application called "Laroza" (لاروزا) designed specifically for fashion stores to manage dress information and stock. The application provides a comprehensive dress management system with support for colors, sizes, and detailed product specifications. It features a modern, responsive design with Right-to-Left (RTL) layout support for proper Arabic text display, using a color scheme of white, gold, and light pink that creates an elegant aesthetic suitable for a fashion business.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui component system
- **Styling**: Tailwind CSS with custom Arabic font (Cairo) and RTL layout support
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Routing**: Wouter for lightweight client-side routing
- **Component Structure**: Modular component architecture with shared UI components

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **Schema Validation**: Zod schemas for runtime type validation
- **Error Handling**: Centralized error handling middleware with Arabic error messages

## Data Storage Solutions
- **Current Implementation**: In-memory storage using Map data structures for development
- **Database Ready**: Drizzle ORM configured for PostgreSQL with Neon Database
- **Schema Design**: Structured data models for users, dresses, colors, and sizes with JSONB storage for flexible color/size combinations

## Authentication and Authorization
- **Architecture**: Basic user management system prepared but not actively implemented in current flow
- **Session Management**: Cookie-based session storage configured with connect-pg-simple
- **User Model**: Prepared user schema with username/password authentication

## Key Features Architecture
- **Dress Management**: Complete CRUD operations for dress inventory
- **Color and Size System**: Dynamic color and size management with nested data structures
- **Search and Filter**: Text-based search across model numbers and company names
- **Form Validation**: Multi-layer validation using Zod schemas on both client and server
- **Responsive Design**: Mobile-first approach with collapsible sections and touch-friendly interfaces
- **RTL Support**: Full right-to-left layout with Arabic typography and proper text direction