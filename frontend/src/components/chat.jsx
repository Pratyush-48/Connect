import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MessageContainer from './MessageContainer';
import './responsive.css';

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 960);
      if (window.innerWidth > 960) {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobileView) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="chat-shell">
      {isMobileView && (
        <button
          className="chat-menu-btn"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? "X" : "Menu"}
        </button>
      )}

      {isMobileView && sidebarOpen && (
        <div
          className="chat-overlay"
          onClick={closeSidebar}
        />
      )}

      <Sidebar
        isMobileSidebarOpen={sidebarOpen}
        closeMobileSidebar={closeSidebar}
      />

      <MessageContainer />
    </div>
  );
};

export default Chat;