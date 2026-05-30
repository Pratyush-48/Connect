import React, { useState } from 'react'
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';
import { encryptMessage } from '../utils/messageCrypto';
import './responsive.css';

const SendInput = () => {
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.user);
    const { messages } = useSelector(store => store.message);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // Validate message is not empty
        if (!message.trim()) {
            return;
        }

        try {
            // ========================================
            // STEP 1: ENCRYPT the message at sender side
            // ========================================
            const plainMessage = message;
            const encryptedMessage = await encryptMessage(message);

            // ========================================
            // SECURITY CHECK: Verify message was encrypted
            // ========================================
            if (!encryptedMessage.startsWith("enc:")) {
                console.error("❌ SECURITY ERROR: Message was not encrypted!");
                console.error("Plain message would be sent to backend.");
                alert("Encryption failed! Message contains: " + encryptedMessage.substring(0, 50));
                return; // Don't send unencrypted message
            }

            // ========================================
            // Log encryption for verification
            // ========================================
            console.log("✅ Message encrypted successfully");
            console.log(`   Original: "${plainMessage}"`);
            console.log(`   Encrypted: ${encryptedMessage.substring(0, 60)}...`);

            // ========================================
            // STEP 2: SEND encrypted message to backend
            // ========================================
            const res = await axios.post(
                `${BASE_URL}/api/v1/message/send/${selectedUser?._id}`,
                { message: encryptedMessage }, // Send encrypted version
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            // ========================================
            // STEP 3: Decrypt response message before adding to Redux
            // Backend returns decrypted, but ensure it is
            // ========================================
            const responseMessage = res?.data?.newMessage;
            if (responseMessage) {
                // If response message is still encrypted, decrypt it
                if (String(responseMessage.message).startsWith("enc:")) {
                    console.log("⚠️  Response message is encrypted, decrypting...");
                    const { decryptMessage } = await import('../utils/messageCrypto');
                    responseMessage.message = await decryptMessage(responseMessage.message);
                }
                console.log("✅ Message received from backend:");
                console.log(`   Decrypted: "${responseMessage.message}"`);
            }

            // ========================================
            // STEP 4: Add decrypted message to Redux for immediate display
            // ========================================
            dispatch(setMessages([...messages, responseMessage]))
        } catch (error) {
            console.error("Error sending message:", error);
        }

        // Clear input field
        setMessage("");
    }

    return (
        <form onSubmit={onSubmitHandler} className="message-input">
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                placeholder="Send a message"
                className="input-field"
            />
            <button type="submit" className="message-send" aria-label="Send message">
                <IoSend />
            </button>
        </form>
    )
}

export default SendInput