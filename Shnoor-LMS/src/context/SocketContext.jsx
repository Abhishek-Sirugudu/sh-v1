import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { auth } from '../auth/firebase';
import { API_BASE_URL } from '../config/api';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        // Attempt connection to backend
        try {
            const newSocket = io(API_BASE_URL || 'http://localhost:5000', {
                query: { firebase_uid: user.uid },
                transports: ['websocket'],
                reconnectionAttempts: 3
            });

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                setIsConnected(true);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
            });

            newSocket.on('unread_counts', (counts) => {
                setUnreadCounts(counts);
            });

            setSocket(newSocket);

            return () => newSocket.close();
        } catch (e) {
            console.warn("Socket connection failed (Backend might be offline). Using mock mode.", e);
        }
    }, []);

    const markChatRead = (chatId) => {
        setUnreadCounts(prev => {
            const newCounts = { ...prev };
            delete newCounts[chatId];
            return newCounts;
        });
        if (socket && isConnected) {
            socket.emit('mark_read', { chat_id: chatId });
        }
    };

    const value = {
        socket,
        unreadCounts,
        isConnected,
        markChatRead
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};