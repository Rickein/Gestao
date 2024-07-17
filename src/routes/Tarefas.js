const { Router } = require("express");
const router = Router()
const { telaInicial,alterarTarefa,inserirTarefa,removerTarefa} = require("../controllers/tarefas");

router.get('/', telaInicial);
router.patch('/:id',alterarTarefa);
router.delete('/:id',removerTarefa);
router.post('/inserirTarefa',inserirTarefa);
module.exports = router