import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider, useSocket } from './context/SocketContext';
import Login from './components/Login';
import Chat from './components/Chat';

const ProtectedRoute = ({ children }) => {
    const { user } = useSocket();
    if (!user) return <Navigate to="/" replace />;
    return children;
};

function App() {
    return (
        <SocketProvider>
            <Router>
                <div className="app-container">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route
                            path="/chat"
                            element={
                                <ProtectedRoute>
                                    <Chat />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </SocketProvider>
    );
}

export default App;
