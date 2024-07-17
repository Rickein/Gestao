const { doc, setDoc, getDoc, updateDoc, increment } = require('firebase/firestore');
const {db} = require("../database/firebase");

async function inicializarContador(PK) {
  const contadorRef = doc(db, 'counters', PK);
  const docSnap = await getDoc(contadorRef);

  if (!docSnap.exists()) {
    await setDoc(contadorRef, { contador: 0 });
  }
}

async function obterProximoId(PK) {
  const contadorRef = doc(db, 'counters', PK);
  await updateDoc(contadorRef, { contador: increment(1) });
  const docSnap = await getDoc(contadorRef);
  return docSnap.data().contador;
}

module.exports = {obterProximoId}