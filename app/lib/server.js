const { createServer } = require('http');
const { Server } = require('socket.io');

let httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: [process.env.AUTH_URL],
        methods: ["GET", "POST"],
    }
})

io.on('connection', (socket) => {
    console.log('connect');
    socket.on('query-completed', data => {
        socket.broadcast.emit('query-completed', data);
        console.log('emited query-completed');
    });
    socket.on('load-completed', data => {
        socket.broadcast.emit('load-completed', data);
        console.log('emited load-completed');
    })
});


httpServer.listen(Number(process.env.WS_PORT));

console.log(`listening port ${process.env.WS_PORT}...`);