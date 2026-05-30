import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { decryptMessage } from "../utils/messageCrypto";

const useGetRealTimeMessage = () => {
    const { socket } = useSelector(store => store.socket);
    const { messages } = useSelector(store => store.message);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket) return;

        // ========================================
        // LISTEN for real-time messages via Socket.IO
        // ========================================
        socket?.on("newMessage", async (newMessage) => {
            // ========================================
            // DECRYPT the real-time message at receiver side
            // ========================================
            const decrypted = await decryptMessage(newMessage.message);
            const decryptedMessage = { ...newMessage, message: decrypted };

            // ========================================
            // ADD decrypted message to Redux state
            // ========================================
            dispatch(setMessages([...messages, decryptedMessage]));
        });

        // Cleanup: Remove listener when component unmounts
        return () => socket?.off("newMessage");
    }, [socket, messages, dispatch]);
};

export default useGetRealTimeMessage;