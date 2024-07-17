const { obterProximoId } = require('../scripts/contadores');
const { db, collection, getDocs, doc, setDoc, getDoc, deleteDoc, query, where, addDoc } = require("../database/firebase");

async function _inserirUsuario(dados) {
    try {
        const idUsuario = await obterProximoId("id_usu");
        const documentRef = doc(db, "Usuarios", String(idUsuario));
        await setDoc(documentRef, { ...dados, id_usu: idUsuario });
    } catch (error) {
        console.error('Erro ao adicionar documento: ', error);
        throw error
    }
}

async function _validarUsuario(dados) {
    const { usu_email, usu_senha } = dados;
    try {
        const usuariosCollection = collection(db, 'Usuarios');
        const q = query(usuariosCollection, where('usu_email', '==', usu_email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return { nome: '', resposta: 'Invalido' };
        }

        const usuarioDoc = snapshot.docs[0];
        const usuarioData = usuarioDoc.data();

        if (usuarioData.usu_senha === usu_senha) {
            return { nome: usuarioData.usu_nome, resposta: 'Valido' };
        } else {
            return { nome: '', resposta: 'Invalido' };
        }
    } catch (error) {
        console.error('Erro ao validar usuário:', error);
        throw error;
    }
}


async function consultaUsuariosAPI(req, res) {
    try {
        const usuariosCollection = collection(db, 'Usuarios');
        const snapshot = await getDocs(usuariosCollection);
        const emails = snapshot.docs.map(doc => ({ usu_email: doc.data().usu_email }));
        res.json(emails);
    } catch (error) {
        console.error('Erro ao buscar emails dos usuários:', error);
        throw error;
    }
}


async function consultaUsuarioAPI(req, res) {
    const id = req.params.id;
    try {
        const usuarioDocRef = doc(db, 'Usuarios', id);
        const docSnap = await getDoc(usuarioDocRef);

        if (docSnap.exists()) {
            res.json({ usu_email: docSnap.data().usu_email });
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Erro ao buscar email do usuário por ID:', error);
        throw error;
    }
}
module.exports = { _inserirUsuario, _validarUsuario, consultaUsuariosAPI, consultaUsuarioAPI }