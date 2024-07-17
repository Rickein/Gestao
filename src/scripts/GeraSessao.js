function geraSessao() {
    let caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let sessao = '';
    for (let i = 0; i < 10; i++) {
        sessao += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return sessao;
  }
    
module.exports = {
    geraSessao
}