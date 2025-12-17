import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { FaUserCircle, FaSearch, FaUsers } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = ({ setActiveChat, activeChat }) => {
    const { user, socket } = useSocket();
    const [searchId, setSearchId] = useState('');
    const [conversations, setConversations] = useState([]); // List of users/groups
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [groupName, setGroupName] = useState('');

    // Mock function to load conversations - in real app, fetch from DB
    // For now, we rely on search to start.

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) return;
        try {
            const res = await fetch(`http://localhost:5000/api/users/${searchId}`);
            const data = await res.json();
            if (res.ok) {
                setActiveChat({ type: 'user', id: data.userId, name: data.name });
                setSearchId('');
            } else {
                alert('User not found');
            }
        } catch (err) {
            alert('Error searching user');
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName) return;
        const groupId = 'group_' + Date.now();
        try {
            const res = await fetch('http://localhost:5000/api/groups/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    groupId,
                    name: groupName,
                    adminId: user.userId,
                    members: [user.userId] // Add self initially
                })
            });
            const data = await res.json();
            if (res.ok) {
                setActiveChat({ type: 'group', id: data.groupId, name: data.name });
                setShowGroupModal(false);
                setGroupName('');
                // Ideally add to conversation list
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <FaUserCircle size={40} color="#AEBAC1" />
                <span className="username">{user?.name}</span>
                <div className="header-actions">
                    <button onClick={() => setShowGroupModal(!showGroupModal)} title="Create Group"><FaUsers /></button>
                </div>
            </div>

            {showGroupModal && (
                <div className="group-modal">
                    <input
                        type="text"
                        placeholder="Group Name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    <button onClick={handleCreateGroup}>Create</button>
                </div>
            )}

            <div className="search-bar">
                <div className="search-container">
                    <FaSearch color="#54656f" />
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search User ID to chat"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                    </form>
                </div>
            </div>

            <div className="chats-list">
                {/* Placeholder for recent chats */}
                <div className="chat-item-placeholder">
                    Search for a user ID to start chatting.
                </div>
                {/* If activeChat exists and not in list, maybe show it? */}
                {activeChat && (
                    <div className={`chat-item active`}>
                        <FaUserCircle size={40} color="#AEBAC1" />
                        <div className="chat-info">
                            <div className="chat-name">{activeChat.name}</div>
                            <div className="chat-preview">{activeChat.type === 'group' ? 'Group Chat' : 'Private Chat'}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
