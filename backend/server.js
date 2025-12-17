const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const User = require('./models/User');
const Message = require('./models/Message');
const Group = require('./models/Group');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/user'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/groups', require('./routes/groups'));

// Database Connection
const MONGO_URI = process.env.MONGO_URI ;

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', async (userId) => {
        socket.join(userId);
        await User.findOneAndUpdate({ userId }, { socketId: socket.id, online: true });
        io.emit('user_status', { userId, online: true });
    });

    socket.on('send_message', async (data) => {
        // data: { senderId, receiverId, content, groupId }
        const { senderId, receiverId, content, groupId } = data;

        // Save to DB
        const newMessage = await Message.create({
            senderId,
            receiverId, // For group, receiverId is groupId
            content,
            groupId,
            status: groupId ? 'sent' : 'sent' // logic for group read receipt is complex, simplified here
        });

        if (groupId) {
            // Broadcast to group room (need to join users to group room or iterate members)
            // Ideally clients join group rooms. Let's assume they do.
            io.to(groupId).emit('receive_message', newMessage);
        } else {
            // 1-on-1
            io.to(receiverId).emit('receive_message', newMessage);
            io.to(senderId).emit('receive_message', newMessage); // Echo back to sender for optimistic UI update confirmation
        }
    });

    socket.on('join_group', (groupId) => {
        socket.join(groupId);
    });

    socket.on('message_read', async ({ msgId, senderId, readerId }) => {
        await Message.findByIdAndUpdate(msgId, { status: 'read' });
        io.to(senderId).emit('message_status_update', { msgId, status: 'read' });
    });

    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);
        const user = await User.findOneAndUpdate({ socketId: socket.id }, { online: false, lastSeen: new Date() });
        if (user) io.emit('user_status', { userId: user.userId, online: false });
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
