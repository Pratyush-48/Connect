import React, { useState } from 'react';
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from './OtherUsers';
import ThemeToggle from './ThemeToggle';
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
        <aside className={`chat-sidebar ${isMobileSidebarOpen ? 'is-open' : ''}`}>
            <div className="sidebar-content">
                <div className="sidebar-header">
                    <div>
                        <p className="sidebar-title">Conversations</p>
                        <p className="sidebar-subtitle">Search or start a new chat</p>
                    </div>
                    <ThemeToggle compact />
                </div>
                <form onSubmit={searchSubmitHandler} className="sidebar-search">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field"
                        type="text"
                        placeholder="Search people"
                    />
                    <button type="submit" className="search-btn" aria-label="Search">
                        <BiSearchAlt2 />
                    </button>
                </form>
                <p className="sidebar-section-title">People</p>
                <div className="sidebar-list">
                    <OtherUsers onUserSelect={closeMobileSidebar} />
                </div>
                <div className="sidebar-footer">
                    <button onClick={logoutHandler} className="btn-danger">
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar;