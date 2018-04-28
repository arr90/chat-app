const express = require('express'); //tratativa das rotas
const path = require('path'); //padrao do node

const app = express();

//porta que vai ser acessada pelo websocket --protocolo wss
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req,res) => {
    res.render('index.html');
});

let messages = [];

io.on('connection', socket => { //toda vez que um cliente se conectar
    console.log(`Socket conectado: ${socket.id}`);

    socket.on('sendMessage', data => {
        console.log(data);
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);//envia o evento para todos os sockets conectados
    });
});


server.listen(3000);