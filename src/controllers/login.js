const { _inserirUsuario, _validarUsuario } = require("../querys/Login");
const admin = require('../database/firebaseAdmin');  // Corrija a importação

async function telaInicial(req, res) {
    const usuario = req.cookies.usuario;
    if (usuario != null) {
        return res.redirect('Gestor');
    }
    res.render('login');
}

async function inserirUsuario(req, res) {
    const usuario = req.body.Usuario;

    try {
        await _inserirUsuario(usuario);
        res.status(201).send(({ resultado: 'criado' }));
    }
    catch (e) {
        return res.status(400).send(({ resultado: "algo deu errado", mensagem: e.message }));
    }
}

async function validaLogin(req, res) {
    const usuario = req.body.Usuario;
    try {
        const resposta = await _validarUsuario(usuario);
        if (resposta.resposta == "Valido") {
            req.session.login = resposta.nome;
            res.cookie('usuario', req.session.login, { maxAge: 4600000 });
            res.status(200).send(({ resultado: 'Logado' }));
        } else {
            res.status(200).send(({ resultado: 'Invalido' }));
        }
    }
    catch (e) {
        return res.status(400).send(({ resultado: "algo deu errado", mensagem: e.message }));
    }
}

async function deslogar(req, res) {
    res.cookie('usuario', null, { maxAge: 0 });
    res.status(200).json({ resultado: 'Deslogado' });
}

async function authGoogle(req, res) {
    try {
        const { token } = req.body;
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
        const userRecord = await admin.auth().getUser(uid);
        const userName = userRecord.displayName || 'Usuário';
        res.cookie('usuario', userName, {
            maxAge: 4600000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });
        res.status(200).json({ message: 'Token verificado com sucesso', uid });
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        res.status(401).json({ error: 'Erro ao verificar o token' });
    }
}

module.exports = {
    telaInicial, inserirUsuario, validaLogin, deslogar, authGoogle
}