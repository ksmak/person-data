const { createServer } = require('http');
const { Server } = require('socket.io');

let httpServer = createServer()
const io = new Server(httpServer, {
    // cors: {
    //     origin: [process.env.NEXTJS_URL, process.env.WORKER_URL],
    //     methods: ["GET", "POST"],
    // }
})

io.on('connection', (socket) => {
    socket.on('query-completed', data => {
        socket.broadcast.emit('query-completed', data);
    });
    socket.on('load-completed', data => {
        socket.broadcast.emit('load-completed', data);
    })
});

console.log(`listening port ${process.env.WS_PORT}...`);
httpServer.listen(Number(process.env.WS_PORT));