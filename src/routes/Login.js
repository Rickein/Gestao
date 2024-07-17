const { Router } = require("express");
const router = Router()
const { telaInicial,inserirUsuario,deslogar,authGoogle} = require("../controllers/login");

router.get('/', telaInicial);
router.post('/authGoogle',authGoogle);
router.post('/InserirUsuario',inserirUsuario);
router.post('/Logout',deslogar);
module.exports = router