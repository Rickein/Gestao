const { _consultaTarefas } = require("../querys/Tarefas");
const { _consultaTimes, _consultarTime } = require("../querys/Times");
const { _consultaColaboradores } = require("../querys/Colaboradores");
const { atualizarAtribuicao, atualizarAtribuicaoSituacao } = require("../querys/Atribuicao");

async function telaInicial(req, res) {

    const usuario = req.cookies.usuario;
    if (usuario == null) {
        res.render('Login')
    }

    const TimeSelecionado = req.query.Time ? [req.query.Time] : [];
    const times = await _consultaTimes();

    if (TimeSelecionado.length === 0) {
        res.render('AtribuicaoTarefas', { Tarefas: null, Colaboradores: null, Time: null, Times: times,Usuario: usuario });
    } else {
        const tarefas = await _consultaTarefas();
        const colaboradores = await _consultaColaboradores();
        const time = await _consultarTime(TimeSelecionado[0]);
        res.render('AtribuicaoTarefas', { Tarefas: tarefas, Colaboradores: colaboradores, Time: time, Times: times,Usuario: usuario });
    }
}

async function atribuirTarefa(req, res) {
    const Dados = req.body.Dados;
    try {
        await atualizarAtribuicao(Dados[0]);
        res.status(201).send(({ resultado: 'alterado' }));
    }
    catch (e) {
        return res.status(400).send(({ resultado: "algo deu errado", mensagem: e.message }));
    }
}

async function alterarSituacaoTarefa(req, res) {
    const Dados = req.body.Dados;
    try {
        await atualizarAtribuicaoSituacao(Dados[0]);
        res.status(201).send(({ resultado: 'alterado' }));
    }
    catch (e) {
        return res.status(400).send(({ resultado: "algo deu errado", mensagem: e.message }));
    }
}

module.exports = { telaInicial, atribuirTarefa, alterarSituacaoTarefa }