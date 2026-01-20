#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IGNORE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', '.venv', '__pycache__'];
const EXTENSIONS = ['.jsx', '.js', '.css', '.module.css'];

// Get absolute path to src directory
const srcDir = path.join(__dirname, 'src');
const outputFile = path.join(__dirname, 'EXTRACTED_COMPONENTS.txt');

let output = '';
let fileCount = 0;

// Add header
output += '='.repeat(80) + '\n';
output += 'SHNOOR LMS - EXTRACTED COMPONENTS AND STYLING\n';
output += '='.repeat(80) + '\n';
output += `Generated: ${new Date().toISOString()}\n`;
output += `Source Directory: ${srcDir}\n`;
output += '='.repeat(80) + '\n\n';

/**
 * Recursively extract JSX and CSS files
 */
function extractFiles(dir, relativePath = '') {
  try {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const fileRelativePath = path.join(relativePath, file);
      const stat = fs.statSync(fullPath);

      // Skip ignored directories
      if (stat.isDirectory()) {
        if (!IGNORE_DIRS.includes(file)) {
          extractFiles(fullPath, fileRelativePath);
        }
        return;
      }

      // Process JSX and CSS files
      if (
        file.endsWith('.jsx') ||
        file.endsWith('.js') ||
        file.endsWith('.css') ||
        file.endsWith('.module.css')
      ) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');

          // Create a separator section for each file
          output += '\n' + '='.repeat(80) + '\n';
          output += `FILE: ${fileRelativePath}\n`;
          output += `PATH: ${fullPath}\n`;
          output += `SIZE: ${(content.length / 1024).toFixed(2)} KB\n`;
          output += '='.repeat(80) + '\n\n';

          output += content;
          output += '\n\n';

          fileCount++;
          console.log(`✓ Extracted: ${fileRelativePath}`);
        } catch (error) {
          console.error(`✗ Error reading ${fileRelativePath}:`, error.message);
        }
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
}

/**
 * Add summary section
 */
function addSummary() {
  output += '\n' + '='.repeat(80) + '\n';
  output += 'EXTRACTION SUMMARY\n';
  output += '='.repeat(80) + '\n';
  output += `Total Files Extracted: ${fileCount}\n`;
  output += `Output File: ${outputFile}\n`;
  output += `Generated: ${new Date().toISOString()}\n`;
  output += '='.repeat(80) + '\n';
}

/**
 * Main execution
 */
console.log('🚀 Starting extraction...\n');

try {
  if (!fs.existsSync(srcDir)) {
    throw new Error(`src directory not found at ${srcDir}`);
  }

  extractFiles(srcDir);
  addSummary();

  // Write to file
  fs.writeFileSync(outputFile, output, 'utf-8');

  console.log(`\n✅ Extraction complete!\n`);
  console.log(`📄 Output file: ${outputFile}`);
  console.log(`📊 Total files extracted: ${fileCount}`);
  console.log(`💾 File size: ${(fs.statSync(outputFile).size / 1024 / 1024).toFixed(2)} MB`);
} catch (error) {
  console.error(`\n❌ Error during extraction:`, error.message);
  process.exit(1);
}
