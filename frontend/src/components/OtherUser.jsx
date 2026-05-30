import React from 'react';
import { useSelector } from "react-redux";
import getAvatarUrl from '../utils/avatar';
import './responsive.css';

const OtherUser = ({ user }) => {
    const { selectedUser, onlineUsers } = useSelector(store => store.user);
    const isOnline = Boolean(onlineUsers?.includes(user._id));
    const avatarSeed = user?.username || user?.fullName || user?._id || 'user';
    const avatarUrl = user?.profilePhoto || getAvatarUrl(avatarSeed);

    return (
        <div className={`user-row ${selectedUser?._id === user?._id ? 'is-active' : ''}`}>
            <div className="user-avatar">
                <img
                    src={avatarUrl}
                    alt="user-profile"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getAvatarUrl(avatarSeed);
                    }}
                />
                <span className={`presence-dot ${isOnline ? 'online' : 'offline'}`}></span>
            </div>
            <div className="user-meta">
                <p className="user-name">{user?.fullName}</p>
                <span className={`user-status ${isOnline ? 'online' : 'offline'}`}>
                    {isOnline ? "Online" : "Offline"}
                </span>
            </div>
        </div>
    );
};

export default OtherUser;