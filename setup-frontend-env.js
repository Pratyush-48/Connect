#!/usr/bin/env node

/**
 * QUICK SETUP SCRIPT
 * Automatically creates frontend/.env.local with encryption key
 * Run this: node setup-frontend-env.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.join(__dirname, 'frontend');
const envLocalPath = path.join(frontendDir, '.env.local');

const encryptionKey = 'ad70361a3d89be124ca8a04f39511a94770e8d76dafd08e0bab7e349a9a21a0b';
const baseUrl = 'http://localhost:8080';

console.log("\n" + "=".repeat(60));
console.log("🔐 FRONTEND ENCRYPTION SETUP");
console.log("=".repeat(60) + "\n");

// Check if .env.local already exists
if (fs.existsSync(envLocalPath)) {
    console.log("✅ frontend/.env.local already exists!");
    const content = fs.readFileSync(envLocalPath, 'utf-8');
    
    if (content.includes('REACT_APP_MESSAGE_ENCRYPTION_KEY')) {
        console.log("✅ Encryption key is already set\n");
        console.log("📝 Content:");
        console.log("-".repeat(60));
        console.log(content);
        console.log("-".repeat(60));
        console.log("\n✨ Your setup is complete!");
        console.log("\nNext steps:");
        console.log("1. Restart React app: cd frontend && npm start");
        console.log("2. Send a test message");
        console.log("3. Check browser console for: ✅ Message encrypted successfully\n");
    } else {
        console.log("⚠️  Encryption key not set in existing .env.local");
        console.log("Adding encryption key...\n");
        
        const newContent = content + `\nREACT_APP_MESSAGE_ENCRYPTION_KEY=${encryptionKey}`;
        fs.writeFileSync(envLocalPath, newContent, 'utf-8');
        
        console.log("✅ Encryption key added to frontend/.env.local");
        console.log("\n📝 Updated content:");
        console.log("-".repeat(60));
        console.log(newContent);
        console.log("-".repeat(60));
        console.log("\n🚀 Restart React app: cd frontend && npm start\n");
    }
} else {
    // Create .env.local
    const envContent = `REACT_APP_BASE_URL=${baseUrl}
REACT_APP_MESSAGE_ENCRYPTION_KEY=${encryptionKey}
`;
    
    try {
        fs.writeFileSync(envLocalPath, envContent, 'utf-8');
        console.log("✅ Created: frontend/.env.local\n");
        console.log("📝 Content:");
        console.log("-".repeat(60));
        console.log(envContent);
        console.log("-".repeat(60));
        console.log("\n" + "=".repeat(60));
        console.log("🎉 SETUP COMPLETE!");
        console.log("=".repeat(60) + "\n");
        console.log("⏭️  Next steps:\n");
        console.log("1. Stop React app if it's running (Ctrl+C)");
        console.log("2. Restart React:");
        console.log("   cd frontend");
        console.log("   npm start\n");
        console.log("3. Wait for compilation (~30 seconds)\n");
        console.log("4. Send a test message\n");
        console.log("5. Check browser console (F12 → Console) for:");
        console.log("   ✅ Message encrypted successfully\n");
        console.log("6. Check MongoDB - message should start with 'enc:'\n");
    } catch (error) {
        console.error("❌ Error creating .env.local:", error.message);
        console.log("\nManual fix:");
        console.log("1. Create file: frontend/.env.local");
        console.log("2. Add content:");
        console.log(envContent);
    }
}
