import { 
  users,
  programs, 
  mentors, 
  startups, 
  events, 
  blogPosts, 
  teamMembers,
  mentorAvailability,
  mentorBookings,
  type User,
  type UpsertUser,
  type Program,
  type InsertProgram,
  type Mentor,
  type InsertMentor,
  type Startup,
  type InsertStartup,
  type Event,
  type InsertEvent,
  type BlogPost,
  type InsertBlogPost,
  type TeamMember,
  type InsertTeamMember,
  type MentorAvailability,
  type InsertMentorAvailability,
  type MentorBooking,
  type InsertMentorBooking,
  applications,
  type Application,
  type InsertApplication,
  eventApplications,
  type EventApplication,
  type InsertEventApplication,
  projects,
  type Project,
  type InsertProject,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations for CMS authentication
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(id: string, role: string, updatedBy: string): Promise<User | undefined>;
  deactivateUser(id: string, updatedBy: string): Promise<boolean>;
  deleteUser(id: string): Promise<boolean>;
  createUser(userData: Omit<UpsertUser, 'id'> & { id: string }): Promise<User>;
  reactivateUser(id: string, updatedBy: string): Promise<boolean>;
  updateLastLogin(id: string): Promise<void>;
  savePasswordResetToken(userId: string, token: string, expiryDate: Date): Promise<void>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  resetPassword(userId: string, newPassword: string): Promise<void>;
  clearPasswordResetToken(userId: string): Promise<void>;
  
  // Programs
  getPrograms(): Promise<Program[]>;
  getPublishedPrograms(): Promise<Program[]>;
  getProgram(id: number): Promise<Program | undefined>;
  getProgramBySlug(slug: string): Promise<Program | undefined>;
  createProgram(program: InsertProgram, userId?: string): Promise<Program>;
  updateProgram(id: number, program: Partial<InsertProgram>, userId?: string): Promise<Program | undefined>;
  deleteProgram(id: number): Promise<boolean>;

  // Mentors
  getMentors(): Promise<Mentor[]>;
  getMentor(id: number): Promise<Mentor | undefined>;
  createMentor(mentor: InsertMentor, userId?: string): Promise<Mentor>;
  updateMentor(id: number, mentor: Partial<InsertMentor>, userId?: string): Promise<Mentor | undefined>;
  deleteMentor(id: number): Promise<boolean>;
  
  // Mentor Availability
  getMentorAvailability(mentorId: number): Promise<MentorAvailability[]>;
  createMentorAvailability(availability: InsertMentorAvailability): Promise<MentorAvailability>;
  updateMentorAvailability(id: number, availability: Partial<InsertMentorAvailability>): Promise<MentorAvailability | undefined>;
  deleteMentorAvailability(id: number): Promise<boolean>;
  
  // Mentor Bookings
  getMentorBookings(mentorId?: number): Promise<MentorBooking[]>;
  getMentorBooking(id: number): Promise<MentorBooking | undefined>;
  createMentorBooking(booking: InsertMentorBooking): Promise<MentorBooking>;
  updateMentorBooking(id: number, booking: Partial<MentorBooking>): Promise<MentorBooking | undefined>;
  updateMentorBookingStatus(id: number, status: string, reviewNotes?: string, reviewedBy?: string): Promise<MentorBooking | undefined>;
  deleteMentorBooking(id: number): Promise<boolean>;

  // Startups
  getStartups(): Promise<Startup[]>;
  getStartup(id: number): Promise<Startup | undefined>;
  createStartup(startup: InsertStartup, userId?: string): Promise<Startup>;
  updateStartup(id: number, startup: Partial<InsertStartup>, userId?: string): Promise<Startup | undefined>;
  deleteStartup(id: number): Promise<boolean>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  getEventBySlug(slug: string): Promise<Event | undefined>;
  getUpcomingEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent, userId?: string): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>, userId?: string): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;

  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost, userId?: string): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>, userId?: string): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Team Members
  getTeamMembers(): Promise<TeamMember[]>;
  getBoardMembers(): Promise<TeamMember[]>;
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember, userId?: string): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<InsertTeamMember>, userId?: string): Promise<TeamMember | undefined>;
  deleteTeamMember(id: number): Promise<boolean>;

  // Applications
  getApplications(): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByProgram(programId: number): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string, reviewNotes?: string, reviewedBy?: string): Promise<Application | undefined>;
  deleteApplication(id: number): Promise<boolean>;

  // Event Applications
  getEventApplications(): Promise<EventApplication[]>;
  getEventApplication(id: number): Promise<EventApplication | undefined>;
  getEventApplicationsByEvent(eventId: number): Promise<EventApplication[]>;
  createEventApplication(application: InsertEventApplication): Promise<EventApplication>;
  updateEventApplicationStatus(id: number, status: string, reviewNotes?: string, reviewedBy?: string): Promise<EventApplication | undefined>;
  deleteEventApplication(id: number): Promise<boolean>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
  getProjectsByStatus(status: string): Promise<Project[]>;
  createProject(project: InsertProject, userId?: string): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>, userId?: string): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations for CMS authentication
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: Omit<UpsertUser, 'id'> & { id: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.createdAt);
  }

  async updateUserRole(id: string, role: string, updatedBy: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        role, 
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deactivateUser(id: string, updatedBy: string): Promise<boolean> {
    const result = await db
      .update(users)
      .set({ 
        isActive: false, 
        updatedAt: new Date()
      })
      .where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }

  async updateLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id));
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }

  async reactivateUser(id: string, updatedBy: string): Promise<boolean> {
    const result = await db
      .update(users)
      .set({ 
        isActive: true, 
        updatedAt: new Date()
      })
      .where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }

  async savePasswordResetToken(userId: string, token: string, expiryDate: Date): Promise<void> {
    await db
      .update(users)
      .set({
        passwordResetToken: token,
        passwordResetExpiry: expiryDate,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.passwordResetToken, token),
          gte(users.passwordResetExpiry, new Date())
        )
      );
    return user;
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    await db
      .update(users)
      .set({
        password: newPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async clearPasswordResetToken(userId: string): Promise<void> {
    await db
      .update(users)
      .set({
        passwordResetToken: null,
        passwordResetExpiry: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  // Programs
  async getPrograms(): Promise<Program[]> {
    return await db.select().from(programs).where(eq(programs.isActive, true));
  }

  async getPublishedPrograms(): Promise<Program[]> {
    return await db.select().from(programs)
      .where(eq(programs.isPublished, true));
  }

  async getProgram(id: number): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program;
  }

  async getProgramBySlug(slug: string): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.name, slug));
    return program;
  }

  async createProgram(program: InsertProgram, userId?: string): Promise<Program> {
    const [newProgram] = await db
      .insert(programs)
      .values({
        ...program,
        createdBy: userId || null,
        updatedBy: userId || null,
      })
      .returning();
    return newProgram;
  }

  async updateProgram(id: number, program: Partial<InsertProgram>, userId?: string): Promise<Program | undefined> {
    const [updated] = await db
      .update(programs)
      .set({
        ...program,
        updatedBy: userId || null,
        updatedAt: new Date(),
      })
      .where(eq(programs.id, id))
      .returning();
    return updated;
  }

  async deleteProgram(id: number): Promise<boolean> {
    const result = await db.update(programs).set({ isActive: false }).where(eq(programs.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Mentors
  async getMentors(): Promise<Mentor[]> {
    return await db.select().from(mentors).where(eq(mentors.isActive, true));
  }

  async getMentor(id: number): Promise<Mentor | undefined> {
    const [mentor] = await db.select().from(mentors).where(eq(mentors.id, id));
    return mentor;
  }

  async createMentor(mentor: InsertMentor, userId?: string): Promise<Mentor> {
    const [newMentor] = await db
      .insert(mentors)
      .values({
        ...mentor,
        createdBy: userId || null,
        updatedBy: userId || null,
      })
      .returning();
    return newMentor;
  }

  async updateMentor(id: number, mentor: Partial<InsertMentor>, userId?: string): Promise<Mentor | undefined> {
    const [updated] = await db
      .update(mentors)
      .set({
        ...mentor,
        updatedBy: userId || null,
        updatedAt: new Date(),
      })
      .where(eq(mentors.id, id))
      .returning();
    return updated;
  }

  async deleteMentor(id: number): Promise<boolean> {
    const result = await db.update(mentors).set({ isActive: false }).where(eq(mentors.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Mentor Availability
  async getMentorAvailability(mentorId: number): Promise<MentorAvailability[]> {
    return await db.select().from(mentorAvailability)
      .where(and(eq(mentorAvailability.mentorId, mentorId), eq(mentorAvailability.isActive, true)))
      .orderBy(mentorAvailability.dayOfWeek, mentorAvailability.startTime);
  }

  async createMentorAvailability(availability: InsertMentorAvailability): Promise<MentorAvailability> {
    const [newAvailability] = await db
      .insert(mentorAvailability)
      .values(availability)
      .returning();
    return newAvailability;
  }

  async updateMentorAvailability(id: number, availability: Partial<InsertMentorAvailability>): Promise<MentorAvailability | undefined> {
    const [updated] = await db
      .update(mentorAvailability)
      .set({
        ...availability,
        updatedAt: new Date(),
      })
      .where(eq(mentorAvailability.id, id))
      .returning();
    return updated;
  }

  async deleteMentorAvailability(id: number): Promise<boolean> {
    const result = await db.update(mentorAvailability).set({ isActive: false }).where(eq(mentorAvailability.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Mentor Bookings
  async getMentorBookings(mentorId?: number): Promise<MentorBooking[]> {
    if (mentorId) {
      return await db.select().from(mentorBookings)
        .where(eq(mentorBookings.mentorId, mentorId))
        .orderBy(desc(mentorBookings.meetingDate), desc(mentorBookings.meetingTime));
    }
    return await db.select().from(mentorBookings)
      .orderBy(desc(mentorBookings.meetingDate), desc(mentorBookings.meetingTime));
  }

  async getMentorBooking(id: number): Promise<MentorBooking | undefined> {
    const [booking] = await db.select().from(mentorBookings).where(eq(mentorBookings.id, id));
    return booking;
  }

  async createMentorBooking(booking: InsertMentorBooking): Promise<MentorBooking> {
    const [newBooking] = await db
      .insert(mentorBookings)
      .values(booking)
      .returning();
    return newBooking;
  }

  async updateMentorBooking(id: number, booking: Partial<MentorBooking>): Promise<MentorBooking | undefined> {
    const [updated] = await db
      .update(mentorBookings)
      .set({
        ...booking,
        updatedAt: new Date(),
      })
      .where(eq(mentorBookings.id, id))
      .returning();
    return updated;
  }

  async updateMentorBookingStatus(id: number, status: string, reviewNotes?: string, reviewedBy?: string): Promise<MentorBooking | undefined> {
    const [updated] = await db
      .update(mentorBookings)
      .set({
        status,
        reviewNotes,
        reviewedBy,
        updatedAt: new Date(),
      })
      .where(eq(mentorBookings.id, id))
      .returning();
    return updated;
  }

  async deleteMentorBooking(id: number): Promise<boolean> {
    const result = await db.delete(mentorBookings).where(eq(mentorBookings.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Startups
  async getStartups(): Promise<Startup[]> {
    return await db.select().from(startups).where(eq(startups.isActive, true));
  }

  async getStartup(id: number): Promise<Startup | undefined> {
    const [startup] = await db.select().from(startups).where(eq(startups.id, id));
    return startup;
  }

  async createStartup(startup: InsertStartup, userId?: string): Promise<Startup> {
    const [newStartup] = await db
      .insert(startups)
      .values({
        ...startup,
        createdBy: userId || null,
        updatedBy: userId || null,
      })
      .returning();
    return newStartup;
  }

  async updateStartup(id: number, startup: Partial<InsertStartup>, userId?: string): Promise<Startup | undefined> {
    const [updated] = await db
      .update(startups)
      .set({
        ...startup,
        updatedBy: userId || null,
        updatedAt: new Date(),
      })
      .where(eq(startups.id, id))
      .returning();
    return updated;
  }

  async deleteStartup(id: number): Promise<boolean> {
    const result = await db.update(startups).set({ isActive: false }).where(eq(startups.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Events  
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events)
      .where(eq(events.isActive, true))
      .orderBy(desc(events.date));
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    return await db.select().from(events)
      .where(and(eq(events.isActive, true), gte(events.date, now)))
      .orderBy(events.date);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async getEventBySlug(slug: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    return event;
  }

  async createEvent(event: InsertEvent, userId?: string): Promise<Event> {
    const [newEvent] = await db
      .insert(events)
      .values({
        ...event,
        createdBy: userId || null,
        updatedBy: userId || null,
      })
      .returning();
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>, userId?: string): Promise<Event | undefined> {
    const [updated] = await db
      .update(events)
      .set({
        ...event,
        updatedBy: userId || null,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();
    return updated;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.update(events).set({ isActive: false }).where(eq(events.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Blog Posts
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    const posts = await db.select().from(blogPosts)
      .where(eq(blogPosts.isPublished, true));
    
    // Sort in JavaScript to handle null dates properly
    return posts.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt || new Date());
      const dateB = new Date(b.publishedAt || b.createdAt || new Date());
      return dateB.getTime() - dateA.getTime();
    });
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost, userId?: string): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values({
        ...post,
        createdBy: userId || null,
        updatedBy: userId || null,
      })
      .returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>, userId?: string): Promise<BlogPost | undefined> {
    const [updated] = await db
      .update(blogPosts)
      .set({
        ...post,
        updatedBy: userId || null,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).where(eq(teamMembers.isActive, true));
  }

  async getBoardMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).where(
      and(eq(teamMembers.isBoard, true), eq(teamMembers.isActive, true))
    );
  }

  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member;
  }

  async createTeamMember(member: InsertTeamMember, userId?: string): Promise<TeamMember> {
    const [newMember] = await db
      .insert(teamMembers)
      .values({
        ...member,
        createdBy: userId || null,
        updatedBy: userId || null,
      })
      .returning();
    return newMember;
  }

  async updateTeamMember(id: number, member: Partial<InsertTeamMember>, userId?: string): Promise<TeamMember | undefined> {
    const [updated] = await db
      .update(teamMembers)
      .set({
        ...member,
        updatedBy: userId || null,
        updatedAt: new Date(),
      })
      .where(eq(teamMembers.id, id))
      .returning();
    return updated;
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    const result = await db.update(teamMembers).set({ isActive: false }).where(eq(teamMembers.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Applications
  async getApplications(): Promise<Application[]> {
    return await db.select().from(applications);
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async getApplicationsByProgram(programId: number): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.programId, programId));
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db
      .insert(applications)
      .values(application)
      .returning();
    return newApplication;
  }

  async updateApplicationStatus(id: number, status: string, reviewNotes?: string, reviewedBy?: string): Promise<Application | undefined> {
    const updateData: any = {
      status,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    };
    
    if (reviewNotes) updateData.reviewNotes = reviewNotes;
    if (reviewedBy) updateData.reviewedBy = reviewedBy;

    const [updatedApplication] = await db
      .update(applications)
      .set(updateData)
      .where(eq(applications.id, id))
      .returning();
    return updatedApplication;
  }

  async deleteApplication(id: number): Promise<boolean> {
    try {
      await db.delete(applications).where(eq(applications.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting application:", error);
      return false;
    }
  }

  // Event Applications
  async getEventApplications(): Promise<EventApplication[]> {
    return await db.select().from(eventApplications).orderBy(eventApplications.createdAt);
  }

  async getEventApplication(id: number): Promise<EventApplication | undefined> {
    const [application] = await db.select().from(eventApplications).where(eq(eventApplications.id, id));
    return application;
  }

  async getEventApplicationsByEvent(eventId: number): Promise<EventApplication[]> {
    return await db.select().from(eventApplications).where(eq(eventApplications.eventId, eventId));
  }

  async createEventApplication(application: InsertEventApplication): Promise<EventApplication> {
    const [newApplication] = await db
      .insert(eventApplications)
      .values(application)
      .returning();
    return newApplication;
  }

  async updateEventApplicationStatus(id: number, status: string, reviewNotes?: string, reviewedBy?: string): Promise<EventApplication | undefined> {
    const [updated] = await db
      .update(eventApplications)
      .set({
        status,
        reviewNotes,
        reviewedBy,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(eventApplications.id, id))
      .returning();
    return updated;
  }

  async deleteEventApplication(id: number): Promise<boolean> {
    try {
      const [deleted] = await db.delete(eventApplications).where(eq(eventApplications.id, id)).returning();
      return !!deleted;
    } catch (error) {
      console.error("Error deleting event application:", error);
      return false;
    }
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.isActive, true)).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(and(eq(projects.id, id), eq(projects.isActive, true)));
    return project;
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(and(eq(projects.slug, slug), eq(projects.isActive, true)));
    return project;
  }

  async getProjectsByStatus(status: string): Promise<Project[]> {
    return await db.select().from(projects).where(and(eq(projects.status, status), eq(projects.isActive, true))).orderBy(desc(projects.createdAt));
  }

  async createProject(project: InsertProject, userId?: string): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values({
        ...project,
        createdBy: userId,
        updatedBy: userId,
      })
      .returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>, userId?: string): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set({
        ...project,
        updatedBy: userId,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    try {
      const [updated] = await db
        .update(projects)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();
      return !!updated;
    } catch (error) {
      console.error("Error deleting project:", error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();