import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const ur = 'https://connect-ezy0.onrender.com';
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: [ur, 'http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId->socketId}


io.on('connection', (socket)=>{
    const userId = socket.handshake.query.userId
    if(userId !== undefined){
        userSocketMap[userId] = socket.id;
    } 

    io.emit('getOnlineUsers',Object.keys(userSocketMap));

    socket.on('disconnect', ()=>{
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    })

})

export {app, io, server};

