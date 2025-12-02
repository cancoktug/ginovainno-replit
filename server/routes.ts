import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin, isEditor } from "./auth";
import { emailService } from "./emailService";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  insertProgramSchema,
  insertMentorSchema,
  insertStartupSchema,
  insertEventSchema,
  insertBlogPostSchema,
  insertTeamMemberSchema,
  insertProjectSchema,
  insertMentorAvailabilitySchema,
  insertMentorBookingSchema,
  programs,
  mentors,
  startups,
  events,
  blogPosts,
  teamMembers,
  projects,
  mentorAvailability,
  mentorBookings,
} from "@shared/schema";
import { db, checkDatabaseConnection } from "./db";
import { sql, eq } from "drizzle-orm";
import { config } from "./config";
import { objectStorageService } from "./objectStorage";

// Multer configuration for file uploads
const storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = `public/media/${req.body.type || 'general'}`;
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage_config,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Health check endpoint - used by monitoring and deployment scripts
  app.get('/api/health', async (req, res) => {
    try {
      const dbStatus = await checkDatabaseConnection();
      
      // Check storage availability - different logic for Replit vs production
      let storageAvailable = false;
      let storageMode = 'unknown';
      
      if (config.isReplit) {
        // On Replit, Object Storage is always available if bucket ID exists
        storageMode = 'replit-object-storage';
        storageAvailable = !!process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID || !!process.env.REPLIT_DEFAULT_BUCKET_ID;
      } else {
        // On production, check if upload directory exists
        const uploadDir = objectStorageService.getUploadDir();
        storageMode = 'local-filesystem';
        storageAvailable = fs.existsSync(uploadDir);
      }
      
      const health = {
        status: dbStatus.connected && storageAvailable ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: config.nodeEnv,
        checks: {
          database: {
            status: dbStatus.connected ? 'connected' : 'disconnected',
            error: dbStatus.error
          },
          storage: {
            status: storageAvailable ? 'available' : 'unavailable',
            mode: storageMode,
            isReplit: config.isReplit
          }
        }
      };
      
      const statusCode = health.status === 'healthy' ? 200 : 503;
      res.status(statusCode).json(health);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Serve static files from public/media with correct MIME types
  app.use('/media', express.static('public/media', {
    setHeaders: (res, path) => {
      if (path.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (path.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      }
    }
  }));
  
  app.use('/api/media', express.static('public/media', {
    setHeaders: (res, path) => {
      if (path.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (path.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      }
    }
  }));

  // Download deployment package chunks
  app.get('/ginova-part-:part', (req, res) => {
    const part = req.params.part;
    const filePath = path.resolve(`public/ginova-part-${part}`);
    if (fs.existsSync(filePath)) {
      res.download(filePath, `ginova-part-${part}`, (err) => {
        if (err) {
          console.error('Download error:', err);
          // Only send error if headers not already sent
          if (!res.headersSent) {
            res.status(500).send('Error downloading file');
          }
        }
      });
    } else {
      res.status(404).send('File not found');
    }
  });

  // Serve download instructions page
  app.get('/download-deployment', (req, res) => {
    res.sendFile(path.resolve('public/download-chunks.html'));
  });

  // File upload endpoint
  app.post('/api/upload', isEditor, upload.single('file'), (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const filePath = `/media/${req.body.type || 'general'}/${req.file.filename}`;
      res.json({ 
        url: filePath,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ message: 'File upload failed' });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      // Update last login
      await storage.updateLastLogin(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User Management Routes (Admin Only)
  app.get('/api/users', isAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.put('/api/users/:id/role', isAdmin, async (req: any, res) => {
    try {
      const userId = req.params.id;
      const { role } = req.body;
      const adminId = req.user.id;

      if (!['admin', 'editor'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await storage.updateUserRole(userId, role, adminId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  app.put('/api/users/:id/deactivate', isAdmin, async (req: any, res) => {
    try {
      const userId = req.params.id;
      const adminId = req.user.id;
      
      // Prevent self-deactivation
      if (userId === adminId) {
        return res.status(400).json({ message: "Cannot deactivate your own account" });
      }

      const success = await storage.deactivateUser(userId, adminId);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deactivated successfully" });
    } catch (error) {
      console.error("Error deactivating user:", error);
      res.status(500).json({ message: "Failed to deactivate user" });
    }
  });

  app.put('/api/users/:id/reactivate', isAdmin, async (req: any, res) => {
    try {
      const userId = req.params.id;
      const adminId = req.user.id;

      const success = await storage.reactivateUser(userId, adminId);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User reactivated successfully" });
    } catch (error) {
      console.error("Error reactivating user:", error);
      res.status(500).json({ message: "Failed to reactivate user" });
    }
  });

  app.delete('/api/users/:id', isAdmin, async (req: any, res) => {
    try {
      const userId = req.params.id;

      const success = await storage.deleteUser(userId);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Password reset endpoint - Admin initiates reset for any user
  app.post('/api/users/:id/reset-password', isAdmin, async (req: any, res) => {
    try {
      const userId = req.params.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate reset token
      const { nanoid } = await import('nanoid');
      const resetToken = nanoid(32);
      
      // Set token expiry to 24 hours from now
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24);
      
      // Save token to database
      await storage.savePasswordResetToken(userId, resetToken, expiryDate);
      
      const userName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.email;
      
      // Send password reset email (best-effort)
      try {
        const emailTemplate = emailService.generatePasswordResetEmail(
          user.email,
          userName,
          resetToken
        );
        await emailService.sendEmail(emailTemplate);
        
        res.json({ 
          message: "Password reset email sent successfully",
          email: user.email 
        });
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
        res.status(500).json({ 
          message: "Failed to send password reset email. Please check email configuration." 
        });
      }
    } catch (error) {
      console.error("Error processing password reset:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  // Verify reset token
  app.post('/api/auth/verify-reset-token', async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }

      const user = await storage.getUserByResetToken(token);
      
      if (!user) {
        return res.status(400).json({ 
          message: "Invalid or expired reset token" 
        });
      }

      res.json({ 
        valid: true,
        userId: user.id,
        email: user.email 
      });
    } catch (error) {
      console.error("Error verifying reset token:", error);
      res.status(500).json({ message: "Failed to verify reset token" });
    }
  });

  // Reset password with token
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ 
          message: "Token and new password are required" 
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ 
          message: "Password must be at least 6 characters long" 
        });
      }

      const user = await storage.getUserByResetToken(token);
      
      if (!user) {
        return res.status(400).json({ 
          message: "Invalid or expired reset token" 
        });
      }

      // Hash the new password using the same algorithm as auth
      const { hashPassword } = await import('./auth');
      const hashedPassword = await hashPassword(newPassword);
      
      // Update password and clear reset token
      await storage.resetPassword(user.id, hashedPassword);

      res.json({ 
        message: "Password reset successfully. You can now login with your new password." 
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  app.post('/api/users', isAdmin, async (req: any, res) => {
    try {
      const { id, email, firstName, lastName, role } = req.body;
      
      if (!id || !email || !role) {
        return res.status(400).json({ message: "User ID, email, and role are required" });
      }

      if (!['admin', 'editor'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const userData = {
        id,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        role,
        isActive: true,
        profileImageUrl: null
      };

      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof Error && error.message.includes('duplicate')) {
        res.status(400).json({ message: "User already exists" });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  // Admin panel statistics
  app.get("/api/admin/stats", isAuthenticated, async (req, res) => {
    try {
      const [programCount] = await db.select({ count: sql<number>`count(*)` }).from(programs).where(eq(programs.isPublished, true));
      const [mentorCount] = await db.select({ count: sql<number>`count(*)` }).from(mentors);
      const [startupCount] = await db.select({ count: sql<number>`count(*)` }).from(startups);
      const [projectCount] = await db.select({ count: sql<number>`count(*)` }).from(projects);
      const [eventCount] = await db.select({ count: sql<number>`count(*)` }).from(events);
      const [blogCount] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts).where(eq(blogPosts.isPublished, true));
      const [teamCount] = await db.select({ count: sql<number>`count(*)` }).from(teamMembers);

      res.json({
        programCount: programCount.count,
        mentorCount: mentorCount.count,
        startupCount: startupCount.count,
        projectCount: projectCount.count,
        eventCount: eventCount.count,
        blogCount: blogCount.count,
        teamCount: teamCount.count
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Programs routes
  app.get("/api/programs/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const program = await storage.getProgramBySlug(slug);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      console.error("Error fetching program by slug:", error);
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });

  app.get("/api/programs", async (req, res) => {
    try {
      const programs = await storage.getPrograms();
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.get("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const program = await storage.getProgram(id);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch published programs" });
    }
  });

  app.get("/api/programs/published", async (req, res) => {
    try {
      // Use the same method as /api/programs but filter for published
      const allPrograms = await storage.getPrograms();
      const publishedPrograms = allPrograms.filter(p => p.isPublished === true);
      res.json(publishedPrograms);
    } catch (error) {
      console.error("Error fetching published programs:", error);
      res.status(500).json({ message: "Failed to fetch published programs" });
    }
  });

  app.post("/api/programs", isEditor, async (req: any, res) => {
    try {
      // Convert string dates to Date objects before validation
      const bodyData = { ...req.body };
      if (bodyData.applicationDeadline) {
        bodyData.applicationDeadline = new Date(bodyData.applicationDeadline);
      }
      if (bodyData.startDate) {
        bodyData.startDate = new Date(bodyData.startDate);
      }
      if (bodyData.endDate) {
        bodyData.endDate = new Date(bodyData.endDate);
      }
      
      const validated = insertProgramSchema.parse(bodyData);
      const userId = req.user.id;
      const program = await storage.createProgram(validated, userId);
      res.status(201).json(program);
    } catch (error) {
      console.error("Error creating program:", error);
      res.status(400).json({ message: "Invalid program data" });
    }
  });

  app.put("/api/programs/:id", isEditor, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Convert string dates to Date objects before validation
      const bodyData = { ...req.body };
      if (bodyData.applicationDeadline) {
        bodyData.applicationDeadline = new Date(bodyData.applicationDeadline);
      }
      if (bodyData.startDate) {
        bodyData.startDate = new Date(bodyData.startDate);
      }
      if (bodyData.endDate) {
        bodyData.endDate = new Date(bodyData.endDate);
      }
      
      const validated = insertProgramSchema.partial().parse(bodyData);
      const userId = req.user.id;
      const program = await storage.updateProgram(id, validated, userId);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      console.error("Error updating program:", error);
      res.status(400).json({ message: "Invalid program data" });
    }
  });

  app.delete("/api/programs/:id", isAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProgram(id);
      if (!success) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json({ message: "Program deleted successfully" });
    } catch (error) {
      console.error("Error deleting program:", error);
      res.status(500).json({ message: "Failed to delete program" });
    }
  });

  // Mentors
  app.get("/api/mentors", async (req, res) => {
    try {
      const mentors = await storage.getMentors();
      res.json(mentors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentors" });
    }
  });

  app.get("/api/mentors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const mentor = await storage.getMentor(id);
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
      res.json(mentor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentor" });
    }
  });

  app.post("/api/mentors", isAuthenticated, async (req: any, res) => {
    try {
      const validated = insertMentorSchema.parse(req.body);
      const mentor = await storage.createMentor(validated, req.user?.id);
      res.status(201).json(mentor);
    } catch (error) {
      console.error("Error creating mentor:", error);
      res.status(400).json({ message: "Invalid mentor data" });
    }
  });

  app.put("/api/mentors/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid mentor ID" });
      }
      
      const validated = insertMentorSchema.partial().parse(req.body);
      const mentor = await storage.updateMentor(id, validated, req.user?.id);
      
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
      res.json(mentor);
    } catch (error) {
      console.error("Error updating mentor:", error);
      res.status(400).json({ message: "Invalid mentor data" });
    }
  });

  app.delete("/api/mentors/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid mentor ID" });
      }
      
      const success = await storage.deleteMentor(id);
      if (!success) {
        return res.status(404).json({ message: "Mentor not found" });
      }
      res.json({ message: "Mentor deleted successfully" });
    } catch (error) {
      console.error("Error deleting mentor:", error);
      res.status(500).json({ message: "Failed to delete mentor" });
    }
  });

  // Mentor Availability Routes
  app.get("/api/mentors/:id/availability", async (req, res) => {
    try {
      const mentorId = parseInt(req.params.id);
      if (isNaN(mentorId)) {
        return res.status(400).json({ message: "Invalid mentor ID" });
      }
      
      const availability = await storage.getMentorAvailability(mentorId);
      res.json(availability);
    } catch (error) {
      console.error("Error fetching mentor availability:", error);
      res.status(500).json({ message: "Failed to fetch mentor availability" });
    }
  });

  app.post("/api/mentors/:id/availability", isAuthenticated, async (req, res) => {
    try {
      const mentorId = parseInt(req.params.id);
      if (isNaN(mentorId)) {
        return res.status(400).json({ message: "Invalid mentor ID" });
      }

      const { dayOfWeek, startTime, endTime } = req.body;
      if (typeof dayOfWeek !== 'number' || !startTime || !endTime) {
        return res.status(400).json({ message: "Day of week, start time, and end time are required" });
      }

      const availability = await storage.createMentorAvailability({
        mentorId,
        dayOfWeek,
        startTime,
        endTime
      });
      
      res.status(201).json(availability);
    } catch (error) {
      console.error("Error creating mentor availability:", error);
      res.status(400).json({ message: "Invalid availability data" });
    }
  });

  app.delete("/api/mentor-availability/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid availability ID" });
      }
      
      const success = await storage.deleteMentorAvailability(id);
      if (!success) {
        return res.status(404).json({ message: "Availability slot not found" });
      }
      res.json({ message: "Availability slot deleted successfully" });
    } catch (error) {
      console.error("Error deleting mentor availability:", error);
      res.status(500).json({ message: "Failed to delete availability slot" });
    }
  });

  // Mentor Booking Routes
  app.get("/api/mentors/:id/bookings", isAuthenticated, async (req, res) => {
    try {
      const mentorId = parseInt(req.params.id);
      if (isNaN(mentorId)) {
        return res.status(400).json({ message: "Invalid mentor ID" });
      }
      
      const bookings = await storage.getMentorBookings(mentorId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching mentor bookings:", error);
      res.status(500).json({ message: "Failed to fetch mentor bookings" });
    }
  });

  app.get("/api/mentor-bookings", isAuthenticated, async (req, res) => {
    try {
      const bookings = await storage.getMentorBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching all mentor bookings:", error);
      res.status(500).json({ message: "Failed to fetch mentor bookings" });
    }
  });

  app.post("/api/mentors/:id/bookings", async (req, res) => {
    try {
      const mentorId = parseInt(req.params.id);
      if (isNaN(mentorId)) {
        return res.status(400).json({ message: "Invalid mentor ID" });
      }

      // Get mentor information for email
      const mentor = await storage.getMentor(mentorId);
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      const booking = await storage.createMentorBooking({
        ...req.body,
        mentorId
      });

      // Send email notifications (best-effort, don't fail the request if email fails)
      const { applicantName, applicantEmail, phone, company, topic, meetingDate, meetingTime, message } = req.body;

      try {
        // Send confirmation email to applicant
        if (applicantEmail) {
          const confirmationEmail = emailService.generateBookingConfirmationEmail(
            applicantName,
            mentor.name,
            meetingDate,
            meetingTime
          );
          confirmationEmail.to = applicantEmail;
          await emailService.sendEmail(confirmationEmail);
        }

        // Send notification to mentor (if mentor has email)
        if (mentor.email) {
          const mentorEmail = emailService.generateMentorNotificationEmail(
            mentor.name,
            applicantName,
            applicantEmail,
            company || '',
            topic,
            meetingDate,
            meetingTime,
            phone || '',
            message || ''
          );
          mentorEmail.to = mentor.email;
          await emailService.sendEmail(mentorEmail);
        }

        // Send notification to admin
        const adminEmail = emailService.generateAdminNotificationEmail(
          mentor.name,
          applicantName,
          applicantEmail,
          company || '',
          topic,
          meetingDate,
          meetingTime,
          phone || '',
          message || ''
        );
        await emailService.sendEmail(adminEmail);
      } catch (emailError) {
        console.error("Email notification failed (booking created successfully):", emailError);
      }
      
      res.status(201).json({
        ...booking,
        message: "Randevu talebiniz başarıyla gönderildi. E-posta bildirimleri gönderildi."
      });
    } catch (error) {
      console.error("Error creating mentor booking:", error);
      res.status(400).json({ message: "Invalid booking data" });
    }
  });

  app.put("/api/mentor-bookings/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const booking = await storage.updateMentorBooking(id, req.body);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error updating mentor booking:", error);
      res.status(400).json({ message: "Invalid booking data" });
    }
  });

  app.delete("/api/mentor-bookings/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const success = await storage.deleteMentorBooking(id);
      if (!success) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      console.error("Error deleting mentor booking:", error);
      res.status(500).json({ message: "Failed to delete booking" });
    }
  });

  // Startups
  app.get("/api/startups", async (req, res) => {
    try {
      const startups = await storage.getStartups();
      res.json(startups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch startups" });
    }
  });

  app.get("/api/startups/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const startup = await storage.getStartup(id);
      if (!startup) {
        return res.status(404).json({ message: "Startup not found" });
      }
      res.json(startup);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch startup" });
    }
  });

  app.post("/api/startups", async (req, res) => {
    try {
      const validated = insertStartupSchema.parse(req.body);
      const startup = await storage.createStartup(validated);
      res.status(201).json(startup);
    } catch (error) {
      res.status(400).json({ message: "Invalid startup data" });
    }
  });

  // Events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      // Disable cache to ensure fresh data
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/upcoming", async (req, res) => {
    try {
      const events = await storage.getUpcomingEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.get("/api/events/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const event = await storage.getEventBySlug(slug);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching event by slug:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post("/api/events", isAuthenticated, isEditor, async (req: any, res) => {
    try {
      // Convert date string to Date object if present
      if (req.body.date && typeof req.body.date === 'string') {
        req.body.date = new Date(req.body.date);
      }
      
      const validated = insertEventSchema.parse(req.body);
      const userId = req.user.id;
      const event = await storage.createEvent(validated, userId);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  app.patch("/api/events/:id", isAuthenticated, isEditor, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      // Convert date string to Date object if present
      if (req.body.date && typeof req.body.date === 'string') {
        req.body.date = new Date(req.body.date);
      }
      
      const validated = insertEventSchema.partial().parse(req.body);
      const userId = req.user.id;
      const event = await storage.updateEvent(id, validated, userId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Clear cache headers for immediate updates
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.json(event);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEvent(id);
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Blog Posts
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/all", isEditor, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPost(id);
      if (!post || !post.isPublished) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post || !post.isPublished) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", isEditor, async (req: any, res) => {
    try {
      console.log("Blog post request body:", req.body);
      
      // Handle publishedAt based on isPublished status
      const blogData = {
        ...req.body,
        publishedAt: req.body.isPublished ? new Date() : null
      };
      
      const validated = insertBlogPostSchema.parse(blogData);
      console.log("Validated blog post data:", validated);
      const userId = req.user.id;
      const post = await storage.createBlogPost(validated, userId);
      res.status(201).json(post);
    } catch (error) {
      console.error("Blog post creation error:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Invalid blog post data" });
      }
    }
  });

  app.put("/api/blog/:id", isEditor, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Handle publishedAt based on isPublished status
      const blogData = {
        ...req.body,
        // Set publishedAt only if transitioning from draft to published
        ...(req.body.isPublished && !req.body.publishedAt ? { publishedAt: new Date() } : {})
      };
      
      const validated = insertBlogPostSchema.partial().parse(blogData);
      const userId = req.user.id;
      const post = await storage.updateBlogPost(id, validated, userId);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Blog post update error:", error);
      res.status(400).json({ message: "Invalid blog post data" });
    }
  });

  app.delete("/api/blog/:id", isEditor, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Team Members
  app.get("/api/team", async (req, res) => {
    try {
      const team = await storage.getTeamMembers();
      
      // Normalize image URLs for all members
      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      
      const normalizedTeam = team.map(member => ({
        ...member,
        image: member.image && member.image.includes('storage.googleapis.com')
          ? objectStorageService.normalizeObjectEntityPath(member.image)
          : member.image
      }));
      
      res.json(normalizedTeam);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.get("/api/team/board", async (req, res) => {
    try {
      const board = await storage.getBoardMembers();
      
      // Normalize image URLs for board members
      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      
      const normalizedBoard = board.map(member => ({
        ...member,
        image: member.image && member.image.includes('storage.googleapis.com')
          ? objectStorageService.normalizeObjectEntityPath(member.image)
          : member.image
      }));
      
      res.json(normalizedBoard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch board members" });
    }
  });

  app.get("/api/team/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.getTeamMember(id);
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      // Normalize image URL if needed
      if (member.image && member.image.includes('storage.googleapis.com')) {
        const { ObjectStorageService } = await import("./objectStorage");
        const objectStorageService = new ObjectStorageService();
        member.image = objectStorageService.normalizeObjectEntityPath(member.image);
      }
      
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team member" });
    }
  });

  app.post("/api/team", isEditor, async (req: any, res) => {
    try {
      const validated = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(validated, req.user?.id);
      res.status(201).json(member);
    } catch (error) {
      console.error("Error creating team member:", error);
      res.status(400).json({ message: "Invalid team member data" });
    }
  });

  app.put("/api/team/:id", isEditor, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      // Normalize image URL if it's from Google Storage
      if (updateData.image && updateData.image.includes('storage.googleapis.com')) {
        const { ObjectStorageService } = await import("./objectStorage");
        const objectStorageService = new ObjectStorageService();
        updateData.image = objectStorageService.normalizeObjectEntityPath(updateData.image);
      }
      
      const member = await storage.updateTeamMember(id, updateData, req.user?.id);
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(500).json({ message: "Failed to update team member" });
    }
  });

  app.delete("/api/team/:id", isEditor, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTeamMember(id);
      if (!success) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.json({ message: "Team member deleted successfully" });
    } catch (error) {
      console.error("Error deleting team member:", error);
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });

  // Object storage endpoints for team photos
  app.post("/api/team/upload", isEditor, async (req, res) => {
    try {
      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting team photo upload URL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Optimized image upload endpoint for team photos
  app.post("/api/team/upload-optimized", isEditor, express.raw({ type: 'application/octet-stream', limit: '100mb' }), async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).json({ error: "Image data required" });
      }

      // Convert to Buffer if needed
      const imageBuffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body);
      
      if (imageBuffer.length === 0) {
        return res.status(400).json({ error: "Empty image data" });
      }

      console.log(`Received image buffer: ${imageBuffer.length} bytes`);

      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      
      const optimizedImageUrl = await objectStorageService.uploadOptimizedImage(
        imageBuffer,
        true // isProfilePhoto
      );
      
      console.log(`Optimized image uploaded: ${optimizedImageUrl}`);
      res.json({ imageUrl: optimizedImageUrl });
    } catch (error) {
      console.error("Error uploading optimized image:", error);
      res.status(500).json({ error: `Failed to upload optimized image: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const { ObjectStorageService, ObjectNotFoundError } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof Error && error.name === "ObjectNotFoundError") {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.get("/public-objects/:filePath(*)", async (req, res) => {
    try {
      const { ObjectStorageService } = await import("./objectStorage");
      const filePath = req.params.filePath;
      const objectStorageService = new ObjectStorageService();
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // LinkedIn profile photo extraction endpoint
  app.post("/api/team/extract-linkedin", isEditor, async (req, res) => {
    try {
      const { linkedinUrl } = req.body;
      
      if (!linkedinUrl || !linkedinUrl.includes('linkedin.com/in/')) {
        return res.status(400).json({ error: "Valid LinkedIn profile URL required" });
      }

      const { LinkedInService } = await import("./linkedinService");
      const profileInfo = await LinkedInService.extractProfileInfo(linkedinUrl);
      
      // Always return some data, even if it's just a generated avatar
      if (!profileInfo.profilePhoto && !profileInfo.name) {
        // Extract username from URL as fallback
        const match = linkedinUrl.match(/linkedin\.com\/in\/([^/?]+)/);
        if (match) {
          const username = match[1].replace(/[-_]/g, ' ');
          const name = username.split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          profileInfo.name = name;
          profileInfo.profilePhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.split(' ').map((n: string) => n[0]).join(''))}&size=200&background=0d6efd&color=fff&bold=true`;
        }
      }
      
      res.json(profileInfo);
    } catch (error) {
      console.error("Error extracting LinkedIn profile:", error);
      res.status(500).json({ error: "Failed to extract LinkedIn profile" });
    }
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/status/:status", async (req, res) => {
    try {
      const status = req.params.status;
      const projects = await storage.getProjectsByStatus(status);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects by status:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const project = await storage.getProjectBySlug(slug);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project by slug:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", isAuthenticated, isEditor, async (req: any, res) => {
    try {
      const validated = insertProjectSchema.parse(req.body);
      const userId = req.user.id;
      const project = await storage.createProject(validated, userId);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.patch("/api/projects/:id", isAuthenticated, isEditor, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const validated = insertProjectSchema.partial().parse(req.body);
      const userId = req.user.id;
      const project = await storage.updateProject(id, validated, userId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Application routes
  app.get("/api/applications", isAuthenticated, isEditor, async (req, res) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.get("/api/applications/:id", isAuthenticated, isEditor, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const application = await storage.getApplication(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });

  app.get("/api/programs/:id/applications", isAuthenticated, isEditor, async (req, res) => {
    try {
      const programId = parseInt(req.params.id);
      const applications = await storage.getApplicationsByProgram(programId);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching program applications:", error);
      res.status(500).json({ message: "Failed to fetch program applications" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const application = await storage.createApplication(req.body);
      
      // Get program title for email
      const program = await storage.getProgram(req.body.programId);
      const programTitle = program ? program.title : 'Program';
      
      // Send emails (best-effort, don't fail the request if email fails)
      try {
        const adminEmailTemplate = emailService.generateProgramApplicationEmail(programTitle, req.body);
        await emailService.sendEmail(adminEmailTemplate);
        
        const applicantEmailTemplate = emailService.generateProgramApplicationConfirmation(
          req.body.email,
          `${req.body.firstName} ${req.body.lastName}`,
          programTitle
        );
        await emailService.sendEmail(applicantEmailTemplate);
      } catch (emailError) {
        console.error("Email notification failed (application created successfully):", emailError);
      }
      
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  app.patch("/api/applications/:id/status", isAuthenticated, isEditor, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, reviewNotes } = req.body;
      const userId = (req.user as any)?.claims?.sub;
      
      const application = await storage.updateApplicationStatus(id, status, reviewNotes, userId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Send status update notification to applicant (best-effort)
      try {
        const program = await storage.getProgram(application.programId);
        const programTitle = program ? program.title : 'Program';
        
        const statusEmailTemplate = emailService.generateStatusUpdateNotification(
          application.email,
          `${application.firstName} ${application.lastName}`,
          programTitle,
          status,
          'program',
          reviewNotes
        );
        await emailService.sendEmail(statusEmailTemplate);
      } catch (emailError) {
        console.error("Status update email failed (status updated successfully):", emailError);
      }
      
      res.json(application);
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ message: "Failed to update application status" });
    }
  });

  app.delete("/api/applications/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteApplication(id);
      if (!success) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json({ message: "Application deleted successfully" });
    } catch (error) {
      console.error("Error deleting application:", error);
      res.status(500).json({ message: "Failed to delete application" });
    }
  });

  // Event applications routes
  app.get("/api/event-applications", isAuthenticated, isEditor, async (req, res) => {
    try {
      const applications = await storage.getEventApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching event applications:", error);
      res.status(500).json({ message: "Failed to fetch event applications" });
    }
  });

  app.post("/api/event-applications", async (req, res) => {
    try {
      const application = await storage.createEventApplication(req.body);
      
      // Get event title for email
      const event = await storage.getEvent(req.body.eventId);
      const eventTitle = event ? event.title : 'Etkinlik';
      
      // Send emails (best-effort, don't fail the request if email fails)
      try {
        const adminEmailTemplate = emailService.generateEventApplicationEmail(eventTitle, req.body);
        await emailService.sendEmail(adminEmailTemplate);
        
        const applicantEmailTemplate = emailService.generateEventApplicationConfirmation(
          req.body.email,
          `${req.body.firstName} ${req.body.lastName}`,
          eventTitle
        );
        await emailService.sendEmail(applicantEmailTemplate);
      } catch (emailError) {
        console.error("Email notification failed (event application created successfully):", emailError);
      }
      
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating event application:", error);
      res.status(500).json({ message: "Failed to create event application" });
    }
  });

  app.patch("/api/event-applications/:id/status", isAuthenticated, isEditor, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, reviewNotes } = req.body;
      const reviewedBy = (req.user as any)?.claims?.sub;
      
      const application = await storage.updateEventApplicationStatus(id, status, reviewNotes, reviewedBy);
      if (!application) {
        return res.status(404).json({ message: "Event application not found" });
      }
      
      // Send status update notification to applicant (best-effort)
      try {
        const event = await storage.getEvent(application.eventId);
        const eventTitle = event ? event.title : 'Etkinlik';
        
        const statusEmailTemplate = emailService.generateStatusUpdateNotification(
          application.email,
          `${application.firstName} ${application.lastName}`,
          eventTitle,
          status,
          'event',
          reviewNotes
        );
        await emailService.sendEmail(statusEmailTemplate);
      } catch (emailError) {
        console.error("Status update email failed (event status updated successfully):", emailError);
      }
      
      res.json(application);
    } catch (error) {
      console.error("Error updating event application:", error);
      res.status(500).json({ message: "Failed to update event application" });
    }
  });

  app.delete("/api/event-applications/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEventApplication(id);
      if (!success) {
        return res.status(404).json({ message: "Event application not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event application:", error);
      res.status(500).json({ message: "Failed to delete event application" });
    }
  });

  // Mentor booking status update
  app.patch("/api/mentor-bookings/:id/status", isAuthenticated, isEditor, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, reviewNotes } = req.body;
      const reviewedBy = (req.user as any)?.claims?.sub;
      
      const booking = await storage.updateMentorBookingStatus(id, status, reviewNotes, reviewedBy);
      if (!booking) {
        return res.status(404).json({ message: "Mentor booking not found" });
      }
      
      // Send status update notification to applicant (best-effort)
      try {
        const mentor = await storage.getMentor(booking.mentorId);
        const mentorName = mentor ? mentor.name : 'Mentor';
        
        const statusEmailTemplate = emailService.generateStatusUpdateNotification(
          booking.applicantEmail,
          booking.applicantName,
          mentorName,
          status,
          'mentor',
          reviewNotes
        );
        await emailService.sendEmail(statusEmailTemplate);
      } catch (emailError) {
        console.error("Status update email failed (booking status updated successfully):", emailError);
      }
      
      res.json(booking);
    } catch (error) {
      console.error("Error updating mentor booking status:", error);
      res.status(500).json({ message: "Failed to update mentor booking status" });
    }
  });

  // Contact form route
  app.post("/api/contact", async (req, res) => {
    try {
      // Send email notification to admin
      const emailTemplate = emailService.generateContactFormEmail(req.body);
      await emailService.sendEmail(emailTemplate);
      
      res.status(200).json({ message: "İletişim mesajınız başarıyla gönderildi" });
    } catch (error) {
      console.error("Error sending contact form:", error);
      res.status(500).json({ message: "İletişim mesajı gönderilirken bir hata oluştu" });
    }
  });

  // Download deployment package route
  app.get("/download-package", (req, res) => {
    try {
      const filePath = path.join(process.cwd(), 'itu-ginova-deployment-package.tar.gz');
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Deployment package not found" });
      }

      res.download(filePath, 'itu-ginova-deployment-package.tar.gz', (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          if (!res.headersSent) {
            res.status(500).json({ message: "Error downloading file" });
          }
        }
      });
    } catch (error) {
      console.error("Error in download route:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
