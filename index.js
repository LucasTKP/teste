const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors'); // Importar o pacote cors

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Usar o middleware CORS
app.use(cors()); // Isso permite todas as origens

io.on('connection', (socket) => {
    console.log('a user connected');
    
    // Quando o servidor receber a localização
    socket.on('location', (data) => {
        console.log('received location:', data);
        
        // Enviar a localização recebida de volta para todos os clientes conectados
        io.emit('location', data); // isso envia para todos, incluindo o remetente
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.get('/', (req, res) => {
    console.log('Hello World');
    res.send('Hello World');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
