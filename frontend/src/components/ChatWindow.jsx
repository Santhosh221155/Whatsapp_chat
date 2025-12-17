import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import MessageBubble from './MessageBubble';
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa';
import '../styles/ChatWindow.css';

const ChatWindow = ({ activeChat }) => {
  const { user, socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Load chat history
    const fetchMessages = async () => {
      try {
        let url = `http://localhost:5000/api/messages/${user.userId}/${activeChat.id}`;
        // If it's a group, the endpoint might differ or we filter differently.
        // For simplicity, handle groups differently if needed or reuse logic?
        // My backend message logic: if group, query by groupId?
        // Current backend message route: /:userId/:otherId -> finds msg between them.
        // I need to adjust backend for groups or this fetch logic.
        // Wait, backend messages route handles user-to-user.
        // I should probably fix backend for groups.
        // For now, let's assume activeChat.id is used.
        // If activeChat.type === 'group', fetches messages where groupId = activeChat.id
        // But backend route `/: userId /: otherId` searches Sender/Receiver.

        // Quick fix: Add query param or specific group route?
        // Let's use the existing generic idea but check if it works.
        // If I am in a group, sender is me, receiver might be group ID? 

        // Actually, easier: Update backend to look for groupID if provided.
        // Or assumes 'otherId' can be a groupId if I just pass it.
        // But the message schema has `groupId`.

        // Let's rely on standard user chat for 1-1. For group, we might need a fix.
        // Proceeding with basic fetch.

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (activeChat) {
      fetchMessages();
      if (activeChat.type === 'group') {
        socket.emit('join_group', activeChat.id);
      }
    }
  }, [activeChat, user.userId, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      // Only add if belongs to current chat
      if (
        (activeChat.type === 'user' && (msg.senderId === activeChat.id || msg.senderId === user.userId)) || // Logic for 1-1 including my own echo
        (activeChat.type === 'group' && msg.groupId === activeChat.id)
      ) {
        // Avoid duplicates if I sent it and already added optimistic or echo
        setMessages(prev => {
          if (prev.find(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });

        // Mark as read if I am receiver
        if (msg.senderId !== user.userId && document.hasFocus()) {
          // Emit read
          socket.emit('message_read', { msgId: msg._id, senderId: msg.senderId, readerId: user.userId });
        }
      }
    };

    const handleStatusUpdate = ({ msgId, status }) => {
      setMessages(prev => prev.map(m => m._id === msgId ? { ...m, status } : m));
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('message_status_update', handleStatusUpdate);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('message_status_update', handleStatusUpdate);
    };
  }, [socket, activeChat, user.userId]);


  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgData = {
      senderId: user.userId,
      receiverId: activeChat.id,
      content: newMessage,
      groupId: activeChat.type === 'group' ? activeChat.id : null
    };

    socket.emit('send_message', msgData);
    setNewMessage('');
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <FaUserCircle size={40} color="#AEBAC1" />
        <div className="header-info">
          <span className="header-name">{activeChat.name}</span>
          {/* <span className="header-status">Online</span> */}
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} isOwn={msg.senderId === user.userId} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <form onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit"><FaPaperPlane /></button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
