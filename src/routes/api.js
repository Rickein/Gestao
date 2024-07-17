const { Router } = require("express");
const router = Router()
const { consultaTimesAPI, consultaTimeAPI } = require("../querys/Times");
const { inserirNovoTime,alterarTime,removerTime } = require("../controllers/times")
const { consultaColaboradoresAPI, consultaColaboradorAPI } = require("../querys/Colaboradores");
const {inserirNovoColaborador,alterarColaborador,removerColaborador} = require("../controllers/colaboradores")
const { consultaTarefasAPI, consultaTarefaAPI,consultarPrazoTarefaAPI,consultarPrazoTarefaEquipeAPI } = require("../querys/Tarefas");
const { alterarTarefa,inserirTarefa, removerTarefa } = require("../controllers/tarefas");
const {validaLogin,inserirUsuario} = require("../controllers/login");
const {consultaUsuariosAPI,consultaUsuarioAPI} = require("../querys/Login");

router.get('/times', consultaTimesAPI);
router.get('/times/:id', consultaTimeAPI);
router.patch('/times/:id',alterarTime);
router.delete('/times/:id',removerTime);
router.post('/times/novoTime', inserirNovoTime);

router.get('/colaboradores', consultaColaboradoresAPI);
router.get('/colaboradores/:id', consultaColaboradorAPI);
router.patch('/colaboradores/:id',alterarColaborador);
router.delete('/colaboradores/:id',removerColaborador);
router.post('/colaboradores/novoColaborador',inserirNovoColaborador);

router.get('/tarefas', consultaTarefasAPI);
router.get('/tarefas/:id', consultaTarefaAPI);
router.get('/Prazo',consultarPrazoTarefaAPI);
router.get('/tarefas/Prazo/:id',consultarPrazoTarefaEquipeAPI);
router.patch('/tarefas/:id',alterarTarefa);
router.delete('/tarefas:id',removerTarefa);
router.post('/tarefas/novaTarefa',inserirTarefa);



router.get('/login', consultaUsuariosAPI);
router.get('/login/:id', consultaUsuarioAPI);
router.post('/login', validaLogin);
router.post('/InserirUsuario',inserirUsuario)
module.exports = router