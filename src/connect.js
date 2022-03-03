const wppconnect = require('@wppconnect-team/wppconnect');
const connection = require('../db/connection');
const tables = require('../db/tables');

const session = 'BotWhats';

module.exports = {
    infra() {
        connection.connect(erro => {
            if (erro) {
                console.log(erro)
            } else {
                console.log('info:     MySQL Conectado!')
                tables.init(connection)
            }
        })

        wppconnect.create({
                session: session,
                autoClose: false,
                puppeteerOptions: {
                    args: ['--no-sandbox']
                }
        })
        .then((client) => validacaoInicial(client))
        .catch((error) => console.log(error))
    }
}
