const { _consultaTarefas, _atualizarTarefa, _criarTarefa,_removerTarefa } = require("../querys/Tarefas");

async function telaInicial(req, res) {
    const usuario = req.cookies.usuario;
    if (usuario == null) {
        res.render('Login')
    }
    const Prioridades = req.query.Prioridades ? req.query.Prioridades.split(',') : [];
    const Filtros = req.query.Filtros ? req.query.Filtros.split(',') : [];
    
    const tarefas = await _consultaTarefas(Prioridades, Filtros);
    tarefas.sort((a, b) => b.id_tarefa - a.id_tarefa);
    res.render('Tarefas', { Tarefas: tarefas, Prioridades: Prioridades, Filtros: Filtros, Usuario:usuario });
}

async function alterarTarefa(req, res) {
    const id_tarefa = req.params.id;
    const tarefa = req.body.Tarefa

    try {
        await _atualizarTarefa(id_tarefa,tarefa);
        res.status(201).send(({ resultado: 'alterado' }));
    }
    catch (e) {
        return res.status(400).send(({ resultado: "algo deu errado", mensagem: e.message }));
    }
}

async function inserirTarefa(req, res) {
    const tarefa = req.body.Tarefa
    try {
        await _criarTarefa(tarefa);
        res.status(201).send(({ resultado: 'criado' }));
    }
    catch (e) {
        return res.status(400).send(({ resultado: "algo deu errado", mensagem: e.message }));
    }
}

async function removerTarefa(req, res) {
    const IdTarefa = req.params.id;
    try {
        await _removerTarefa(IdTarefa);
        res.status(201).send(({ resultado: 'removido' }));
    }
    catch (e) {
        return res.status(400).send(({ resultado: "algo deu errado", mensagem: e.message }));
    }
}


module.exports = { telaInicial, alterarTarefa, inserirTarefa,removerTarefa }