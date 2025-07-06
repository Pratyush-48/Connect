import React from 'react'
import SendInput from './SendInput'
import Messages from './Messages';
import { useSelector } from "react-redux";

const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
    const isOnline = onlineUsers?.includes(selectedUser?._id);
   
    return (
        <div className='flex-1 bg-gray-700 flex flex-col'>
            {selectedUser !== null ? (
                <>
                    <div className='flex gap-2 items-center bg-gray-800 text-white px-4 py-3 border-b border-gray-600'>
                        <div className={`avatar ${isOnline ? 'online' : ''}`}>
                            <div className='w-10 rounded-full'>
                                <img src={selectedUser?.profilePhoto} alt="user-profile" />
                            </div>
                        </div>
                        <div className='flex-1'>
                            <p className='font-semibold'>{selectedUser?.fullName}</p>
                            <p className='text-xs text-gray-300'>
                                {isOnline ? 'Online' : 'Offline'}
                            </p>
                        </div>
                    </div>
                    <Messages />
                    <SendInput />
                </>
            ) : (
                <div className='flex-1 flex flex-col items-center justify-center text-white'>
                    <h1 className='text-4xl font-bold mb-4'>Hi, {authUser?.fullName}</h1>
                    <p className='text-xl text-gray-300'>Select a chat to start messaging</p>
                </div>
            )}
        </div>
    )
}

export default MessageContainer