const sql = require('mssql');
require('dotenv').config();

async function testDifferentConnections() {
  console.log('Testando diferentes configurações de conexão...\n');

  const connections = [
    {
      name: 'Configuração Original',
      config: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        database: process.env.DB_DATABASE,
        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
      }
    },
    {
      name: 'Usando host.docker.internal',
      config: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: 'host.docker.internal',
        database: process.env.DB_DATABASE,
        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
      }
    },
    {
      name: 'Usando localhost',
      config: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: 'localhost',
        database: process.env.DB_DATABASE,
        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
      }
    }
  ];

  for (const connection of connections) {
    console.log(`🔍 Testando: ${connection.name}`);
    console.log(`   Servidor: ${connection.config.server}`);
    
    try {
      console.log('   Tentando conectar...');
      const pool = await sql.connect(connection.config);
      console.log('   ✅ Conexão bem-sucedida!');
      
      const result = await pool.request().query('SELECT 1 as test');
      console.log('   ✅ Query de teste executada:', result.recordset);
      
      await pool.close();
      console.log('   ✅ Conexão fechada\n');
      break; // Se chegou até aqui, a conexão funcionou
      
    } catch (err) {
      console.log(`   ❌ Falhou: ${err.message}\n`);
      // Fechar qualquer pool que possa ter ficado aberto
      try {
        await sql.close();
      } catch {}
    }
  }
}

console.log('🔐 Variáveis de ambiente carregadas:');
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'Definida' : 'NÃO DEFINIDA');
console.log('CONNECTION_STRING:', process.env.CONNECTION_STRING ? 'Definida' : 'NÃO DEFINIDA');
console.log('');

testDifferentConnections().then(() => {
  console.log('Teste finalizado');
  process.exit(0);
}).catch((err) => {
  console.error('Erro geral:', err);
  process.exit(1);
});
