// ============================================
// FRONTEND MESSAGE ENCRYPTION & DECRYPTION (AES-256-GCM)
// ============================================
// This encrypts messages BEFORE sending to backend
// Uses Web Crypto API (available in all modern browsers)
// - Matches backend encryption format for compatibility
// - Same algorithm: AES-256-GCM
// ============================================

const IV_LENGTH = 12; // 12 bytes for AES-GCM
const ENCRYPTION_PREFIX = "enc"; // Marks encrypted messages

// Helper: Convert Uint8Array to base64 string
const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

// Helper: Convert base64 string to Uint8Array
const base64ToArrayBuffer = (base64) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

/**
 * Derive encryption key from secret
 * Converts hex/base64 string to CryptoKey for AES-256-GCM
 * 
 * @returns {Promise<CryptoKey|null>} - Crypto key or null if key not available
 */
const getEncryptionKey = async () => {
  // Try to get from environment variable first (set in .env.local)
  // Then fallback to localStorage (user can paste their key)
  const keyString = 
    process.env.REACT_APP_MESSAGE_ENCRYPTION_KEY || 
    localStorage.getItem("encryption_key");

  if (!keyString) {
    // ⚠️ CRITICAL: Log this as an error, not just a warning
    const errorMsg = "❌ CRITICAL: Encryption key not found! Messages will be sent unencrypted!\n\n" +
      "Solution:\n" +
      "1. Create file: frontend/.env.local\n" +
      "2. Add this line:\n" +
      "   REACT_APP_MESSAGE_ENCRYPTION_KEY=ad70361a3d89be124ca8a04f39511a94770e8d76dafd08e0bab7e349a9a21a0b\n" +
      "3. Restart React app (npm start)\n\n" +
      "Check: frontend/.env.local file exists ✓";
    
    console.error(errorMsg);
    return null;
  }

  try {
    // Convert key string to bytes
    let keyBytes;
    
    // Try hex format first
    if (/^[0-9a-f]{64}$/i.test(keyString.trim())) {
      // Hex string (64 chars = 32 bytes)
      keyBytes = new Uint8Array(
        keyString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      );
      console.log("✅ Encryption key loaded (HEX format, 32 bytes)");
    } else {
      // Try base64 format
      keyBytes = base64ToArrayBuffer(keyString);
      console.log("✅ Encryption key loaded (BASE64 format, 32 bytes)");
    }

    // Verify key is 32 bytes (256 bits)
    if (keyBytes.length !== 32) {
      console.error("❌ Encryption key must be 32 bytes (256 bits), got " + keyBytes.length);
      return null;
    }

    // Import as CryptoKey for Web Crypto API
    return await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
  } catch (error) {
    console.error("❌ Failed to load encryption key:", error.message);
    return null;
  }
};

/**
 * ENCRYPT a message before sending
 * Format: "enc:iv:ciphertext:authTag" (all base64, matches backend format)
 *
 * @param {string} plainText - Message to encrypt
 * @returns {Promise<string>} - Encrypted message or original if encryption fails
 *
 * Example:
 *   await encryptMessage("Hello")
 *   => "enc:abc123:def456:ghi789"
 */
export const encryptMessage = async (plainText) => {
  try {
    // Get encryption key
    const key = await getEncryptionKey();
    if (!key) {
      return plainText; // No key available, return plaintext
    }

    // Step 1: Create random IV (initialization vector)
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    // Step 2: Encode text to bytes
    const encoded = new TextEncoder().encode(plainText);

    // Step 3: Encrypt using AES-256-GCM
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encoded
    );

    // Step 4: Format as "enc:iv:ciphertext:authTag" (all base64)
    // Note: In Web Crypto API, authTag is included in ciphertext for GCM mode
    const encryptedMessage = [
      ENCRYPTION_PREFIX,
      arrayBufferToBase64(iv),
      arrayBufferToBase64(ciphertext),
    ].join(":");

    return encryptedMessage;
  } catch (error) {
    console.error("❌ Encryption failed:", error.message);
    return plainText; // Return plaintext if encryption fails
  }
};

/**
 * DECRYPT a received message
 * Format: "enc:iv:ciphertext:authTag" (all base64)
 *
 * @param {string} payload - Encrypted message
 * @returns {Promise<string>} - Decrypted message or payload if decryption fails
 *
 * Example:
 *   await decryptMessage("enc:abc123:def456:ghi789")
 *   => "Hello"
 */
export const decryptMessage = async (payload) => {
  try {
    // If no payload, return empty
    if (!payload) return payload;

    // Check if this is an encrypted message (starts with "enc:")
    const parts = String(payload).split(":");
    if (parts.length !== 3 || parts[0] !== ENCRYPTION_PREFIX) {
      return payload; // Not encrypted, return as-is
    }

    // Get decryption key
    const key = await getEncryptionKey();
    if (!key) {
      return payload; // No key available, return as-is
    }

    // Extract IV and ciphertext
    const [, ivB64, ciphertextB64] = parts;
    const iv = base64ToArrayBuffer(ivB64);
    const ciphertext = base64ToArrayBuffer(ciphertextB64);

    // Step 1: Decrypt using AES-256-GCM
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      ciphertext
    );

    // Step 2: Convert bytes back to text
    const plainText = new TextDecoder().decode(decrypted);
    return plainText;
  } catch (error) {
    console.error("❌ Decryption failed:", error.message);
    return payload; // Return original payload if decryption fails
  }
};

/**
 * Decrypt a message object (used for displaying received messages)
 *
 * @param {Object} message - Message object with 'message' field
 * @returns {Promise<Object>} - Message object with decrypted message field
 */
export const decryptMessageObject = async (message) => {
  if (!message) return message;
  const decrypted = await decryptMessage(message.message);
  return { ...message, message: decrypted };
};
