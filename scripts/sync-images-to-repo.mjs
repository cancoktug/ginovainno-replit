#!/usr/bin/env node
/**
 * Sync all images from Replit Object Storage to uploads folder
 * This makes images part of the git repo so they deploy with the code
 * Run: node scripts/sync-images-to-repo.mjs
 */

import { Storage } from "@google-cloud/storage";
import * as fs from "fs";
import * as path from "path";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
const BUCKET_ID = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID || process.env.REPLIT_DEFAULT_BUCKET_ID;
const OUTPUT_DIR = "./uploads";

if (!BUCKET_ID) {
  console.log("Not running on Replit - skipping image sync");
  process.exit(0);
}

async function syncImages() {
  console.log("=".repeat(60));
  console.log("Syncing images from Replit Object Storage to uploads/");
  console.log("=".repeat(60));
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Initialize Replit Storage client
  const storage = new Storage({
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
  
  const bucket = storage.bucket(BUCKET_ID);
  
  console.log("\nFetching file list...");
  
  try {
    const [files] = await bucket.getFiles({ prefix: ".private/uploads/" });
    
    console.log(`Found ${files.length} files\n`);
    
    let downloaded = 0;
    let skipped = 0;
    let failed = 0;
    
    for (const file of files) {
      const filename = path.basename(file.name);
      const outputPath = path.join(OUTPUT_DIR, filename);
      
      // Skip if file already exists
      if (fs.existsSync(outputPath)) {
        skipped++;
        continue;
      }
      
      try {
        process.stdout.write(`Downloading: ${filename}... `);
        const [buffer] = await file.download();
        fs.writeFileSync(outputPath, buffer);
        downloaded++;
        console.log("✓");
      } catch (error) {
        console.log(`✗ ${error.message}`);
        failed++;
      }
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("Sync Complete!");
    console.log(`  Downloaded: ${downloaded} new files`);
    console.log(`  Skipped: ${skipped} existing files`);
    console.log(`  Failed: ${failed} files`);
    console.log("=".repeat(60));
    
    if (downloaded > 0) {
      console.log("\nDon't forget to commit the new images:");
      console.log("  git add uploads/");
      console.log("  git commit -m 'Sync images from Object Storage'");
      console.log("  git push");
    }
    
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

syncImages();
