import path from "path";

interface AppConfig {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  sessionSecret: string;
  baseUrl: string;
  uploadDir: string;
  isProduction: boolean;
  isReplit: boolean;
  email: {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
  };
  session: {
    secure: boolean;
    sameSite: "lax" | "strict" | "none";
    domain?: string;
  };
}

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
    console.error(`Please ensure ${key} is set in your .env file`);
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

function validateConfig(): AppConfig {
  const nodeEnv = getOptionalEnv("NODE_ENV", "development");
  const isProduction = nodeEnv === "production";
  const isReplit = !!process.env.REPLIT_DEV_DOMAIN || !!process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;

  const config: AppConfig = {
    nodeEnv,
    isProduction,
    isReplit,
    port: parseInt(getOptionalEnv("PORT", "5000"), 10),
    databaseUrl: getRequiredEnv("DATABASE_URL"),
    sessionSecret: getOptionalEnv("SESSION_SECRET", "dev-secret-change-in-production"),
    baseUrl: getOptionalEnv("BASE_URL", isReplit 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
      : "http://localhost:5000"),
    uploadDir: getOptionalEnv("UPLOAD_DIR", path.join(process.cwd(), "uploads")),
    email: {
      host: getOptionalEnv("EMAIL_HOST", "outgoing.itu.edu.tr"),
      port: parseInt(getOptionalEnv("EMAIL_PORT", "587"), 10),
      user: getOptionalEnv("EMAIL_USER", "ginova@itu.edu.tr"),
      password: getOptionalEnv("EMAIL_PASSWORD", ""),
      from: getOptionalEnv("EMAIL_FROM", "ginova@itu.edu.tr"),
    },
    session: {
      secure: getOptionalEnv("SESSION_COOKIE_SECURE", isProduction ? "true" : "false") === "true",
      sameSite: getOptionalEnv("SESSION_COOKIE_SAMESITE", "lax") as "lax" | "strict" | "none",
      domain: process.env.SESSION_COOKIE_DOMAIN,
    },
  };

  if (isProduction && config.sessionSecret === "dev-secret-change-in-production") {
    console.warn("WARNING: Using default session secret in production. Please set SESSION_SECRET environment variable.");
  }

  console.log(`Configuration loaded successfully:`);
  console.log(`  - Environment: ${config.nodeEnv}`);
  console.log(`  - Port: ${config.port}`);
  console.log(`  - Base URL: ${config.baseUrl}`);
  console.log(`  - Upload Dir: ${config.uploadDir}`);
  console.log(`  - Is Replit: ${config.isReplit}`);
  console.log(`  - Database: ${config.databaseUrl.replace(/:[^:@]+@/, ':****@')}`);

  return config;
}

export const config = validateConfig();
