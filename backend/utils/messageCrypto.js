import crypto from "crypto";

// ============================================
// MESSAGE ENCRYPTION & DECRYPTION (AES-256-GCM)
// ============================================
// This uses AES-256-GCM: a modern, secure encryption algorithm
// - AES-256: Military-grade encryption with 256-bit key
// - GCM: Galois/Counter Mode provides authentication tag (detects tampering)
// - IV: Random 12-byte initialization vector (unique for every message)
// ============================================

const IV_LENGTH = 12; // 12 bytes for AES-GCM

/**
 * Get encryption key from environment variable
 * Converts hex string (64 chars = 32 bytes) to Buffer
 * MUST MATCH frontend key derivation!
 */
const getKey = () => {
    const key = process.env.MESSAGE_ENCRYPTION_KEY;
    if (!key) {
        throw new Error("❌ MESSAGE_ENCRYPTION_KEY environment variable is not set!");
    }
    
    // If key is already 64 hex characters (32 bytes), use it directly
    if (/^[0-9a-f]{64}$/i.test(key.trim())) {
        // Convert hex string to Buffer (matches frontend behavior)
        return Buffer.from(key.trim(), 'hex');
    }
    
    // Fallback: Hash the key if it's not in hex format
    return crypto.createHash("sha256").update(key).digest();
};

/**
 * ENCRYPT a message before saving to database
 * Format: "enc:[iv]:[ciphertext]:[authTag]" (all base64)
 *
 * @param {string} plainText - The message to encrypt
 * @returns {string} - Encrypted message in format: enc:iv:ciphertext:authTag
 *
 * Example:
 *   encryptMessage("Hello") 
 *   => "enc:abc123:def456:ghi789"
 */
export const encryptMessage = (plainText) => {
    // Step 1: Create random IV (initialization vector)
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Step 2: Get encryption key
    const key = getKey();
    
    // Step 3: Create cipher and encrypt
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const ciphertext = Buffer.concat([
        cipher.update(String(plainText), "utf8"),
        cipher.final(),
    ]);
    
    // Step 4: Get authentication tag (proves message wasn't tampered with)
    const authTag = cipher.getAuthTag();

    // Step 5: Combine all parts as: enc:iv:ciphertext:authTag (all in base64)
    return [
        "enc",
        iv.toString("base64"),
        ciphertext.toString("base64"),
        authTag.toString("base64"),
    ].join(":");
};

/**
 * DECRYPT a message from database
 * Format: "enc:[iv]:[ciphertext]:[authTag]" (all base64)
 *
 * @param {string} payload - The encrypted message
 * @returns {string} - Original message or payload if decryption fails
 *
 * Example:
 *   decryptMessage("enc:abc123:def456:ghi789")
 *   => "Hello"
 */
export const decryptMessage = (payload) => {
    // If no payload, return as-is
    if (!payload) return payload;
    
    // Check if this is an encrypted message (starts with "enc:")
    const parts = String(payload).split(":");
    if (parts.length !== 4 || parts[0] !== "enc") {
        return payload; // Not encrypted, return as-is
    }

    try {
        // Extract IV, ciphertext, and auth tag
        const [, ivB64, dataB64, tagB64] = parts;
        const iv = Buffer.from(ivB64, "base64");
        const data = Buffer.from(dataB64, "base64");
        const authTag = Buffer.from(tagB64, "base64");
        
        // Get decryption key
        const key = getKey();

        // Create decipher and decrypt
        const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
        decipher.setAuthTag(authTag); // Verify authentication tag
        const plainText = Buffer.concat([
            decipher.update(data),
            decipher.final(),
        ]).toString("utf8");
        
        return plainText;
    } catch (error) {
        // If decryption fails, return the stored value to avoid breaking reads
        return payload;
    }
};
