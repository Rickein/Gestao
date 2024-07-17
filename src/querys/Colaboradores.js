const { db, collection, getDocs, doc, setDoc,getDoc,deleteDoc  } = require("../database/firebase");
const { obterProximoId } = require("../scripts/contadores");

async function _consultaColaboradores() {
    try {
        const timesCollection = collection(db, 'Colaboradores');
        const snapshot = await getDocs(timesCollection);
        const documentos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return documentos;
    } catch (error) {
        console.error('Erro ao ler documentos: ', error);
        throw error
    }
}

async function _consultaColaborador(id){
    try {
        const docRef = doc(db, 'Colaboradores', String(id));
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

async function _inserirColaboradores(clb) {
    try {
        const id_Clb = await obterProximoId("id_clb");
        const documentRef = doc(db, "Colaboradores", String(id_Clb));
        await setDoc(documentRef, { ...clb, id_clb: id_Clb });
    } catch (error) {
        console.error('Erro ao adicionar documento: ', error);
        throw error
    }
}

async function consultaColaboradoresAPI(req, res) {
    try {
        const documentos = await _consultaColaboradores();
        res.json(documentos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Colaboradores' });
    }
}

async function consultaColaboradorAPI(req, res) {
    try {
        const documentos = await _consultaColaborador(req.params.id);
        res.json(documentos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar Colaboradores' });
    }
}

async function _atualizarColaborador(ID,clb) {
    try {
        await setDoc(doc(db,'Colaboradores', String(ID)), clb, { merge: true });
    } catch (error) {
        console.error('Erro ao atualizar documento: ', error);
        throw error
    }
}

async function _deletarColaborador(id) {
    try {
        const docRef = doc(db, "Colaboradores", String(id));
        await deleteDoc(docRef);
    } catch (error) {
        console.error(`Erro ao remover documento ${idDocumento} da coleção ${colecao}:`, error);
    }
}

module.exports = { _consultaColaboradores,_inserirColaboradores, _atualizarColaborador,
_deletarColaborador,consultaColaboradoresAPI, consultaColaboradorAPI }