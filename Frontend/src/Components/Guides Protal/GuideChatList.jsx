import React, { useEffect, useState, useContext } from 'react';
import { ArrowLeft, MessageSquare, User, Search } from 'lucide-react';
import ChatContext from '../../Context/Chat/ChatContext';
import AuthContext from '../../Context/Authentication/AuthContext';
import Chat from '../Chat';

const GuideChatList = ({ onBack }) => {
    const { getMyConversations } = useContext(ChatContext);
    const { userId } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchChats = async () => {
            const res = await getMyConversations();
            if (res.success) setConversations(res.conversations);
            setLoading(false);
        };
        fetchChats();
    }, [getMyConversations]);

    // Filter conversations based on search
    const filteredConversations = conversations.filter(chat => {
        const otherParticipant = chat.participants.find(p => p._id !== userId);
        return otherParticipant?.username.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="flex h-[75vh] bg-[#1E293B] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl mt-2 font-[fangsong]">
            {/* Sidebar */}
            <div className={`w-full md:w-1/3 border-r border-gray-700 flex flex-col bg-slate-900/50 ${selectedId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center gap-4 mb-4 md:mb-6">
                        <button onClick={onBack} className="p-2 text-[#00C4CC] hover:bg-[#00C4CC]/10 rounded-full transition">
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="text-lg md:text-xl text-[#00C4CC] font-bold italic">Messages</h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            placeholder="Search tourists..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800 text-white border border-gray-700 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-[#00C4CC]"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-10 text-center text-gray-500 animate-pulse">Loading conversations...</div>
                    ) : filteredConversations.length > 0 ? (
                        filteredConversations.map((chat) => {
                            const tourist = chat.participants.find(p => p._id !== userId);
                            return (
                                <div
                                    key={chat._id}
                                    onClick={() => setSelectedId(chat._id)}
                                    className={`p-4 cursor-pointer border-b border-gray-800/50 transition-all flex items-center gap-4 hover:bg-[#00C4CC]/5 ${selectedId === chat._id ? 'bg-[#00C4CC]/10 border-r-4 border-r-[#00C4CC]' : ''}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-[#00C4CC] border border-white/5 overflow-hidden">
                                        {tourist?.avatar?.url ? <img src={tourist.avatar.url} alt="avatar" className="w-full h-full object-cover" /> : <User size={24} />}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-bold text-white text-sm truncate">{tourist?.username || "Guest"}</h4>
                                            <span className="text-[10px] text-gray-500">{new Date(chat.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 truncate">{chat.lastMessage || "No messages yet"}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-10 text-center text-gray-500 flex flex-col items-center gap-2">
                            <MessageSquare size={40} className="opacity-20 text-[#00C4CC]" />
                            <p>No messages found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 bg-[#0F172A] relative ${!selectedId ? 'hidden md:flex' : 'flex'}`}>
                {selectedId ? (
                    <div className="w-full h-full flex flex-col">
                        <div className="md:hidden p-4 border-b border-gray-800 flex items-center bg-slate-900">
                            <button onClick={() => setSelectedId(null)} className="text-[#00C4CC] flex items-center gap-2 text-sm">
                                <ArrowLeft size={18} /> Back
                            </button>
                        </div>
                        <Chat key={selectedId} conversationId={selectedId} isFloating={false} onClose={() => setSelectedId(null)} />
                    </div>
                ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-gray-500">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare size={32} className="text-[#00C4CC]" />
                        </div>
                        <p className="text-lg font-medium text-white italic">Your Inbox</p>
                        <p className="text-sm">Select a tourist to start communicating.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuideChatList;