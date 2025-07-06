import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const Message = ({ message }) => {
    const scroll = useRef();
    const { authUser, selectedUser } = useSelector(store => store.user);

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

    return (
        <div 
            ref={scroll} 
            className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}
        >
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img 
                        alt="User avatar" 
                        src={
                            message?.senderId === authUser?._id 
                                ? authUser?.profilePhoto 
                                : selectedUser?.profilePhoto 
                        }
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-avatar.png';
                        }}
                    />
                </div>
            </div>
            <div className="chat-header">
                {message?.senderId !== authUser?._id && (
                    <span className="font-semibold">
                        {selectedUser?.fullName}
                    </span>
                )}
                <time className="text-xs opacity-50 text-white ml-2">
                    {formatTime(message?.createdAt)}  {/* Use createdAt instead of timestamp */}
                </time>
            </div>
            <div 
                className={`chat-bubble ${
                    message?.senderId !== authUser?._id 
                        ? 'bg-gray-200 text-black' 
                        : ''
                }`}
            >
                {message?.message}
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