#!/usr/bin/env node
/**
 * Download all images from Replit Object Storage to local folder
 * Run this on Replit: node scripts/download-images.mjs
 * Then copy the ./downloaded-images folder to your production server
 */

import { Storage } from "@google-cloud/storage";
import * as fs from "fs";
import * as path from "path";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
const BUCKET_ID = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID || process.env.REPLIT_DEFAULT_BUCKET_ID;
const OUTPUT_DIR = "./downloaded-images";

if (!BUCKET_ID) {
  console.error("ERROR: Not running on Replit or Object Storage not configured");
  process.exit(1);
}

async function downloadAllImages() {
  console.log("=".repeat(60));
  console.log("Replit Object Storage Image Downloader");
  console.log("=".repeat(60));
  console.log(`Bucket ID: ${BUCKET_ID}`);
  
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
  
  console.log("\nFetching file list from Object Storage...");
  
  try {
    // List all files in the bucket
    const [files] = await bucket.getFiles({ prefix: ".private/uploads/" });
    
    console.log(`Found ${files.length} files to download\n`);
    
    let downloaded = 0;
    let failed = 0;
    
    for (const file of files) {
      const filename = path.basename(file.name);
      const outputPath = path.join(OUTPUT_DIR, filename);
      
      try {
        console.log(`Downloading: ${filename}...`);
        const [buffer] = await file.download();
        fs.writeFileSync(outputPath, buffer);
        downloaded++;
        console.log(`  ✓ Saved to ${outputPath}`);
      } catch (error) {
        console.error(`  ✗ Failed: ${error.message}`);
        failed++;
      }
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("Download Complete!");
    console.log(`  Downloaded: ${downloaded} files`);
    console.log(`  Failed: ${failed} files`);
    console.log(`  Output folder: ${OUTPUT_DIR}`);
    console.log("=".repeat(60));
    
    console.log("\nNext steps:");
    console.log("1. Zip the downloaded-images folder:");
    console.log("   zip -r images.zip downloaded-images/");
    console.log("");
    console.log("2. Transfer to your server:");
    console.log("   scp images.zip root@your-server:/home/ginovalno/public_html/");
    console.log("");
    console.log("3. On the server, extract to uploads folder:");
    console.log("   cd /home/ginovalno/public_html");
    console.log("   unzip images.zip");
    console.log("   mv downloaded-images/* uploads/");
    console.log("   rm -rf downloaded-images images.zip");
    
  } catch (error) {
    console.error("Error listing files:", error);
    process.exit(1);
  }
}

downloadAllImages();
