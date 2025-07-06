import React from 'react';
import OtherUser from './OtherUser';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';
import { useNavigate } from "react-router-dom";
import './responsive.css';

const OtherUsers = ({ onUserSelect }) => {
    // Custom hook to fetch other users
    useGetOtherUsers();
    const { otherUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleUserClick = (user) => {
        dispatch(setSelectedUser(user));
        // Close sidebar and redirect on mobile
        if (window.innerWidth <= 768) {
            onUserSelect?.(); // Call the parent's close function if provided
            navigate('/chat'); // Adjust this to your actual chat route if different
        }
    };

    if (!otherUsers) return null; // early return

    return (
        <div className='overflow-auto flex-1'>
            {otherUsers?.map((user) => (
                <div 
                    key={user._id} 
                    onClick={() => handleUserClick(user)}
                    className="cursor-pointer"
                >
                    <OtherUser user={user} />
                </div>
            ))}
        </div>
    )
}

export default OtherUsers;