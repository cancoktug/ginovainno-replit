import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import path from 'path';

const bucketId = 'replit-objstore-757aa3d2-013d-4ee5-a508-1fafa4005d6d';
const storage = new Storage();
const bucket = storage.bucket(bucketId);

const filePath = 'DEPLOYMENT-PACKAGE-DOWNLOAD-ME.tar.gz';
const destFileName = 'public/ginova-deployment.tar.gz';

console.log('Starting upload...');
console.log('File size:', (fs.statSync(filePath).size / 1024 / 1024).toFixed(2), 'MB');

try {
  await bucket.upload(filePath, {
    destination: destFileName,
    metadata: {
      contentType: 'application/gzip',
      cacheControl: 'public, max-age=3600',
    },
    public: true,
  });

  const publicUrl = `https://storage.googleapis.com/${bucketId}/${destFileName}`;
  console.log('\n✅ UPLOAD SUCCESSFUL!');
  console.log('\n📥 DOWNLOAD LINK:');
  console.log(publicUrl);
  console.log('\nCopy this link and paste it in your browser to download the file.');
} catch (error) {
  console.error('Upload failed:', error.message);
  process.exit(1);
}
