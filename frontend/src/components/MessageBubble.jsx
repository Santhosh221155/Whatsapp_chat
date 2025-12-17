import React from 'react';
import { BsCheck, BsCheckAll } from 'react-icons/bs';
import '../styles/MessageBubble.css';

const MessageBubble = ({ message, isOwn }) => {
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusIcon = () => {
        if (message.status === 'read') return <BsCheckAll className="status-icon blue" />;
        if (message.status === 'delivered') return <BsCheckAll className="status-icon" />;
        return <BsCheck className="status-icon" />;
    };

    return (
        <div className={`message-bubble ${isOwn ? 'own' : ''}`}>
            <div className="message-content">
                <p>{message.content}</p>
                <span className="message-meta">
                    {formatTime(message.createdAt)}
                    {isOwn && getStatusIcon()}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;
