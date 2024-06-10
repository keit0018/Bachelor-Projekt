import React, { useState } from 'react';
import '../assets/styles/Chat.css';

const Chat = ({ meetingId,isVisible, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
        setMessages([...messages, message]);
        setMessage('');
        }
    };

    return (
        isVisible && (
            <div className="chat-container">
                <div className="messages">
                    {messages.map((msg, index) => (
                    <div key={index} className="message">
                        {msg}
                    </div>
                    ))}
                </div>
                <form onSubmit={handleSendMessage} className="chat-form">
                    <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        )
    );
};

export default Chat;