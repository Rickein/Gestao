const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const { geraSessao } = require("./src/scripts/GeraSessao");
const cors = require('cors');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: geraSessao(),
    resave: false,
    saveUninitialized: true
}));

app.use(cors({
    origin: '*', // Permite todas as origens. Ajuste conforme necessário.
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type'
}));

app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.redirect('/Login');
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

const Login = require("./src/routes/Login");
app.use('/Login', Login);

const Gestor = require("./src/routes/Gestor");
app.use('/Gestor', Gestor);

const Times = require("./src/routes/Times");
app.use('/Times', Times);

const Colaboradores = require("./src/routes/Colaboradores");
app.use('/Colaboradores', Colaboradores);

const Tarefas = require("./src/routes/Tarefas");
app.use('/Tarefas', Tarefas)

const AtribuicaoDeTarefas = require("./src/routes/AtribuicaoDeTarefas");
app.use('/AtribuicaoDeTarefas', AtribuicaoDeTarefas)

const Api = require("./src/routes/api");
app.use('/api', Api);

app.post('/save-fcm-token', (req, res) => {
    const fcmToken = req.body.token;
    if (fcmToken) {
        res.cookie('fcmToken', fcmToken, { maxAge: 900000, httpOnly: true });
        res.status(200).send('FCM token salvo com sucesso.');
    } else {
        res.status(400).send('FCM token não fornecido.');
    }
});

const port = 8000;
app.listen(port, () => {
    console.log(`Escutando na porta ${port}`)
})