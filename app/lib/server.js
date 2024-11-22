const { createServer } = require('http');
const { Server } = require('socket.io');

let httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on('connection', (socket) => {
    socket.on('query-completed', data => {
        // console.log(data);
        socket.broadcast.emit('query-completed', data);
    });
    socket.on('load-completed', data => {
        // console.log(data)
        socket.broadcast.emit('load-completed', data);
    })
});

httpServer.listen(3001);
console.log("listening port 3001");