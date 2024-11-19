const { createServer } = require('http');
const { Server } = require('socket.io');
let count = 0

let httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on('connection', (socket) => {
    count++;
    console.log("connected: ", count)
    socket.on('disconnect', () => {
        count--
        console.log("disconnected: ", count)
        socket.emit("count", count)
        socket.broadcast.emit("count", count)
    })
    socket.emit("count", count)
    socket.broadcast.emit("count", count)
})


httpServer.listen(3001)
console.log("listening port 3001")