import { apiRequest } from "@/lib/queryClient";
import type { 
  Program, 
  Mentor, 
  Startup, 
  Event, 
  BlogPost, 
  TeamMember,
  InsertProgram,
  InsertMentor,
  InsertStartup,
  InsertEvent,
  InsertBlogPost,
  InsertTeamMember
} from "@shared/schema";

// Programs
export const programsApi = {
  getAll: () => "/api/programs",
  getPublished: () => "/api/programs/published",
  getById: (id: number) => `/api/programs/${id}`,
  create: async (program: InsertProgram) => 
    apiRequest("POST", "/api/programs", program),
};

// Mentors
export const mentorsApi = {
  getAll: () => "/api/mentors",
  getById: (id: number) => `/api/mentors/${id}`,
  create: async (mentor: InsertMentor) => 
    apiRequest("POST", "/api/mentors", mentor),
};

// Startups
export const startupsApi = {
  getAll: () => "/api/startups",
  getById: (id: number) => `/api/startups/${id}`,
  create: async (startup: InsertStartup) => 
    apiRequest("POST", "/api/startups", startup),
};

// Events
export const eventsApi = {
  getAll: () => "/api/events",
  getUpcoming: () => "/api/events/upcoming",
  getById: (id: number) => `/api/events/${id}`,
  create: async (event: InsertEvent) => 
    apiRequest("POST", "/api/events", event),
};

// Blog
export const blogApi = {
  getAll: () => "/api/blog",
  getById: (id: number) => `/api/blog/${id}`,
  create: async (post: InsertBlogPost) => 
    apiRequest("POST", "/api/blog", post),
};

// Team
export const teamApi = {
  getTeam: () => "/api/team",
  getBoard: () => "/api/team/board",
  getById: (id: number) => `/api/team/${id}`,
  create: async (member: InsertTeamMember) => 
    apiRequest("POST", "/api/team", member),
};
