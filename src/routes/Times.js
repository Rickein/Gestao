const { Router } = require("express");
const router = Router()
const { telaInicial,inserirNovoTime,alterarTime,removerTime} = require("../controllers/times");

router.get('/', telaInicial);
router.patch('/:id',alterarTime);
router.delete('/:id',removerTime);
router.post('/novoTime',inserirNovoTime);

module.exports = router