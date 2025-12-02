import { Storage, File } from "@google-cloud/storage";
import { Response } from "express";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";
import { ImageOptimizer } from "./imageOptimizer";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
const REPLIT_BUCKET_ID = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID || process.env.REPLIT_DEFAULT_BUCKET_ID;
const PRIVATE_OBJECT_DIR = process.env.PRIVATE_OBJECT_DIR;

const IS_REPLIT = !!REPLIT_BUCKET_ID;

let replitStorageClient: Storage | null = null;

if (IS_REPLIT) {
  try {
    replitStorageClient = new Storage({
      credentials: {
        audience: "replit",
        subject_token_type: "access_token",
        token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
        type: "external_account",
        credential_source: {
          url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
          format: {
            type: "json",
            subject_token_field_name: "access_token",
          },
        },
        universe_domain: "googleapis.com",
      },
      projectId: "",
    });
    console.log(`Replit Object Storage client initialized. Bucket: ${REPLIT_BUCKET_ID}`);
  } catch (error) {
    console.warn('Failed to initialize Replit Object Storage client:', error);
    replitStorageClient = null;
  }
}

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

function ensureUploadDir(): void {
  if (!IS_REPLIT && !fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    console.log(`Created upload directory: ${UPLOAD_DIR}`);
  }
}

interface LocalFile {
  path: string;
  buffer: Buffer;
  mimeType: string;
}

export class ObjectStorageService {
  constructor() {
    ensureUploadDir();
    if (IS_REPLIT && replitStorageClient) {
      console.log(`Object storage mode: Replit Object Storage`);
    } else {
      console.log(`Object storage mode: Local filesystem. UPLOAD_DIR: ${UPLOAD_DIR}`);
    }
  }

  getUploadDir(): string {
    return UPLOAD_DIR;
  }

  getPublicObjectSearchPaths(): Array<string> {
    if (IS_REPLIT && PRIVATE_OBJECT_DIR) {
      return [PRIVATE_OBJECT_DIR];
    }
    return [UPLOAD_DIR];
  }

  getPrivateObjectDir(): string {
    if (IS_REPLIT && PRIVATE_OBJECT_DIR) {
      return PRIVATE_OBJECT_DIR;
    }
    return UPLOAD_DIR;
  }

  async getObjectEntityUploadURL(): Promise<string> {
    const objectId = randomUUID();
    return `/api/upload-image?id=${objectId}`;
  }

  private extractFilename(objectPath: string): string {
    let filename = objectPath;
    
    if (filename.startsWith('/objects/uploads/')) {
      filename = filename.slice(17);
    } else if (filename.startsWith('/objects/')) {
      filename = filename.slice(9);
      if (filename.startsWith('uploads/')) {
        filename = filename.slice(8);
      }
    } else if (filename.startsWith('/uploads/')) {
      filename = filename.slice(9);
    } else if (filename.startsWith('uploads/')) {
      filename = filename.slice(8);
    } else if (filename.startsWith('/')) {
      filename = filename.slice(1);
    }
    
    return filename;
  }

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  private getGcsFile(filename: string): File | null {
    if (!IS_REPLIT || !replitStorageClient || !REPLIT_BUCKET_ID) {
      return null;
    }
    const bucket = replitStorageClient.bucket(REPLIT_BUCKET_ID);
    return bucket.file(`.private/uploads/${filename}`);
  }

  async uploadOptimizedImage(
    imageBuffer: Buffer,
    isProfilePhoto: boolean = false
  ): Promise<string> {
    const objectId = randomUUID();
    const filename = `${objectId}.jpg`;
    
    let optimizedBuffer: Buffer;
    try {
      if (isProfilePhoto) {
        optimizedBuffer = await ImageOptimizer.optimizeProfilePhoto(imageBuffer, {
          maxWidth: 400,
          maxHeight: 400,
          quality: 85,
          format: 'jpeg'
        });
      } else {
        optimizedBuffer = await ImageOptimizer.smartCompress(imageBuffer);
      }
    } catch (error) {
      console.warn('Image optimization failed, using original:', error);
      optimizedBuffer = imageBuffer;
    }

    const gcsFile = this.getGcsFile(filename);
    if (gcsFile) {
      await gcsFile.save(optimizedBuffer, {
        metadata: { contentType: 'image/jpeg' }
      });
      console.log(`Uploaded to Replit Object Storage: .private/${filename}`);
      return `/objects/uploads/${filename}`;
    } else {
      ensureUploadDir();
      const filePath = path.join(UPLOAD_DIR, filename);
      fs.writeFileSync(filePath, optimizedBuffer);
      console.log(`Uploaded to local filesystem: ${filePath}`);
      return `/uploads/${filename}`;
    }
  }

  async uploadFile(
    fileBuffer: Buffer,
    originalFilename: string,
    mimeType: string
  ): Promise<string> {
    const objectId = randomUUID();
    const ext = path.extname(originalFilename) || '.bin';
    const filename = `${objectId}${ext}`;

    const gcsFile = this.getGcsFile(filename);
    if (gcsFile) {
      await gcsFile.save(fileBuffer, {
        metadata: { contentType: mimeType }
      });
      console.log(`Uploaded to Replit Object Storage: .private/${filename}`);
      return `/objects/uploads/${filename}`;
    } else {
      ensureUploadDir();
      const filePath = path.join(UPLOAD_DIR, filename);
      fs.writeFileSync(filePath, fileBuffer);
      console.log(`Uploaded to local filesystem: ${filePath}`);
      return `/uploads/${filename}`;
    }
  }

  async searchPublicObject(filePath: string): Promise<LocalFile | null> {
    const filename = this.extractFilename(filePath);
    
    const gcsFile = this.getGcsFile(filename);
    if (gcsFile) {
      try {
        const [exists] = await gcsFile.exists();
        if (!exists) return null;
        
        const [buffer] = await gcsFile.download();
        return {
          path: `.private/${filename}`,
          buffer,
          mimeType: this.getMimeType(filename)
        };
      } catch (error) {
        console.error('Error searching in Replit Object Storage:', error);
        return null;
      }
    } else {
      const fullPath = path.join(UPLOAD_DIR, filename);
      if (!fs.existsSync(fullPath)) {
        return null;
      }
      
      const buffer = fs.readFileSync(fullPath);
      return {
        path: fullPath,
        buffer,
        mimeType: this.getMimeType(filename)
      };
    }
  }

  async getObjectEntityFile(objectPath: string): Promise<LocalFile> {
    const filename = this.extractFilename(objectPath);
    
    const gcsFile = this.getGcsFile(filename);
    if (gcsFile) {
      try {
        const [exists] = await gcsFile.exists();
        
        if (!exists) {
          console.error(`File not found in Replit Object Storage: .private/${filename}`);
          throw new ObjectNotFoundError();
        }
        
        const [buffer] = await gcsFile.download();
        return {
          path: `.private/${filename}`,
          buffer,
          mimeType: this.getMimeType(filename)
        };
      } catch (error) {
        if (error instanceof ObjectNotFoundError) throw error;
        console.error(`Error accessing Replit Object Storage:`, error);
        throw new ObjectNotFoundError();
      }
    } else {
      const fullPath = path.join(UPLOAD_DIR, filename);
      
      if (!fs.existsSync(fullPath)) {
        console.error(`File not found in local filesystem: ${fullPath}`);
        throw new ObjectNotFoundError();
      }
      
      const buffer = fs.readFileSync(fullPath);
      return {
        path: fullPath,
        buffer,
        mimeType: this.getMimeType(filename)
      };
    }
  }

  async downloadObject(file: LocalFile, res: Response, cacheTtlSec: number = 3600) {
    try {
      res.set({
        "Content-Type": file.mimeType,
        "Content-Length": file.buffer.length.toString(),
        "Cache-Control": `public, max-age=${cacheTtlSec}`,
      });
      
      res.send(file.buffer);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }

  async deleteFile(objectPath: string): Promise<boolean> {
    const filename = this.extractFilename(objectPath);
    
    const gcsFile = this.getGcsFile(filename);
    if (gcsFile) {
      try {
        await gcsFile.delete();
        console.log(`Deleted from Replit Object Storage: .private/${filename}`);
        return true;
      } catch (error) {
        console.error('Error deleting from Replit Object Storage:', error);
        return false;
      }
    } else {
      const filePath = path.join(UPLOAD_DIR, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted from local filesystem: ${filePath}`);
        return true;
      }
      return false;
    }
  }

  normalizeObjectEntityPath(rawPath: string): string {
    if (!rawPath) return rawPath;
    
    if (rawPath.startsWith('/uploads/') || rawPath.startsWith('/objects/')) {
      return rawPath;
    }
    
    if (rawPath.startsWith('https://') || rawPath.startsWith('http://')) {
      try {
        const url = new URL(rawPath);
        return url.pathname;
      } catch {
        return rawPath;
      }
    }
    
    if (!rawPath.startsWith('/')) {
      return IS_REPLIT ? `/objects/uploads/${rawPath}` : `/uploads/${rawPath}`;
    }
    
    return rawPath;
  }
}

export const objectStorageService = new ObjectStorageService();
