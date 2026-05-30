import React from 'react'
import SendInput from './SendInput'
import Messages from './Messages';
import { useSelector } from "react-redux";
import ThemeToggle from './ThemeToggle';
import getAvatarUrl from '../utils/avatar';
import './responsive.css';
const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
    const isOnline = Boolean(onlineUsers?.includes(selectedUser?._id));
    const selectedSeed = selectedUser?.username || selectedUser?.fullName || selectedUser?._id || 'user';
    const selectedAvatar = selectedUser?.profilePhoto || getAvatarUrl(selectedSeed);
   
    return (
        <div className="chat-main">
            <div className="chat-header">
                <div className="chat-header-left">
                    {selectedUser ? (
                        <>
                            <div className="chat-header-avatar">
                                <img
                                    src={selectedAvatar}
                                    alt="user-profile"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = getAvatarUrl(selectedSeed);
                                    }}
                                />
                                <span className={`presence-dot ${isOnline ? 'online' : 'offline'}`}></span>
                            </div>
                            <div className="chat-header-meta">
                                <p className="chat-title">{selectedUser?.fullName}</p>
                                <span className={`status-pill ${isOnline ? 'online' : 'offline'}`}>
                                    {isOnline ? "Online" : "Offline"}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="chat-header-placeholder">
                            <p className="chat-title">Inbox</p>
                            <span className="chat-subtitle">Pick a conversation to start</span>
                        </div>
                    )}
                </div>
                <div className="chat-header-actions">
                    <ThemeToggle compact />
                </div>
            </div>

            {selectedUser !== null ? (
                <>
                    <Messages />
                    <SendInput />
                </>
            ) : (
                <div className="chat-empty">
                    <div>
                        <p className="chat-empty-title">Welcome, {authUser?.fullName}</p>
                        <p className="chat-empty-subtitle">Select someone to start a conversation.</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MessageContainer