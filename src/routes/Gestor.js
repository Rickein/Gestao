const { Router } = require("express");
const router = Router()
const { telaInicial} = require("../controllers/gestor");

router.get('/', telaInicial);
module.exports = router