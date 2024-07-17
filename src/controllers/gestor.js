const { _consultaTarefas } = require("../querys/Tarefas");
const { _consultaTimes } = require("../querys/Times");
const { _consultaColaboradores } = require("../querys/Colaboradores");
const admin = require('../database/firebaseAdmin');

async function telaInicial(req, res) {
    const usuario = req.cookies.usuario;
    if (!usuario) {
        return res.render('login'); // Verifique se 'login.ejs' está no diretório correto
    }
    
    const tarefas = (await _consultaTarefas()).length;
    const times = (await _consultaTimes()).length;
    const colaboradores = (await _consultaColaboradores()).length;

    const fcmToken = req.cookies.fcmToken;
    if (fcmToken) {
        const message = {
            notification: {
                title: 'Bem-vindo!',
                body: 'Obrigado por fazer login no Gestor!'
            },
            token: fcmToken
        };

        try {
            const response = await admin.messaging().send(message);
            console.log('Mensagem enviada com sucesso:', response);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    } else {
        console.warn('FCM Token não encontrado.');
    }

    res.render('Gestor', { Tarefas: tarefas, Times: times, Colaboradores: colaboradores, Usuario: usuario });
}

module.exports = {
    telaInicial
}