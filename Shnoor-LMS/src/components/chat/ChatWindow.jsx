import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, Image as ImageIcon, Video, FileText, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const ChatWindow = ({ activeChat, currentUser, onSendMessage, onBack }) => {
    const [newMessage, setNewMessage] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat?.messages]);

    const handleFileSelect = (e) => {
        if (e.target.files[0]) setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !selectedFile) return;
        setIsUploading(true);
        try {
            await onSendMessage(newMessage, selectedFile);
            setNewMessage('');
            setSelectedFile(null);
            setShowEmoji(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    if (!activeChat) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">
                <p>Select a chat to start messaging</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white h-full relative">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="md:hidden p-1 hover:bg-slate-100 rounded">
                        <X size={20}/>
                    </button>
                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold">
                        {activeChat.recipientName?.[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{activeChat.recipientName}</h3>
                        <p className="text-xs text-slate-500">Online</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                {activeChat.messages?.map((msg, idx) => {
                    const isMe = msg.senderId === currentUser?.uid;
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-brand-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'}`}>
                                {msg.attachment_url && (
                                    <div className="mb-2">
                                        {msg.attachment_type?.startsWith('image') ? (
                                            <img src={msg.attachment_url} alt="att" className="rounded-lg max-h-48" />
                                        ) : (
                                            <a href={msg.attachment_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 underline text-xs">
                                                <FileText size={14} /> Download File
                                            </a>
                                        )}
                                    </div>
                                )}
                                <p>{msg.text}</p>
                                <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-brand-100' : 'text-slate-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 bg-white">
                {selectedFile && (
                    <div className="flex items-center justify-between p-2 bg-slate-100 rounded-lg mb-2 text-sm">
                        <span className="flex items-center gap-2 truncate">
                            <FileText size={16} /> {selectedFile.name}
                        </span>
                        <button onClick={() => setSelectedFile(null)}><X size={16}/></button>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
                    <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                        <Smile size={20} />
                    </button>
                    {showEmoji && (
                        <div className="absolute bottom-12 left-0 z-50 shadow-xl rounded-xl overflow-hidden">
                            <EmojiPicker onEmojiClick={(e) => setNewMessage(prev => prev + e.emoji)} width={300} height={400} />
                        </div>
                    )}
                    
                    <button type="button" onClick={() => fileInputRef.current.click()} className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                        <Paperclip size={20} />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />

                    <input 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                    
                    <button 
                        type="submit" 
                        disabled={isUploading || (!newMessage && !selectedFile)}
                        className="p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors disabled:opacity-50 shadow-md"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;