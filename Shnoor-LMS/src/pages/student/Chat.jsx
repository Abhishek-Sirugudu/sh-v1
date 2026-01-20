import React, { useState, useEffect } from 'react';
import ChatList from '../../components/chat/ChatList';
import ChatWindow from '../../components/chat/ChatWindow';
import { auth } from '../../auth/firebase';
import { useSocket } from '../../context/SocketContext';

const StudentChat = () => {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const currentUser = auth.currentUser;
    // Safely access socket context or default to empty object
    const { socket, unreadCounts, markChatRead } = useSocket() || {};

    useEffect(() => {
        // Mock Data for Student View (Chatting with Instructors)
        const mockChats = [
            { 
                id: '1', 
                recipientName: 'Prof. John Smith', 
                lastMessage: 'Your assignment looks great!', 
                unreadCount: 1, 
                updatedAt: new Date().toISOString(),
                participants: ['student_001', 'inst_001'],
                messages: [
                    { id: 1, senderId: 'inst_001', text: 'Hello! How can I help you?', timestamp: new Date(Date.now() - 10000000).toISOString() },
                    { id: 2, senderId: 'student_001', text: 'I have a question about the React module.', timestamp: new Date(Date.now() - 5000000).toISOString() },
                    { id: 3, senderId: 'inst_001', text: 'Your assignment looks great! What specifically?', timestamp: new Date().toISOString() }
                ]
            },
            { 
                id: '2', 
                recipientName: 'Sarah Tech Support', 
                lastMessage: 'Ticket #492 resolved.', 
                unreadCount: 0, 
                updatedAt: new Date(Date.now() - 86400000).toISOString(),
                participants: ['student_001', 'support_01'],
                messages: []
            }
        ];
        setChats(mockChats);
    }, []);

    const handleSendMessage = (text, file) => {
        if (!activeChat) return;

        const newMsg = {
            id: Date.now(),
            text: text,
            senderId: currentUser?.uid || 'student_001',
            timestamp: new Date().toISOString(),
            attachment_name: file?.name
        };

        // Optimistic UI Update
        const updatedActiveChat = {
            ...activeChat,
            messages: [...(activeChat.messages || []), newMsg]
        };

        setActiveChat(updatedActiveChat);
        
        // Update the chat in the list as well (to show last message)
        setChats(prev => prev.map(c => c.id === activeChat.id ? { ...updatedActiveChat, lastMessage: text || 'Sent a file' } : c));

        // If socket exists, emit event (Real implementation)
        if (socket) {
            socket.emit('send_message', {
                chat_id: activeChat.id,
                text,
                sender_uid: currentUser?.uid
            });
        }
    };

    const handleSelectChat = (chat) => {
        setActiveChat(chat);
        // Clear unread count locally for UI
        const updatedChats = chats.map(c => c.id === chat.id ? { ...c, unreadCount: 0 } : c);
        setChats(updatedChats);
        
        if (markChatRead) markChatRead(chat.id);
    };

    return (
        <div className="h-[calc(100vh-100px)] flex bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {/* Left Sidebar (Hidden on mobile if chat is open) */}
            <div className={`w-full md:w-80 border-r border-slate-200 bg-white ${activeChat ? 'hidden md:flex' : 'flex'} flex-col`}>
                <ChatList 
                    chats={chats} 
                    activeChat={activeChat} 
                    onSelectChat={handleSelectChat} 
                    currentUser={currentUser} 
                />
            </div>

            {/* Chat Window (Hidden on mobile if no chat selected) */}
            <div className={`flex-1 flex flex-col bg-slate-50 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
                <ChatWindow 
                    activeChat={activeChat} 
                    currentUser={currentUser || { uid: 'student_001' }} 
                    onSendMessage={handleSendMessage}
                    onBack={() => setActiveChat(null)}
                />
            </div>
        </div>
    );
};

export default StudentChat;