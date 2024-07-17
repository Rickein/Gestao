async function saveToken(req, res) {
        const { token } = req.body;
        req.session.fcmToken = token;
        res.status(200).send({ message: 'Token salvo com sucesso' });
}
module.exports = { saveToken }