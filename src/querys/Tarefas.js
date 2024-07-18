const { id } = require("date-fns/locale");
const { db, collection, getDocs, doc, setDoc, getDoc, deleteDoc,query, where,addDoc  } = require("../database/firebase");
const { obterProximoId } = require("../scripts/contadores");
const {formatDate,formatDateHR,stringToTimestamp,parseDateString} = require("../scripts/formatDate");

async function _consultaTarefas(prioridades = [], filtros = []) {

    try {
        const tarefasCollection = collection(db, 'Tarefas');
        const q = query(tarefasCollection, 
            ...(prioridades.length > 0 ? [where('prioridade_tarefa', 'in', prioridades)] : []),
            ...(filtros.length > 0 ? [where('situacao_tarefa', 'in', filtros)] : [])
        );

        const snapshot = await getDocs(q);
        const documentos = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                prazo_tarefa: formatDate(data.prazo_tarefa)
            };
        });

        return documentos;
    } catch (error) {
        console.error('Erro ao ler documentos: ', error);
    }
}

async function _consultaTarefa(id){
    try {
        const docRef = doc(db, 'Tarefas', String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.prazo_tarefa) {
                data.prazo_tarefa = formatDateHR(data.prazo_tarefa);
            }
            return { id: docSnap.id, ...data };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erro ao ler documento: ', error);
        throw error;
    }
}

async function consultaTarefasAPI(req, res) {
    const prioridades = req.query.Prioridades ? req.query.Prioridades.split(',') : [];
    const filtros = req.query.Filtros ? req.query.Filtros.split(',') : [];

    try {
        const tarefasCollection = collection(db, 'Tarefas');
        const conditions = [];

        if (prioridades.length > 0) {
            conditions.push(where('prioridade_tarefa', 'in', prioridades));
        }

        if (filtros.length > 0) {
            conditions.push(where('situacao_tarefa', 'in', filtros));
        }

        const q = query(tarefasCollection, ...conditions);
        const snapshot = await getDocs(q);
        const documentos = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                prazo_tarefa: formatDate(data.prazo_tarefa)
            };
        });
        res.json(documentos);
    } catch (error) {
        console.error('Erro ao buscar Tarefas:', error);
        res.status(500).json({ error: 'Erro ao buscar Tarefas' });
    }
}

async function consultaTarefaAPI(req, res) {
    try {
        const documento = await _consultaTarefa(req.params.id);
        res.json(documento);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Tarefa' });
    }
}

async function _atualizarTarefa(ID, tarefa) {
    try {
        if (tarefa && tarefa.prazo_tarefa) {
            tarefa.prazo_tarefa = stringToTimestamp(tarefa.prazo_tarefa);
        }
        await setDoc(doc(db, 'Tarefas', String(ID)), tarefa, { merge: true });
    } catch (error) {
        console.error('Erro ao atualizar documento: ', error);
        throw error;
    }
}

async function _criarTarefa(tarefas) {
    if (!Array.isArray(tarefas)) {
        tarefas = [tarefas];
    }

    try {
        const novaTarefaPromises = tarefas.map(async (tarefa) => {
            const id_tarefa = await obterProximoId('id_tarefa');
            const novaTarefaRef = doc(db, 'Tarefas', String(id_tarefa));
            await setDoc(novaTarefaRef, {
                solicitante_tarefa: tarefa.solicitante_tarefa,
                assunto_tarefa: tarefa.assunto_tarefa,
                descricao_tarefa: tarefa.descricao_tarefa,
                prioridade_tarefa: tarefa.prioridade_tarefa,
                tempo_estimado_tarefa: tarefa.tempo_estimado_tarefa,
                prazo_tarefa: parseDateString(tarefa.prazo_tarefa),
                situacao_tarefa: 'Em Aberto',
                id_clb: null,
                id_time: null,
                id_tarefa: id_tarefa
            });
            return {...tarefa };
        });

        const novaTarefa = await Promise.all(novaTarefaPromises);
        return novaTarefa;
    } catch (error) {
        console.error('Erro ao adicionar documento: ', error);
        throw error;
    }
}

async function _removerTarefa(id){
    try {
        const docRef = doc(db, "Tarefas", String(id));
        await deleteDoc(docRef);
    } catch (error) {
        console.error(`Erro ao remover documento ${idDocumento} da coleção ${colecao}:`, error);
        throw error
    }
}

async function consultarPrazoTarefaEquipeAPI(req,res){
    const idTime = req.params.id; 
    try {
        const tarefasCollection = collection(db, 'Tarefas');
        let q;

        if (idTime) {
            q = query(tarefasCollection, where('id_time', '==', idTime));
        } else {
            q = query(tarefasCollection);
        }

        const snapshot = await getDocs(q);
        const agora = new Date();
        const prazo24Horas = new Date(agora.getTime() + 24 * 60 * 60 * 1000);

        const documentos = snapshot.docs.map(doc => {
            const data = doc.data();
            const prazoData = new Date(data.prazo_tarefa.seconds * 1000);

            if (prazoData >= agora && prazoData <= prazo24Horas) {
                return {
                    id: doc.id,
                    ...data,
                    prazo_tarefa: formatDate(data.prazo_tarefa)
                };
            }
            return null; 
        }).filter(doc => doc !== null); 

        res.json(documentos);
    } catch (error) {
        console.error('Erro ao buscar Tarefas:', error);
        res.status(500).json({ error: 'Erro ao buscar Tarefas' });
    }
}

async function consultarPrazoTarefaAPI(req,res){
    try {
        const tarefasCollection = collection(db, 'Tarefas');
        const q = query(tarefasCollection);
        const snapshot = await getDocs(q);
        const agora = new Date();
        const prazo24Horas = new Date(agora.getTime() + 24 * 60 * 60 * 1000);

        const documentos = snapshot.docs.map(doc => {
            const data = doc.data();
            const prazoData = new Date(data.prazo_tarefa.seconds * 1000);

            if (prazoData >= agora && prazoData <= prazo24Horas) {
                return {
                    id: doc.id,
                    ...data,
                    prazo_tarefa: formatDate(data.prazo_tarefa)
                };
            }
            return null; 
        }).filter(doc => doc !== null); 
        res.json(documentos);
    } catch (error) {
        console.error('Erro ao buscar Tarefas:', error);
        res.status(500).json({ error: 'Erro ao buscar Tarefas' });
    }
}

module.exports = {
    _consultaTarefas, consultaTarefasAPI, consultaTarefaAPI,consultarPrazoTarefaAPI,consultarPrazoTarefaEquipeAPI,
    _atualizarTarefa, _criarTarefa, _removerTarefa, 
}