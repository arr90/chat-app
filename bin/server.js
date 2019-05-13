const http = require('http');
const express = require('express'); //tratativa das rotas
const path = require('path'); //padrao do node
const socketIO = require('socket.io');
const xss = require('xss');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req,res) => {
    res.render('index.html');
});

let messages = [];
let socketsConnected = [];

io.sockets.on('connection', socket => { //toda vez que um cliente se conectar
    console.log(`Socket conectado: ${socket.id}`);    
    socketsConnected.push(socket);
    socket.emit('socketsConnected', socketsConnected.length);
    
    socket.on('disconnect', function(reason){
        console.log('Got disconnect! - Reason: ' + reason);        
        let i = socketsConnected.indexOf(socket);
        socketsConnected.splice(i, 1);
        socket.emit('socketsConnected', socketsConnected.length);
    });

    socket.emit('previosMessages', messages);//evento para mostrar as mensagens anteriores

    socket.on('sendMessage', data => {
        console.log(data);
        data.message = xss(data.message, {});//filtro para prevenir o XSS
        data.author  = xss(data.author, {});
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);//evento para enviar a mensagem para todos os sockets conectados
        socket.emit('receivedMessage', data);//evento para enviar a mensagem para o próprio socket
    });
});


server.listen(PORT, () => console.log(`Listening on ${PORT}`));