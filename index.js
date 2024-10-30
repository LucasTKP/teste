const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    
    socket.on('location', (data) => {
        io.emit('location', data);
    });

});

app.get('/', (req, res) => {
    res.send('Hello World');
});

server.listen(PORT , () => {
    console.log('listening on *:3000');
});
