const { _inserirColaboradores,_atualizarColaborador,_deletarColaborador } = require("../querys/Colaboradores");

async function inserirNovoColaborador(req,res){
    const clb = req.body.Colaborador
    try {
         await _inserirColaboradores(clb);
         res.status(201).send(({ resultado: 'criado' }));
    }
    catch (e) {
        return res.status(400).send(({ resultado: "algo deu errado", mensagem: e.message }));
    }
}

async function alterarColaborador(req,res){
    const id = req.params.id;
    const clb = req.body.Colaborador;
    try {
         await _atualizarColaborador(id,clb);
         res.status(201).send(({ resultado: 'alterado' }));
    }
    catch (e) {
        return res.status(400).send(({ resultado: "algo deu errado", mensagem: e.message }));
    }
}

async function removerColaborador(req,res){
    const id = req.params.id;
    try {
        await _deletarColaborador(id);
        res.status(200).send(({ resultado: 'removido' }));
   }
   catch (e) {
       return res.status(400).send(({ resultado: "algo deu errado", mensagem: e.message }));
   }
}

module.exports = {
inserirNovoColaborador,alterarColaborador,removerColaborador
}