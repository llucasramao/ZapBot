const connect = require('./src/connect')

connect.infra()
function sendWppMessage(client, sendTo, text, botoes) {
    client.sendText(sendTo, text, botoes)
        .then((result) => {
            // console.log('SUCESSO: ', result); 
        })
        .catch((erro) => {
            console.error('ERRO: ', erro);
        });
}

function validacaoInicial(client) {
    client.onMessage((message) => {
        const sql = `SELECT * FROM zapbot.users WHERE number ='${message.from.replace(/[^\d]+/g, '')}'`
        connection.query(sql, (err, result) => {
            if (err) throw err;
            saida = JSON.stringify(result)

            if (saida === '[]'){
                console.log('Usuário não cadastrado!')
                reqCadastro(client, message)
            } else if (result[0].cadastrado === 'sim'){
                console.log('Usuário Cadastrado!')
                controller(client, message, result)
            } else if (result[0].cadastrado === 'nulo'){
                resCadastro(client, message)
            } else if (result[0].cadastrado === 'nao'){
                reqCadastro(client, message)
            }
        })
    })
}

function reqCadastro(client, message){
    let botoes = {
        buttons: [
          {
            id: 'id1',
            text: 'Sim'
          },
          {
            id: 'id2',
            text: 'Não'
          }
        ],
        title: `Bem vindo a SpaceWeb, ${message.sender.pushname}!`,
        footer: 'Nunca enviaremos mensagens promocionais nem compatilharemos o seu número'
}
    sendWppMessage(client, message.from, 'Para facilitar o nosso atendimento, estamos utilizando mensagens automáticas, você concorda com isso?', botoes)
    const sql = `INSERT INTO users (client, number, stage, cadastrado, initialDate) VALUES ('${message.sender.pushname}','${message.from.replace(/[^\d]+/g, '')}','reqCadastro', 'nulo', ADDDATE(NOW(), INTERVAL 0 DAY))`
    connection.query(sql, (err) => {
        if (err) throw err;
    })
}

function resCadastro(client, message){
    const sql = `SELECT * FROM zapbot.users WHERE number ='${message.from.replace(/[^\d]+/g, '')}'`
    connection.query(sql, (err, result) => {
        if (err) throw err;

        if (message.body === 'Sim'){
            const sql = `UPDATE zapbot.users SET cadastrado='sim', stage='menu' WHERE number='${message.from.replace(/[^\d]+/g, '')}'`
            connection.query(sql, (err) => {
                if (err) throw err;
            })
            sendWppMessage(client, message.from, 'Obrigado! A Space Web Soluções agradece pela confiança.')
            menu(client, message, result)
        } else if (message.body === 'Não'){
            const sql = `UPDATE zapbot.users SET cadastrado='nao', stage='resCadastro' WHERE number='${message.from.replace(/[^\d]+/g, '')}'`
            connection.query(sql, (err) => {
                if (err) throw err;
            })
            sendWppMessage(client, message.from, 'Tudo bem, um representante entrará em contato com você em alguns instantes')
        }
    })
}

function stage(message, stage){
    const sql = `UPDATE zapbot.users SET stage='${stage}' WHERE number='${message.from.replace(/[^\d]+/g, '')}'`
    connection.query(sql, (err) => {
        if (err) throw err;
    })
}

function controller(client, message, result){
    if (result[0].stage == 'menu'){menu(client, message, result)}
    if (result[0].stage == 'resMenu'){resMenu(client, message, result)}

    if (result[0].stage == 'criarSite'){criarSite(client, message, result)}
    if (result[0].stage == 'resCriarSite'){resCriarSite(client, message, result)}

    if (result[0].stage == 'suporte'){suporte(client, message, result)}
    if (result[0].stage == 'resSuporte'){resSuporte(client, message, result)}

    if (result[0].stage == 'integraZap'){integraZap(client, message, result)}
    if (result[0].stage == 'resIntegraZap'){resIntegraZap(client, message, result)}

    if (result[0].stage == 'especialista'){especialista(client, message, result)}
    if (result[0].stage == 'resEspecialista'){resEspecialista(client, message, result)}

}

function menu(client, message, result){
    stage(message, 'resMenu')
    sendWppMessage(client, message.from, 'Escolha o menu que melhor lhe atenderá:\n1 - Criar Site\n2 - Suporte Técnico\n3 - IntegraZap\n4 - Falar com especialista')
}

function resMenu(client, message, result){
    if(message.body === '1'){criarSite(client, message, result)}
    if(message.body === '2'){suporte(client, message, result)}
    if(message.body === '3'){integraZap(client, message, result)}
    if(message.body === '4'){console.log('Haha ok!')}
    //else{sendWppMessage(client, message.from, 'Resposta inválida!')}
}

function criarSite(client, message, result){
    stage(message, 'resCriarSite')
    sendWppMessage(client, message.from, 'Bem vindo ao menu de criação de site!')
    sendWppMessage(client, message.from, 'Atualmente, sua empresa já possui algum sistema web? Se sim, qual?')
}

function resCriarSite(client,message, result){
    sendWppMessage(client, message.from, 'Mensagem recebida de criar site!')
    stage(message, 'menu')
}

function suporte(client, message, result){
    stage(message, 'resSuporte')
    sendWppMessage(client, message.from, 'Bem vindo ao suporte técnico!')
    //sendWppMessage(client, message.from, 'Em uma avaliação de 0 a 10, qual a gravidade do seu problema?')
    sendWppMessage(client, message.from, 'Por favor, descreva seu problema no chat')
}

function resSuporte(client,message, result){
    sendWppMessage(client, message.from, 'Mensagem recebida de suporte!')
    stage(message, 'menu')
}

function integraZap (client, message, result){
    stage(message, 'resIntegraZap')
    let botoes = {
        buttons: [
          {
            id: 'id1',
            text: 'Sim'
          },
          {
            id: 'id2',
            text: 'Não'
          }
        ],
        //title: `Bem vindo a SpaceWeb, ${message.sender.pushname}!`,
        //footer: 'Nunca enviaremos mensagens promocionais nem compatilharemos o seu número'
}
    sendWppMessage(client, message.from, 'Ficou interessado em nosso sistema de automação do whatsapp? Clique no link abaixo para conferir mais!')
    sendWppMessage(client, message.from, 'LINK AQUI!')
    sendWppMessage(client, message.from, 'Deseja falar com um de nossos representantes?', botoes)
}

function resIntegraZap(client,message, result){
    sendWppMessage(client, message.from, 'Mensagem recebida de integraZap!')
    stage(message, 'menu')

}













/* 
function reqAlterarNome(client, message){
    let botoes = {
        buttons: [
          {
            id: 'id1',
            text: 'Pode sim!'
          },
          {
            id: 'id2',
            text: 'Quero Alterar!'
          }
        ],
        //title: 'Title text',
        footer: 'Marque uma opção abaixo'
}
    sendWppMessage(client, message.from, `Bem vindo novo usuário! Posse te chamar de ${message.sender.pushname} mesmo?`, botoes)
    const sql = `INSERT INTO users (client, number, stage, initialDate) VALUES ('${message.sender.pushname}','${message.from.replace(/[^\d]+/g, '')}','resAlterarNome', ADDDATE(NOW(), INTERVAL 0 DAY))`
    connection.query(sql, (err) => {
        if (err) throw err;
    })
}

function resAlterarNome(client, message, result){
    if (message.body == 'Quero Alterar!'){
        alterarNome(client, message)
    } else if (message.body === 'Pode sim!') {
        const sql = `UPDATE zapbot.users SET cadastrado='sim' WHERE number='${message.from.replace(/[^\d]+/g, '')}'`
        connection.query(sql, (err, result, fields) => {
            if (err) throw err;
        })
        console.log('Ok, vamos continuar!')
        menu1(client, message, result)
    } else {
        console.log('Resposta inválida!')
        sendWppMessage(client, message.from, 'Resposta inválida!')
        let botoes = {
            buttons: [
              {
                id: 'id1',
                text: 'Pode sim!'
              },
              {
                id: 'id2',
                text: 'Quero Alterar!'
              }
            ],
            //title: 'Title text',
            footer: 'Marque uma opção abaixo'
    }
        sendWppMessage(client, message.from, `Vou repetir, posse te chamar de ${message.sender.pushname} mesmo?`, botoes)
    }
}





function alterarNome(client, message){
    sendWppMessage(client, message.from, 'Ok! Digite seu nome:')
    client.onMessage((message2) => {
        console.log(message2)
    })
}

function menu1(client, message, result){
    stage += 1
    sendWppMessage(client, message.from, `Bem vindo ao bot, ${result[0].client}!\n\n1 - fazer tal coisa\n2 - fazer outra coisa\n 3 - fazer aquela outra coisa 0 - cancelar a vida`)
}
 */