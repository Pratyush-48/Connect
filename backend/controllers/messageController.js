import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { decryptMessage, encryptMessage } from "../utils/messageCrypto.js";

/**
 * SEND MESSAGE ENDPOINT
 * 
 * Flow:
 * 1. Receive encrypted message from frontend
 * 2. Save encrypted message to database
 * 3. Decrypt message for display
 * 4. Send decrypted message via Socket.IO to receiver
 * 5. Return decrypted message to sender
 */
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // ========================================
        // STEP 1: Create or update conversation
        // ========================================
        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        // ========================================
        // STEP 2: Save encrypted message to database
        // (Message already encrypted by frontend)
        // ========================================
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message: message // Already encrypted from frontend
        });

        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        }

        await Promise.all([gotConversation.save(), newMessage.save()]);

        // ========================================
        // STEP 3: Decrypt message for real-time display
        // ========================================
        const socketMessage = newMessage.toObject();
        socketMessage.message = decryptMessage(socketMessage.message);

        // ========================================
        // STEP 4: Send decrypted message to receiver via Socket.IO
        // ========================================
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", socketMessage);
        }

        // ========================================
        // STEP 5: Return decrypted message to sender
        // ========================================
        const responseMessage = newMessage.toObject();
        const encryptedMsg = responseMessage.message; // Original encrypted message
        const decryptedMsg = decryptMessage(encryptedMsg); // Decrypt it
        responseMessage.message = decryptedMsg; // Set decrypted version to response
        
        console.log("✅ Sending Response to Frontend:");
        console.log(`   Database has (encrypted): ${encryptedMsg.substring(0, 50)}...`);
        console.log(`   Returning to frontend (decrypted): "${decryptedMsg}"`);
        
        return res.status(201).json({
            newMessage: responseMessage
        })
    } catch (error) {
        console.log("Error in sendMessage:", error);
        return res.status(500).json({ message: "Failed to send message" });
    }
}

/**
 * GET MESSAGES ENDPOINT
 * 
 * Flow:
 * 1. Fetch conversation between sender and receiver
 * 2. Get all messages from conversation
 * 3. Decrypt each message for display
 * 4. Return decrypted messages
 */
export const getMessage = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;

        // ========================================
        // STEP 1: Fetch conversation with all messages
        // ========================================
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        // ========================================
        // STEP 2: Decrypt all messages
        // ========================================
        const messages = (conversation?.messages || []).map((msg) => {
            const messageObj = msg.toObject();
            messageObj.message = decryptMessage(messageObj.message);
            return messageObj;
        });

        return res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessage:", error);
        return res.status(500).json({ message: "Failed to fetch messages" });
    }
} 