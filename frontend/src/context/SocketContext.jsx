import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // In production, this should be the deployed backend URL
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    const loginUser = (userData) => {
        setUser(userData);
        if (socket) {
            socket.emit('join', userData.userId);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, user, loginUser }}>
            {children}
        </SocketContext.Provider>
    );
};
