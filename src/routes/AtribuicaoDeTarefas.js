const { Router } = require("express");
const router = Router()
const {telaInicial,alterarSituacaoTarefa} = require("../controllers/atribuicaoDeTarefas");
const {alterarTarefa} = require("../controllers/tarefas");

router.get('/', telaInicial);
router.patch('/:id', alterarTarefa);
router.patch('/alterarSituacaoTarefa',alterarSituacaoTarefa);
module.exports = router