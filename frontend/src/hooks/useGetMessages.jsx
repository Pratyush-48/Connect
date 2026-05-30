import React, { useEffect } from 'react'
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';
import { decryptMessage } from '../utils/messageCrypto';

const useGetMessages = () => {
    const { selectedUser } = useSelector(store => store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                axios.defaults.withCredentials = true;

                // ========================================
                // STEP 1: FETCH encrypted messages from backend
                // ========================================
                const res = await axios.get(
                    `${BASE_URL}/api/v1/message/${selectedUser?._id}`
                );

                // ========================================
                // STEP 2: DECRYPT each message at receiver side
                // ========================================
                const decryptedMessages = await Promise.all(
                    res.data.map(async (msg) => {
                        const decrypted = await decryptMessage(msg.message);
                        return { ...msg, message: decrypted };
                    })
                );

                // ========================================
                // STEP 3: UPDATE Redux state with decrypted messages
                // ========================================
                dispatch(setMessages(decryptedMessages));
            } catch (error) {
                console.log("Error fetching messages:", error);
            }
        }

        if (selectedUser?._id) {
            fetchMessages();
        }
    }, [selectedUser?._id, setMessages, dispatch]);
}

export default useGetMessages