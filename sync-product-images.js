#!/usr/bin/env node

/**
 * Auto-Copy Product Images Script
 * Automatically copies new images from /Images folder to /public/images/products
 * Run with: npm run sync-images
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, 'Images');
const DEST_DIR = path.join(__dirname, 'public', 'images', 'products');

// Ensure destination directory exists
if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
  console.log(`✓ Created directory: ${DEST_DIR}`);
}

// Copy images
try {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.log(`ℹ Source directory not found: ${SOURCE_DIR}`);
    process.exit(0);
  }

  const files = fs.readdirSync(SOURCE_DIR);
  let copiedCount = 0;
  let skippedCount = 0;

  files.forEach((file) => {
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())) {
      return;
    }

    const source = path.join(SOURCE_DIR, file);
    const dest = path.join(DEST_DIR, file);

    // Check if file already exists
    if (fs.existsSync(dest)) {
      skippedCount++;
      return;
    }

    // Copy file
    fs.copyFileSync(source, dest);
    console.log(`✓ Copied: ${file}`);
    copiedCount++;
  });

  console.log(`\nSummary:`);
  console.log(`  ✓ Copied: ${copiedCount}`);
  console.log(`  ⊘ Skipped (already exists): ${skippedCount}`);
  console.log(`\n✓ All images ready! Available at: /public/images/products/`);
} catch (error) {
  console.error('✗ Error while copying images:', error.message);
  process.exit(1);
}
