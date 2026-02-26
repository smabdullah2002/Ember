import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from "react-markdown";
import { useEffect, useRef } from "react";
import UseStore from '../../store/UseStore';
import { Send, Sparkles, PlusSquare } from 'lucide-react';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState("");
    const [startingNewChat, setStartingNewChat] = useState(false);
    const { setWellnessmsg } = UseStore();

    const CHAT_STORAGE_KEY = "chatMessages";

    const extractChecklistJson = (text) => {
        let cleaned = String(text || "").trim();

        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/```json|```/g, "").trim();
        }

        try {
            const parsed = JSON.parse(cleaned);
            if (parsed?.items && Array.isArray(parsed.items)) {
                return parsed;
            }
        } catch {
            return null;
        }

        return null;
    };

    const loadHistory = async () => {
        setHistoryLoading(true);
        setHistoryError("");

        const cached = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || "[]");
        if (cached?.length) {
            setMessages(cached);
        }

        try {
            const { data } = await supabase.auth.getSession();
            const token = data?.session?.access_token;
            if (!token) {
                setHistoryLoading(false);
                return;
            }

            const response = await axios.get("http://127.0.0.1:8000/chat/history", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const historyMessages = response?.data?.messages || [];
            setMessages(historyMessages);
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(historyMessages));
        } catch (error) {
            console.error("Failed to load chat history:", error.response?.data || error.message);
            if (!cached?.length) {
                setHistoryError("Could not load previous chat history.");
            }
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleNewChat = async () => {
        setStartingNewChat(true);
        setHistoryError("");

        try {
            const { data } = await supabase.auth.getSession();
            const token = data?.session?.access_token;

            if (token) {
                await axios.delete("http://127.0.0.1:8000/chat/history", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            setMessages([]);
            localStorage.removeItem(CHAT_STORAGE_KEY);
        } catch (error) {
            console.error("Failed to start new chat:", error.response?.data || error.message);
            setHistoryError("Could not clear chat history. Please try again.");
        } finally {
            setStartingNewChat(false);
        }
    };

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const newMessage = [...messages, { from: "user", text: input }];

        setMessages(newMessage);
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newMessage));
        console.log(messages)
        setLoading(true);
        setInput("");

        try {
            const { data } = await supabase.auth.getSession();
            const token = data.session.access_token;
            const res = await axios.post("http://127.0.0.1:8000/chat", { message: input },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            console.log("-----------------",res);
            const msg = res.data.response;

            let text = String(msg).trim();

            if (text.startsWith("```")) {
                text = text.replace(/```json|```/g, "").trim();
            }

            let parsedJson = null;

            parsedJson = extractChecklistJson(text);
            if (parsedJson) {
                console.log("Parsed JSON:", parsedJson.items);
                if (setWellnessmsg) {
                    setWellnessmsg(parsedJson);
                }
            } else {
                console.log("AI TEXT:", text);
            }

            const updatedMessages = [...newMessage, { from: "ai", text: msg }];
            setMessages(updatedMessages);
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedMessages));
            setLoading(false);
        }
        catch (err) {
            console.error(err);
            const updatedMessages = [...newMessage, { from: "ai", text: "Server error" }];
            setMessages(updatedMessages);
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedMessages));
            setLoading(false);
        }
    }

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <div className='min-h-screen p-6'>
            {/* Header */}
            <div className='flex items-center justify-center mx-auto max-w-4xl'>
                <div className='backdrop-blur-sm bg-white/60 rounded-3xl px-8 py-4 mb-6 shadow-lg border border-purple-200/50'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center'>
                            <Sparkles className='w-5 h-5 text-white' />
                        </div>
                        <h1 className='text-3xl font-light text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600'>
                            Ember Chatbot
                        </h1>
                        <button
                            onClick={handleNewChat}
                            disabled={startingNewChat || loading}
                            className='ml-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 text-purple-700 border border-purple-200 hover:bg-white transition disabled:opacity-50'
                        >
                            <PlusSquare className='w-4 h-4' />
                            {startingNewChat ? 'Starting...' : 'New Chat'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Chat Container */}
            <div className="max-w-4xl mx-auto">
                <div className="backdrop-blur-md bg-white/70 rounded-3xl shadow-2xl border border-purple-200/50 h-[calc(100vh-180px)] flex flex-col overflow-hidden">

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {historyError && (
                            <div className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3'>
                                {historyError}
                            </div>
                        )}

                        {historyLoading && messages.length === 0 && (
                            <div className='text-center text-sm text-gray-500'>Loading chat history...</div>
                        )}

                        {messages.length === 0 && (
                            <div className='flex flex-col items-center justify-center h-full text-center space-y-4'>
                                <div className='w-20 h-20 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center animate-pulse'>
                                    <Sparkles className='w-10 h-10 text-white' />
                                </div>
                                <div>
                                    <h2 className='text-2xl font-light text-gray-700 mb-2'>Welcome to Ember</h2>
                                    <p className='text-gray-500'>Share your thoughts and let's begin our conversation</p>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                            >
                                <div className={`max-w-[75%] ${msg.from === "user" ? "order-2" : "order-1"}`}>
                                    {msg.from === "ai" && (
                                        <div className='flex items-center gap-2 mb-2'>
                                            <div className='w-7 h-7 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center'>
                                                <Sparkles className='w-4 h-4 text-white' />
                                            </div>
                                            <span className='text-xs text-gray-500 font-medium'>Ember</span>
                                        </div>
                                    )}

                                    <div className={`rounded-2xl px-5 py-3 shadow-md ${msg.from === "user"
                                        ? "bg-linear-to-br from-blue-500 to-blue-600 text-white"
                                        : "bg-white/80 backdrop-blur-sm text-gray-800 border border-purple-100"
                                        }`}>
                                        <div className='prose prose-sm max-w-none'>
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                    ul: ({ ...props }) => <ul className="mb-2 last:mb-0" {...props} />,
                                                    ol: ({ ...props }) => <ol className="mb-2 last:mb-0" {...props} />,
                                                    code: ({ inline, ...props }) =>
                                                        inline
                                                            ? <code className="bg-purple-100 px-1 rounded text-sm" {...props} />
                                                            : <code className="block bg-purple-100 p-2 rounded text-sm" {...props} />
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>

                                    {msg.from === "user" && (
                                        <div className='flex items-center gap-2 mt-2 justify-end'>
                                            <span className='text-xs text-gray-500'>You</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="max-w-[75%]">
                                    <div className='flex items-center gap-2 mb-2'>
                                        <div className='w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center'>
                                            <Sparkles className='w-4 h-4 text-white' />
                                        </div>
                                        <span className='text-xs text-gray-500 font-medium'>Ember</span>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-md border border-purple-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-t border-purple-100/50">
                        <div className="flex items-center gap-3 bg-white rounded-2xl shadow-lg border border-purple-200/50 p-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Share your thoughts..."
                                className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || input.trim() === ""}
                                className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Chat;