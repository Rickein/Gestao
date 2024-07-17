const { Router } = require("express");
const router = Router()
const { saveToken } = require("../querys/Token");

router.post('/saveToken', saveToken);

module.exports = router