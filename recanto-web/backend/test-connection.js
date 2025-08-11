const sql = require('mssql');
require('dotenv').config();

// Configuração usando variáveis individuais
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function testConnection() {
  console.log('Testando conexão com o banco de dados...');
  console.log('Configuração:');
  console.log('- Servidor:', process.env.DB_SERVER);
  console.log('- Banco:', process.env.DB_DATABASE);
  console.log('- Usuário:', process.env.DB_USER);
  console.log('- Senha:', process.env.DB_PASSWORD ? '***' : 'NÃO DEFINIDA');
  console.log('');

  try {
    console.log('Tentando conectar...');
    const pool = await sql.connect(config);
    console.log('✅ Conexão bem-sucedida!');
    
    // Teste simples de query
    const result = await pool.request().query('SELECT 1 as test');
    console.log('✅ Query de teste executada com sucesso:', result.recordset);
    
    await pool.close();
    console.log('✅ Conexão fechada');
    
  } catch (err) {
    console.error('❌ Erro na conexão:');
    console.error('Código do erro:', err.code);
    console.error('Mensagem:', err.message);
    console.error('Detalhes completos:', err);
  }
}

// Executar o teste
testConnection().then(() => {
  console.log('Teste de conexão finalizado');
  process.exit(0);
}).catch((err) => {
  console.error('Erro durante o teste:', err);
  process.exit(1);
});
