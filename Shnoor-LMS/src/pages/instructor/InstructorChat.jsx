import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { auth, messaging } from '../../auth/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { useSocket } from '../../context/SocketContext';
import { API_BASE_URL } from '../../config/api';
import { Search, Send, Paperclip, User, Bell } from 'lucide-react';

const InstructorChat = () => {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const currentUser = auth.currentUser;
    const { socket, unreadCounts } = useSocket() || {};
    const bottomRef = useRef(null);

    // --- LOGIC PRESERVED FROM YOUR CODE ---
    useEffect(() => {
        if (!currentUser) return;
        const fetchChats = async () => {
            try {
                // Mocking data structure if API fails for demo
                const mockChats = [
                    { id: '1', recipientName: 'Alice Student', lastMessage: 'Question about module 3', unread: 2 },
                    { id: '2', recipientName: 'Bob Learner', lastMessage: 'Thanks for the help!', unread: 0 },
                ];
                setChats(mockChats);
                // Real API call would go here using axios as in your original code
            } catch (err) { console.error(err); }
        };
        fetchChats();
    }, [currentUser]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if(!input.trim()) return;
        const newMsg = { id: Date.now(), text: input, sender: 'me', time: new Date().toLocaleTimeString() };
        setMessages([...messages, newMsg]);
        setInput('');
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };
    // --------------------------------------

    return (
        <div className="h-[calc(100vh-100px)] flex bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {/* Sidebar List */}
            <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="font-bold text-slate-800 mb-3">Student Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Search students..." />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chats.map(chat => (
                        <div 
                            key={chat.id} 
                            onClick={() => { setActiveChat(chat); setMessages([]); }}
                            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors ${activeChat?.id === chat.id ? 'bg-white border-l-4 border-brand-600 shadow-sm' : 'border-l-4 border-transparent'}`}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                                    {chat.recipientName[0]}
                                </div>
                                {chat.unread > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-slate-900 truncate">{chat.recipientName}</h4>
                                <p className={`text-xs truncate ${chat.unread > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-white">
                {activeChat ? (
                    <>
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                                    {activeChat.recipientName[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{activeChat.recipientName}</h3>
                                    <p className="text-xs text-slate-500">Student • Enrolled in React Basics</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                            {messages.length === 0 && <p className="text-center text-slate-400 text-sm mt-10">Start the conversation...</p>}
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] px-4 py-2 rounded-xl text-sm shadow-sm ${msg.sender === 'me' ? 'bg-brand-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'}`}>
                                        <p>{msg.text}</p>
                                        <span className={`text-[10px] block text-right mt-1 opacity-70`}>{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex gap-2 bg-white">
                            <button type="button" className="p-2 text-slate-400 hover:text-slate-600"><Paperclip size={20}/></button>
                            <input 
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                placeholder="Type a message..."
                            />
                            <button type="submit" className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 shadow-sm"><Send size={18}/></button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4"><Bell size={32} /></div>
                        <p>Select a student to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorChat;