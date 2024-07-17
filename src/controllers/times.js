const { _consultaTimes, _inserirTime, _atualizarTime, _removerTime } = require("../querys/Times");
const { _consultaColaboradores } = require("../querys/Colaboradores");

async function telaInicial(req, res) {
    const usuario = req.cookies.usuario;
    if (usuario == null) {
        res.render('Login')
    }

    const times = await _consultaTimes();
    times.sort((a, b) => b.id_time - a.id_time)

    const colaboradores = await _consultaColaboradores();
    colaboradores.sort((a, b) => b.id_clb - a.id_clb)
    res.render('Times', { Times: times, Colaboradores: colaboradores,Usuario:usuario });
}

async function inserirNovoTime(req, res) {
    const time = req.body.Time;
    try {
        await _inserirTime({ nome_time: time });
        res.status(201).send(({ resultado: 'criado' }));
    }
    catch (e) {
        return res.status(400).send(({ resultado: "algo deu errado", mensagem: e.message }));
    }

}

async function removerTime(req, res) {
    const id_time = req.params.id;
    try {
        await _removerTime(id_time);
        res.status(200).send(({ resultado: 'removido' }));
    }
    catch (e) {
        return res.status(400).send(({ resultado: "algo deu errado", mensagem: e.message }));
    }
}

async function alterarTime(req, res) {
    const id_time = req.params.id;
    const time = req.body.Time;
    try {
        await _atualizarTime(id_time, time);
        res.status(200).send(({ resultado: 'alterado' }));
    }
    catch (e) {
        return res.status(400).send(({ resultado: "algo deu errado", mensagem: e.message }));
    }
}


module.exports = {
    telaInicial, inserirNovoTime, alterarTime, removerTime,

}
