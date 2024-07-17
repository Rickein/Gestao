const { db, collection, getDocs, doc, setDoc,getDoc,deleteDoc  } = require("../database/firebase");
const { obterProximoId } = require("../scripts/contadores");

async function _consultaTimes() {
    try {
        const timesCollection = collection(db, 'Times');
        const snapshot = await getDocs(timesCollection);
        const documentos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return documentos;
    } catch (error) {
        console.error('Erro ao ler documentos: ', error);
        throw error
    }
}

async function _consultarTime(id) {   
    try {
        const docRef = doc(db, 'Times', String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erro ao ler documento: ', error);
        throw error
    }
}

async function _inserirTime(dados) {
    try {
        const idTime = await obterProximoId("id_time");
        const documentRef = doc(db, "Times", String(idTime));
        await setDoc(documentRef, { ...dados, id_time: idTime, ativo:true });
    } catch (error) {
        console.error('Erro ao adicionar documento: ', error);
        throw error
    }
}

async function _atualizarTime(ID,time) {
    try {
        await setDoc(doc(db, 'Times', String(ID)), time, { merge: true });
    } catch (error) {
        console.error('Erro ao atualizar documento: ', error);
        throw error
    }
}

async function _removerTime(id) {
    try {
        const docRef = doc(db, "Times", String(id));
        await deleteDoc(docRef);
    } catch (error) {
        console.error(`Erro ao remover documento ${idDocumento} da coleção ${colecao}:`, error);
    }
}

async function consultaTimeAPI(req, res) {
    try {
        const documento = await _consultarTime(req.params.id);
        res.json(documento);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar times' });
    }
}

async function consultaTimesAPI(req, res) {
    try {
        const documentos = await _consultaTimes();
        res.json(documentos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar times' });
    }
}


module.exports = {
    _consultaTimes, _consultarTime, _inserirTime,_removerTime,
    consultaTimesAPI, consultaTimeAPI, _atualizarTime,
}