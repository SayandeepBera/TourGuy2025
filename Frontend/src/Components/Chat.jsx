import React, { useState, useContext, useEffect, useRef, use } from 'react';
import { io } from "socket.io-client";
import ChatContext from '../Context/Chat/ChatContext';
import AuthContext from '../Context/Authentication/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Maximize2, Minimize2, Smile, Paperclip, Check, CheckCheck, Image as ImageIcon } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const socket = io(import.meta.env.VITE_API_URL);

const Chat = ({ conversationId, isFloating = true, onClose }) => {
    const { saveMessage, getMessages, markAllMessagesAsRead } = useContext(ChatContext);
    const { userId } = useContext(AuthContext);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isFullScreen, setIsFullScreen] = useState(!isFloating);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);

    // Load history & mark all messages as read
    useEffect(() => {
        const loadHistory = async () => {
            if (!conversationId) {
                return;
            }

            const res = await getMessages(conversationId);
            if (res.success) {
                setMessages(res.messages);
                console.log("Messages: ", res.messages[0].sender?._id);
            }

            // Mark all messages as read
            await markAllMessagesAsRead(conversationId);
        };

        loadHistory();
    }, [conversationId, getMessages, markAllMessagesAsRead]);

    // Handle Click Outside Emoji Picker
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll to the bottom
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Join the conversation
    useEffect(() => {
        socket.emit("joinConversation", conversationId);

        // Listen for new messages
        socket.on("receiveMessage", (data) => {
            // Add the new message to the existing messages
            setMessages((prevMessages) => {
                const exists = prevMessages.find((message) => message._id === data._id);
                return exists ? prevMessages : [...prevMessages, data];
            });
        })

        return () => {
            socket.off("receiveMessage");
        }
    }, [conversationId]);

    // Send a message
    const handleSendMessage = async (e) => {
        e.preventDefault();

        // Check if message is empty
        if (!newMessage.trim() && !selectedFile) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append("conversationId", conversationId);

            // Append the message
            if (newMessage) {
                formData.append("message", newMessage);
            }

            // Append the image
            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            const res = await saveMessage(formData);

            if (res.success) {
                const savedMsg = res.newMessage;

                // Emit the message
                socket.emit("sendMessage", savedMsg);
                setMessages((prevMessages) => [...prevMessages, savedMsg]);

                setNewMessage("");
                setSelectedFile(null);
                setShowEmojiPicker(false);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Handle emoji
    const handleEmojiClick = (emojiObject) => {
        setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    }

    // Handle file attachment
    const handleAttachmentClick = () => {
        fileInputRef.current.click();
    }

    // Handle file change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Handle file upload here
            setSelectedFile(file);
        }
    }

    // Animate the container
    const containerVariants = {
        floating: { width: "380px", height: "500px", bottom: "24px", right: "24px", borderRadius: "1.5rem" },
        full: { width: "100vw", height: "88vh", bottom: "0px", right: "0px", borderRadius: "0px" }
    };

    return (
        <motion.div
            layout
            variants={containerVariants}
            animate={isFullScreen ? "full" : "floating"}
            className="fixed z-[999] bg-[#0F172A] border border-white/10 shadow-2xl flex flex-col overflow-hidden text-white font-[fangsong]"
        >
            {/* --- Chat Header --- */}
            <header className={`${isFullScreen ? "py-4 px-10" : "p-4"} border-b border-white/10 bg-white/[0.02] backdrop-blur-md flex items-center justify-between sticky top-0 z-10`}>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#00C4CC] flex items-center justify-center font-bold text-slate-900">
                            S
                        </div>
                        <div>
                            <h3 className="font-bold text-sm md:text-base">Support Assistant</h3>
                            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Online
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-1.5 hover:bg-white/10 rounded-md transition">
                        {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                    {onClose && (
                        <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-md transition text-red-400">
                            <X size={18} />
                        </button>
                    )}
                </div>
            </header>

            {/* --- Message Area --- */}
            <main className={`flex-1 overflow-y-auto ${isFullScreen ? "py-4 px-10" : "p-4"} space-y-4 custom-scrollbar`}>
                <div className="text-center py-10">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Beginning of your conversation</p>
                </div>

                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => {
                        if(!msg || !msg.sender) return null;
                        
                        const isMe = (msg.sender?._id || msg.sender) === userId;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-lg ${isMe
                                    ? 'bg-[#00C4CC] text-slate-900 rounded-tr-none font-medium'
                                    : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                                    }`}>
                                    {msg.messageType === "image" && msg.image?.url && (
                                        <img src={msg.image.url} alt="sent" className="rounded-lg mb-2 max-w-full h-auto border border-white/10" />
                                    )}
                                    <p>{msg.message}</p>
                                    <div className={`flex items-center justify-end text-[9px] mt-1 opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isMe && (
                                            msg.isRead ? <CheckCheck size={14} className="text-blue-600" /> : <Check size={14} />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                <div ref={scrollRef} />
            </main>

            <AnimatePresence>
                {showEmojiPicker && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        ref={emojiPickerRef}
                        className={`absolute bottom-20 ${isFullScreen ? "left-10" : "left-4"} z-[100] shadow-2xl border border-white/10 rounded-2xl overflow-hidden`}
                    >
                        <EmojiPicker
                            theme="dark"
                            onEmojiClick={handleEmojiClick}
                            width={isFullScreen ? 350 : 300}
                            height={isFullScreen ? 400 : 300}
                            skinTonesDisabled
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Input Area --- */}
            <footer className={`${isFullScreen ? "py-4 px-10" : "p-4"} bg-[#0F172A] border-t border-white/10`}>
                {/* FILE PREVIEW BAR */}
                {selectedFile && (
                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl mb-3 border border-white/10">
                        <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center"><ImageIcon size={18} className="text-[#00C4CC]" /></div>
                        <p className="flex-1 text-xs truncate">{selectedFile.name}</p>
                        <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-white/10 rounded-full text-red-400"><X size={16} /></button>
                    </div>
                )}

                <form
                    onSubmit={handleSendMessage}
                    className="max-w-4xl mx-auto relative flex items-center gap-2"
                >
                    <div className="flex-1 relative group flex items-center bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-1 focus-within:border-[#00C4CC]/50 transition-all">
                        <button
                            type="button"
                            className={`p-2 transition-transform active:scale-90 ${showEmojiPicker ? 'text-[#00C4CC]' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <Smile size={20} />
                        </button>

                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onFocus={() => setShowEmojiPicker(false)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-none outline-none py-3 px-1 text-sm placeholder:text-gray-500"
                        />

                        <div className="flex items-center gap-1 text-gray-400">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
                            <button
                                type="button"
                                onClick={handleAttachmentClick}
                                className={`p-2 hover:text-white transition-colors ${selectedFile ? 'text-[#00C4CC]' : ''}`}
                            >
                                <Paperclip size={20} />
                            </button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!newMessage.trim() && !selectedFile}
                        className="bg-[#00C4CC] text-slate-900 p-4 rounded-2xl shadow-[0_0_20px_rgba(0,196,204,0.3)] transition-all hover:bg-[#00e1eb]"
                    >
                        <Send size={20} />
                    </motion.button>
                </form>
            </footer>
        </motion.div>
    )
}

export default Chat
