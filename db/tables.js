class Tables {
    init(connection) {
        this.connection = connection
        this.createTables()
    }

    createTables() {
        const users = 'CREATE TABLE IF NOT EXISTS users (id int NOT NULL AUTO_INCREMENT, client varchar(50) NOT NULL, number varchar(13) NOT NULL, stage varchar(20) NOT NULL DEFAULT "inicio",cadastrado varchar(20) NOT NULL DEFAULT "nao", initialDate datetime NOT NULL, PRIMARY KEY(id))'  
        this.connection.query(users, erro => {
            if (erro) {
                console.log(erro)
            } else {
                console.log('info:     Tabela users OK!')
            }
        })
    }
}

module.exports = new Tables