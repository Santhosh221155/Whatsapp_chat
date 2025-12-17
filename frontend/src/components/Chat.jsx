import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import '../styles/Chat.css';

const Chat = () => {
    const [activeChat, setActiveChat] = useState(null); // { type: 'user'|'group', id: '', name: '' }

    return (
        <div className="chat-layout">
            <Sidebar setActiveChat={setActiveChat} activeChat={activeChat} />
            {activeChat ? (
                <ChatWindow activeChat={activeChat} />
            ) : (
                <div className="welcome-screen">
                    <h1>Welcome to WhatsApp Clone</h1>
                    <p>Select a chat to start messaging</p>
                </div>
            )}
        </div>
    );
};

export default Chat;
