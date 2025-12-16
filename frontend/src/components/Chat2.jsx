import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const newMessage = [...messages, { from: "user", text: input }];

        setMessages(newMessage);
        console.log(messages)
        setInput("");

        try {
            const res = await axios.post("http://127.0.0.1:8000/chat", { message: input });

            setMessages([...newMessage, { from: "ai", text: res.data.response }]);
        }
        catch (err) {
            console.error(err);
            setMessages([...newMessage, { from: "ai", text: "Server error" }]);
        }
    }


    return (
        <div className="max-w-2xl mx-auto mt-10 space-y-4 min-h-screen bg-black p-4 rounded-lg flex flex-col justify-between">
            {messages.map((msg, idx) => (
                <div
                    key={idx}
                    className={`chat ${msg.from === "user" ? "chat-start" : "chat-end"}`}
                >
                    <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt={msg.from}
                                src={
                                    msg.from === "user"
                                        ? "https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                                        : "https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                                }
                            />
                        </div>
                    </div>

                    <div className="chat-bubble">{msg.text}</div>
                </div>
            ))}

            <div className="flex mt-4 justify-end">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
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