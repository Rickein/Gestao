const { Router } = require("express");
const router = Router()
const {inserirNovoColaborador,alterarColaborador,removerColaborador} = require("../controllers/colaboradores");

router.post('/novoColaborador',inserirNovoColaborador);
router.patch('/:id',alterarColaborador);
router.delete('/:id',removerColaborador);

module.exports = router