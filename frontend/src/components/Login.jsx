import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import '../styles/Login.css';

const Login = () => {
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const { loginUser } = useSocket();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!userId || !name) return;

        try {
            const res = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, name })
            });
            const data = await res.json();
            if (res.ok) {
                loginUser(data);
                navigate('/chat');
            } else {
                alert('Login failed: ' + data.error);
            }
        } catch (err) {
            console.error(err);
            alert('Login failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Enter WhatsApp</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Unique User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Display Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <button type="submit">Start Chatting</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
