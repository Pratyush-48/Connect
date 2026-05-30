#!/usr/bin/env node

/**
 * ENCRYPTION SETUP VERIFICATION SCRIPT
 * 
 * Run this to verify:
 * ✅ Encryption key is properly configured
 * ✅ Backend encryption/decryption works
 * ✅ Key format is correct
 * ✅ All components are compatible
 */

import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log("\n" + "=".repeat(60));
console.log("🔐 ENCRYPTION SETUP VERIFICATION");
console.log("=".repeat(60) + "\n");

// ============================================
// CHECK 1: Environment Variable
// ============================================
console.log("📋 CHECK 1: Environment Variables");
console.log("-".repeat(60));

const backendKey = process.env.MESSAGE_ENCRYPTION_KEY;
const frontendKey = process.env.REACT_APP_MESSAGE_ENCRYPTION_KEY;

if (!backendKey) {
    console.log("❌ MESSAGE_ENCRYPTION_KEY is NOT set!");
} else {
    console.log("✅ MESSAGE_ENCRYPTION_KEY is set");
    console.log(`   Value: ${backendKey.substring(0, 16)}...${backendKey.substring(backendKey.length - 16)}`);
}

if (!frontendKey) {
    console.log("❌ REACT_APP_MESSAGE_ENCRYPTION_KEY is NOT set!");
} else {
    console.log("✅ REACT_APP_MESSAGE_ENCRYPTION_KEY is set");
    console.log(`   Value: ${frontendKey.substring(0, 16)}...${frontendKey.substring(frontendKey.length - 16)}`);
}

// ============================================
// CHECK 2: Key Format
// ============================================
console.log("\n📋 CHECK 2: Key Format");
console.log("-".repeat(60));

const isHexFormat = /^[0-9a-f]{64}$/i.test(backendKey?.trim() || "");
const keyLength = backendKey?.length || 0;
const keyBytes = isHexFormat ? 32 : keyLength;

console.log(`Key Format: ${isHexFormat ? "✅ HEX" : "⚠️  STRING"}`);
console.log(`Key Length: ${keyLength} characters`);
console.log(`Key Size: ${keyBytes} bytes (${keyBytes * 8} bits)`);

if (isHexFormat) {
    console.log("✅ Key is in proper 64-character hex format (32 bytes)");
} else if (keyLength >= 16) {
    console.log("⚠️  Key is a string - will be hashed to 32 bytes");
} else {
    console.log("❌ Key is too short!");
}

// ============================================
// CHECK 3: Key Match
// ============================================
console.log("\n📋 CHECK 3: Key Match (Backend vs Frontend)");
console.log("-".repeat(60));

if (backendKey === frontendKey) {
    console.log("✅ Backend and Frontend keys MATCH");
} else {
    console.log("❌ Backend and Frontend keys DO NOT MATCH!");
    console.log(`   Backend:  ${backendKey?.substring(0, 20)}...`);
    console.log(`   Frontend: ${frontendKey?.substring(0, 20)}...`);
}

// ============================================
// CHECK 4: Derive Key (Backend Style)
// ============================================
console.log("\n📋 CHECK 4: Key Derivation (Backend Method)");
console.log("-".repeat(60));

try {
    const keyBuffer = isHexFormat 
        ? Buffer.from(backendKey.trim(), 'hex')
        : crypto.createHash("sha256").update(backendKey).digest();
    
    console.log("✅ Key derived successfully");
    console.log(`   Derived Key: ${keyBuffer.toString('hex').substring(0, 20)}...`);
    console.log(`   Size: ${keyBuffer.length} bytes (${keyBuffer.length * 8} bits)`);
} catch (error) {
    console.log(`❌ Key derivation failed: ${error.message}`);
}

// ============================================
// CHECK 5: Test Encryption/Decryption
// ============================================
console.log("\n📋 CHECK 5: Encryption/Decryption Test");
console.log("-".repeat(60));

try {
    const keyBuffer = isHexFormat 
        ? Buffer.from(backendKey.trim(), 'hex')
        : crypto.createHash("sha256").update(backendKey).digest();
    
    const testMessage = "Hello World - Test Message 123!";
    
    // Encrypt
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", keyBuffer, iv);
    const ciphertext = Buffer.concat([
        cipher.update(testMessage, "utf8"),
        cipher.final()
    ]);
    const authTag = cipher.getAuthTag();
    
    const encrypted = [
        "enc",
        iv.toString("base64"),
        ciphertext.toString("base64"),
        authTag.toString("base64")
    ].join(":");
    
    console.log("✅ Message encrypted successfully");
    console.log(`   Original: "${testMessage}"`);
    console.log(`   Encrypted: ${encrypted.substring(0, 50)}...`);
    
    // Decrypt
    const parts = encrypted.split(":");
    const decryptIv = Buffer.from(parts[1], "base64");
    const decryptData = Buffer.from(parts[2], "base64");
    const decryptTag = Buffer.from(parts[3], "base64");
    
    const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuffer, decryptIv);
    decipher.setAuthTag(decryptTag);
    const decrypted = Buffer.concat([
        decipher.update(decryptData),
        decipher.final()
    ]).toString("utf8");
    
    console.log("✅ Message decrypted successfully");
    console.log(`   Decrypted: "${decrypted}"`);
    
    if (testMessage === decrypted) {
        console.log("✅ ENCRYPTION/DECRYPTION WORKING PERFECTLY!");
    } else {
        console.log("❌ Decrypted message doesn't match original!");
    }
} catch (error) {
    console.log(`❌ Encryption test failed: ${error.message}`);
}

// ============================================
// CHECK 6: Environment File Status
// ============================================
console.log("\n📋 CHECK 6: Environment Files");
console.log("-".repeat(60));

console.log("Backend:  .env file in root directory");
console.log("Frontend: .env.local file in frontend directory");
console.log("\nMake sure:");
console.log("  ✓ Both files have the SAME encryption key");
console.log("  ✓ Backend has: MESSAGE_ENCRYPTION_KEY=<key>");
console.log("  ✓ Frontend has: REACT_APP_MESSAGE_ENCRYPTION_KEY=<key>");

// ============================================
// SUMMARY
// ============================================
console.log("\n" + "=".repeat(60));
console.log("📊 SUMMARY");
console.log("=".repeat(60));

const allChecks = {
    "Backend key set": !!backendKey,
    "Frontend key set": !!frontendKey,
    "Keys match": backendKey === frontendKey,
    "Key format correct": isHexFormat || (keyLength >= 16),
    "Key size correct": keyBytes >= 16
};

const passedChecks = Object.values(allChecks).filter(Boolean).length;
const totalChecks = Object.values(allChecks).length;

console.log(`\nPassed: ${passedChecks}/${totalChecks} checks`);

if (passedChecks === totalChecks) {
    console.log("\n🎉 ALL CHECKS PASSED! Encryption is properly configured.\n");
    process.exit(0);
} else {
    console.log("\n⚠️  Some checks failed. Review the issues above.\n");
    process.exit(1);
}
