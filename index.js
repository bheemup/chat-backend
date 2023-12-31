
const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/',(req,res)=>{
  res.json({message:'server is woring fine jani',status:201})
})

const server = app.listen( process.env.PORT || 8000, () => {
  console.log('Server is running on port 8000');
});

  const users={};

const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

io.on('connection', (socket) => {

  socket.on(`new-user-joined`,name=>{
            users[socket.id]=name;
            socket.broadcast.emit("user-joined",{name:name,data:users});
        })

  socket.on('setdata',()=>{
      socket.broadcast.emit('setdata',users)
  })      
  socket.on('send',message=>{
           socket.broadcast.emit('receive',
          {message:message,user:users[socket.id]})
        })
        
        socket.on('disconnect', (message) => {
          socket.broadcast.emit('left',users[socket.id])
          delete users[socket.id];
  });
});
