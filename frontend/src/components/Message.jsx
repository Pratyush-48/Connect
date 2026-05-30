import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import getAvatarUrl from '../utils/avatar';
import { decryptMessage } from '../utils/messageCrypto';
import './responsive.css';

const Message = ({ message }) => {
    const scroll = useRef();
    const [displayMessage, setDisplayMessage] = useState(message?.message);
    const { authUser, selectedUser } = useSelector(store => store.user);

    // ========================================
    // DECRYPT MESSAGE if it's encrypted
    // ========================================
    useEffect(() => {
        const handleDecryption = async () => {
            if (!message?.message) {
                setDisplayMessage('');
                return;
            }

            // Check if message is encrypted (starts with "enc:")
            if (String(message.message).startsWith("enc:")) {
                try {
                    const decrypted = await decryptMessage(message.message);
                    setDisplayMessage(decrypted);
                    console.log("✅ Message decrypted for display:", decrypted.substring(0, 30) + "...");
                } catch (error) {
                    console.error("❌ Failed to decrypt message:", error);
                    setDisplayMessage(message.message); // Show encrypted if decryption fails
                }
            } else {
                // Message already decrypted
                setDisplayMessage(message.message);
            }
        };

        handleDecryption();
    }, [message?.message]);

    // Format Mongoose timestamp
    const formatTime = (timestamp) => {
        if (!timestamp) {
            console.warn('Timestamp is missing');
            return '--:--';
        }

        try {
            // Mongoose timestamps are already Date objects
            const date = new Date(timestamp);
            
            if (isNaN(date.getTime())) {
                console.warn('Invalid timestamp:', timestamp);
                return '--:--';
            }

            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            console.error('Error formatting timestamp:', error);
            return '--:--';
        }
    };

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    const isOwn = message?.senderId === authUser?._id;
    const ownSeed = authUser?.username || authUser?.fullName || authUser?._id || 'me';
    const otherSeed = selectedUser?.username || selectedUser?.fullName || selectedUser?._id || 'user';
    const avatarUrl = isOwn
        ? (authUser?.profilePhoto || getAvatarUrl(ownSeed))
        : (selectedUser?.profilePhoto || getAvatarUrl(otherSeed));

    return (
        <div
            ref={scroll}
            className={`message-row ${isOwn ? 'outgoing' : 'incoming'}`}
        >
            <div className="message-avatar">
                <img
                    alt="User avatar"
                    src={avatarUrl}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getAvatarUrl(isOwn ? ownSeed : otherSeed);
                    }}
                />
            </div>
            <div className="message-content">
                <div className="message-meta">
                    <span className="message-author">
                        {isOwn ? "You" : selectedUser?.fullName}
                    </span>
                    <time className="message-time">
                        {formatTime(message?.createdAt)}
                    </time>
                </div>
                <div className="message-bubble">
                    {/* ✅ Display decrypted message */}
                    {displayMessage}
                </div>
            </div>
        </div>
    );
};

Message.propTypes = {
    message: PropTypes.shape({
        senderId: PropTypes.string.isRequired,
        receiverId: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        createdAt: PropTypes.instanceOf(Date),  // Mongoose adds this
        updatedAt: PropTypes.instanceOf(Date)   // Mongoose adds this
    }).isRequired
};

export default Message;