import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';
import { useNavigate } from "react-router-dom";
import './responsive.css';

const OtherUser = ({ user, onUserSelect }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedUser, onlineUsers } = useSelector(store => store.user);
    const isOnline = onlineUsers?.includes(user._id);

    const selectedUserHandler = (user) => {
        dispatch(setSelectedUser(user));
        // Close sidebar and redirect on mobile
        if (window.innerWidth <= 768) {
            onUserSelect?.(); // Call the parent's close function if provided
            navigate('/chat'); // Adjust to your actual chat route if different
        }
    };

    return (
        <>
            <div 
                onClick={() => selectedUserHandler(user)} 
                className={`${selectedUser?._id === user?._id ? 'bg-zinc-200 text-black' : 'text-white'} flex gap-2 hover:text-black items-center hover:bg-zinc-200 rounded p-2 cursor-pointer transition-colors duration-200`}
            >
                <div className={`avatar ${isOnline ? 'online' : ''}`}>
                    <div className='w-12 rounded-full'>
                        <img 
                            src={user?.profilePhoto} 
                            alt="user-profile" 
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-between gap-2'>
                        <p className="font-medium">{user?.fullName}</p>
                        {isOnline && (
                            <span className="text-xs text-green-500">Online</span>
                        )}
                    </div>
                </div>
            </div>
            <div className='divider my-0 py-0 h-1'></div>
        </>
    );
};

export default OtherUser;