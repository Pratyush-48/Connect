import React, { useState } from 'react';
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from './OtherUsers';
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const Sidebar = ({ isMobileSidebarOpen, closeMobileSidebar }) => {
    const [search, setSearch] = useState("");
    const { otherUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/user/logout`);
            navigate("/");
            toast.success(res.data.message);
            dispatch(setAuthUser(null));
            dispatch(setMessages(null));
            dispatch(setOtherUsers(null));
            dispatch(setSelectedUser(null));
        } catch (error) {
            console.log(error);
        }
    }

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        const conversationUser = otherUsers?.find((user) => user.fullName.toLowerCase().includes(search.toLowerCase()));
        if (conversationUser) {
            dispatch(setOtherUsers([conversationUser]));
            dispatch(setSelectedUser(conversationUser));
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
                navigate('/chat'); // Ensure this matches your chat route
            }
        } else {
            toast.error("User not found!");
        }
    }

    return (
        <div className={`sidebar-container ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
            <div className='sidebar-content'>
                <form onSubmit={searchSubmitHandler} className='flex items-center gap-2 mb-4'>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='flex-1 bg-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
                        type="text"
                        placeholder='Search...'
                    />
                    <button type='submit' className='bg-purple-600 hover:bg-purple-700 rounded-md p-2'>
                        <BiSearchAlt2 className='w-5 h-5' />
                    </button>
                </form>
                <div className="border-t border-gray-600 my-2"></div>
                <div className='flex-1 overflow-y-auto'>
                    <OtherUsers onUserSelect={closeMobileSidebar} />
                </div>
                <button 
                    onClick={logoutHandler} 
                    className='mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md'
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Sidebar;