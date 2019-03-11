const app = require('./app');
const http = require('http').Server(app);
const port = process.env.PORT || 5000;
const io = require('socket.io')(http);
const controller = require('./server/controllers/user')

http.listen(port, () => console.log(`Server started on ${port}`));

io.sockets.on('connection', function (socket) {
    controller.updateSchema(socket);
});

