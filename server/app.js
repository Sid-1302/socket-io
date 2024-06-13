import express from "express";
import { Server } from "socket.io";
import {createServer} from 'http';
import cors from 'cors'
import { SocketAddress } from "net";

const port=3000

const app=express()
app.use(cors())
const server=createServer(app);

const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:['GET','POST'],
        credentials:true,
    }
});

io.use((socket,next))

io.on('connection',(socket)=>{
    console.log('User Connected');
    console.log('id',socket.id);

    // socket.emit('welcome',`Welcome to the server ${socket.id}`);  // respectively for each user  
    // socket.broadcast.emit('welcome',`Welcome to the server ${socket.id}`);  // broadcast except to itself  
    // socket.emit('welcome','Welcome to the server')                 // Will use these in front end rather.
    // socket.broadcast.emit('welcome',`${socket.id} joined the server.`);  
    
    socket.on('disconnect',()=>{
        console.log("User disconnect");  
    })

    socket.on('message',({message,room})=>{
        // console.log(message);
        console.log(message,room);
        io.to(room).emit('receive-message',message);
        // socket.broadcast.emit("receive-message",message);
        // io.emit('receive-message',message,socket.id);
    })

    socket.on('join-room',(roomno)=>{
        socket.join(roomno);
    
        console.log(`User joined room ${roomno}`);
    })


})
 
server.listen(port,()=>{
    console.log(`Port started at ${port}`);
});

app.get('/',(req,res)=>{
    res.send('Hello World');
})