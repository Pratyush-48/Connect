import React from 'react';
import Sidebar from './Sidebar';
import MessageContainer from './MessageContainer';

const Chat = () => {
  return (
    <div className="flex h-screen w-full bg-gray-900 text-white">
      <Sidebar />
      <MessageContainer />
    </div>
  );
};

export default Chat;