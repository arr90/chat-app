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

server.listen(3000);