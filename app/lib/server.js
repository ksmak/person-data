const { createServer } = require('http');
const { Server } = require('socket.io');

let httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: process.env.AUTH_URL
    }
})

io.on('connection', (socket) => {
    socket.on('query-completed', data => {
        socket.broadcast.emit('query-completed', data);
    });
    socket.on('load-completed', data => {
        socket.broadcast.emit('load-completed', data);
    })
});

httpServer.listen(Number(process.env.PORT));
console.log(`listening port process.env.PORT...`);