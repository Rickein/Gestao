const { db, collection, getDocs, doc, setDoc, getDoc, deleteDoc,query, where,addDoc  } = require("../database/firebase");
const { obterProximoId } = require("../scripts/contadores");
const {formatDate,formatDateHR,stringToTimestamp,parseDateString} = require("../scripts/formatDate");

async function atualizarAtribuicao(dados) {
    try {
        await Tarefas.update(
            {
                id_time: dados.id_time === 0 ? null : dados.id_time,
                id_clb: dados.id_clb === 0 ? null : dados.id_clb
            },
            {
                where: { id_tarefa: dados.id_tarefa }
            }
        );
    } catch (err) {
        console.error('Erro ao atualizar dados:', err);
        throw err
    }
}

async function atualizarAtribuicaoSituacao(dados) {
    try {
        await Tarefas.update(
            {
                situacao_tarefa: dados.situacao_tarefa,
            },
            {
                where: { id_tarefa: dados.id_tarefa }
            }
        );
    } catch (err) {
        console.error('Erro ao atualizar dados:', err);
        throw err
    }
}

module.exports = { atualizarAtribuicao,atualizarAtribuicaoSituacao}