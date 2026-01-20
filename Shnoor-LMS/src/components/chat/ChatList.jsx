import React from 'react';
import { Search, MessageSquare, Users } from 'lucide-react';

const ChatList = ({ chats, activeChat, onSelectChat, currentUser }) => {
    return (
        <div className="w-full md:w-80 flex flex-col border-r border-slate-200 bg-white h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-3">Messages</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search conversations..." 
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400 p-6 text-center">
                        <MessageSquare size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">No messages yet.</p>
                    </div>
                ) : (
                    chats.map((chat) => {
                        const isActive = activeChat?.id === chat.id;
                        const isUnread = chat.unreadCount > 0;
                        
                        // Fallback avatar logic
                        const initial = chat.recipientName ? chat.recipientName.charAt(0).toUpperCase() : '?';
                        const isGroup = chat.isGroup;

                        return (
                            <div
                                key={chat.id}
                                onClick={() => onSelectChat(chat)}
                                className={`
                                    flex items-center gap-3 p-4 cursor-pointer transition-all border-l-4
                                    ${isActive 
                                        ? 'bg-brand-50 border-brand-600' 
                                        : 'bg-white border-transparent hover:bg-slate-50'}
                                `}
                            >
                                <div className="relative shrink-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${isGroup ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                                        {isGroup ? <Users size={16} /> : initial}
                                    </div>
                                    {isUnread && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white ring-1 ring-red-500"></div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className={`text-sm truncate ${isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                            {chat.recipientName}
                                        </h3>
                                        {chat.updatedAt && (
                                            <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                                                {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs truncate ${isUnread ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                                        {chat.lastMessage || 'Start a conversation'}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ChatList;