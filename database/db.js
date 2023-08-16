import mysql2 from 'mysql2/promise';

// Configurações do banco de dados
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'iraner123',
    database: 'farmacia'
};

// Função de conexão com o banco de dados
export async function connect() {
    const connection = await mysql2.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            return;
        }
        console.log('Conexão bem-sucedida com o banco de dados MySQL');
    });

    return connection;
}