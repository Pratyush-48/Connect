import React from 'react'
import Message from './Message'
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from "react-redux";
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';
import './responsive.css';
const Messages = () => {
    useGetMessages();
    useGetRealTimeMessage();
    const { messages } = useSelector(store => store.message);
    if (!messages || messages.length === 0) {
        return (
            <div className="message-list message-empty">
                <p>No messages yet. Say hello to get started.</p>
            </div>
        );
    }

    return (
        <div className="message-list">
            {messages?.map((message) => (
                <Message key={message._id} message={message} />
            ))}
        </div>
    )
}

export default Messages