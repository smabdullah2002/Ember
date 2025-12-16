
import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from "react-markdown";
import WellnessList from '../WellnessList/WellnessList';
import { Link } from 'react-router';
import { useEffect, useRef } from "react";
import UseStore from '../../store/UseStore';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const {setWellnessData}=UseStore();

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const newMessage = [...messages, { from: "user", text: input }];

        setMessages(newMessage);
        console.log(messages)
        setLoading(true);
        setInput("");

        try {
            const res = await axios.post("http://127.0.0.1:8000/chat", { message: input });

            const data = res.data.response;

            let text = String(data).trim();

            if (text.startsWith("```")) {
                text = text.replace(/```json|```/g, "").trim();
            }

            let parsedJson = null;


            try {
                parsedJson = JSON.parse(text);
                console.log("Parsed JSON:", parsedJson.items);
                setWellnessData(parsedJson);
            } catch {
                console.log("AI TEXT:", text);
            }


            setMessages([...newMessage, { from: "ai", text: data }]);
            setLoading(false);
        }
        catch (err) {
            console.error(err);
            setMessages([...newMessage, { from: "ai", text: "Server error" }]);
        }

    }
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);


    return (
        <div className="max-w-3xl mx-auto mt-5 space-y-4 h-[85vh] p-6 rounded-2xl flex flex-col justify-end 
    bg-linear-to-b from-gray-900 via-gray-800 to-gray-700 shadow-xl border border-gray-700">

            <div className="flex-1 overflow-y-auto space-y-5 mb-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`chat ${msg.from === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className={`chat-bubble rounded-xl max-w-105 ${msg.from === "user" ? "bg-blue-500" : "bg-gray-700"} leading-relaxed`}>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="chat chat-start">
                        <div className="chat-bubble rounded-xl bg-gray-700 animate-pulse">
                            thinking...
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} /></div>
           

            {/* Input area */}
            <div className="flex mt-auto">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Share your thoughts..."
                    className="flex-1 p-2 rounded-lg border border-gray-300"
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                    Send
                </button>
            </div>
        </div>
    );
};


export default Chat;