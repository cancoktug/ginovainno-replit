# ITU Ginova - Girişimcilik ve İnovasyon Merkezi

## Overview

This is a full-stack web application for ITU Ginova (Girişimcilik ve İnovasyon Merkezi - Entrepreneurship and Innovation Center). The platform aims to be a comprehensive portal showcasing entrepreneurship programs, mentors, startups, events, and blog content, facilitating interaction and information dissemination within the entrepreneurship ecosystem.

## User Preferences

Preferred communication style: Simple, everyday language in Turkish.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn/ui built on Radix UI
- **Styling**: Tailwind CSS with custom ITU/Ginova color scheme (ITU Blue: #3B82F6, Ginova Orange: #FF5722)
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **UI/UX Decisions**: Responsive design, mobile-first approach, consistent styling with brand colors, dark mode support. Specific components like ProgramCard and MentorCard are used.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: REST API with JSON responses
- **Error Handling**: Centralized middleware
- **Logging**: Custom request/response logging
- **Core Entities**: Programs, Mentors, Startups, Events, Blog Posts, Team Members. CRUD operations are supported for these entities.

### Database & ORM
- **Database**: PostgreSQL (configured for use with Neon Database)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Validation**: Drizzle-Zod for runtime schema validation

### System Design Choices
- **Data Flow**: Client (React with TanStack Query) requests data from Express API, which uses Drizzle ORM for PostgreSQL operations. Responses are handled with error management and UI updates.
- **Content Management System (CMS)**: Integrated admin panel for managing all content types, including user management with role-based access (admin, editor).
- **Authentication**: Traditional username/password authentication using Passport.js for secure access.
- **URL Slugs**: Turkish URL slugs implemented for better SEO and user experience, with backward compatibility for English URLs.
- **Admin Dashboard**: Real-time statistics display for core entities with auto-refresh.
- **Footer CMS Access**: Direct link to admin login from the footer.
- **About Page**: Comprehensive "Hakkımızda" (About Us) page with mission statement, services overview, and management board display.
- **CTA Section**: Redesigned call-to-action section with animated gradient background and simplified contact button.
- **Mentor Booking System**: Complete 2-step booking flow with calendar view, 30-minute time slot selection, form submission, and automated email notifications via SendGrid to applicant, mentor, and admin.
- **Blog Author Assignment**: Automatic author assignment based on logged-in user (firstName + lastName). Admin users can manually edit the author field for any blog post.

## External Dependencies

### Core
- **@neondatabase/serverless**: PostgreSQL driver for Neon Database
- **drizzle-orm**: Type-safe ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing library
- **date-fns**: Date manipulation with Turkish locale support

### UI
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Type-safe component variants

### Development Tools
- **Vite**: Fast build tool
- **TypeScript**: Static typing
- **tsx**: TypeScript execution for Node.js