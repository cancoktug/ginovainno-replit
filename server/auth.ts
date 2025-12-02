import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import connectPg from "connect-pg-simple";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function setupAuth(app: Express) {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "ginova-secret-key-2025",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "E-posta adresi veya şifre hatalı. Lütfen tekrar deneyin." });
          }
          
          if (!user.password) {
            return done(null, false, { message: "E-posta adresi veya şifre hatalı. Lütfen tekrar deneyin." });
          }

          const isValidPassword = await comparePasswords(password, user.password);
          if (!isValidPassword) {
            return done(null, false, { message: "E-posta adresi veya şifre hatalı. Lütfen tekrar deneyin." });
          }

          if (!user.isActive) {
            return done(null, false, { message: "Bu hesap şu anda kullanılamıyor. Lütfen yönetici ile iletişime geçin." });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.get("/api/login", (req, res) => {
    if (req.isAuthenticated() && req.user) {
      return res.json({
        authenticated: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          role: req.user.role,
        }
      });
    }
    res.json({ authenticated: false, message: "Giriş yapılmadı" });
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Giriş sırasında hata oluştu" });
      }
      if (!user) {
        return res.status(401).json({ 
          message: info?.message || "Geçersiz giriş bilgileri" 
        });
      }
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Oturum başlatılamadı" });
        }
        res.status(200).json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        });
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        res.redirect("/");
      });
    });
  });

  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Giriş yapmanız gerekiyor" });
    }
    res.json({
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
    });
  });

  // Create default admin user if none exists
  try {
    const adminUser = await storage.getUserByEmail("ginova@itu.edu.tr");
    if (!adminUser) {
      const hashedPassword = await hashPassword("Ginova123.*");
      await storage.createUser({
        id: "admin-user",
        email: "ginova@itu.edu.tr",
        firstName: "Ginova",
        lastName: "Admin",
        role: "admin",
        password: hashedPassword,
        isActive: true,
      });
      console.log("Default admin user created: ginova@itu.edu.tr / Ginova123.*");
    }
  } catch (error) {
    console.error("Error creating default admin user:", error);
  }
}

export const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  res.status(401).json({ message: "Giriş yapmanız gerekiyor" });
};

export const isAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Bu işlem için yetkiniz yoktur" });
};

export const isEditor = (req: any, res: any, next: any) => {
  if (req.user?.role === "admin" || req.user?.role === "editor") {
    return next();
  }
  res.status(403).json({ message: "Bu işlem için yetkiniz yoktur" });
};