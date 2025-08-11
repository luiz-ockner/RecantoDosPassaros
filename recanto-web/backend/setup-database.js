const sql = require('mssql');
require('dotenv').config();

async function setupDatabase() {
  console.log('🔧 Configurando banco de dados SQL Server...\n');

  // Configuração para conectar ao master (banco padrão)
  const masterConfig = {
    user: 'sa',
    password: 'Sequor123!',
    server: 'localhost',
    database: 'master', // Conecta ao master primeiro
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
    },
    requestTimeout: 30000,
    connectionTimeout: 30000,
  };

  try {
    console.log('1. Conectando ao banco master...');
    const masterPool = await sql.connect(masterConfig);
    console.log('   ✅ Conectado ao master');

    // Verificar se o banco existe
    console.log('\n2. Verificando se o banco RecPassarosDB existe...');
    const checkDb = await masterPool.request().query(`
      SELECT name FROM sys.databases WHERE name = 'RecPassarosDB'
    `);

    if (checkDb.recordset.length === 0) {
      console.log('   ❌ Banco RecPassarosDB não encontrado');
      console.log('   🔨 Criando banco RecPassarosDB...');
      
      await masterPool.request().query(`
        CREATE DATABASE RecPassarosDB
      `);
      
      console.log('   ✅ Banco RecPassarosDB criado com sucesso!');
    } else {
      console.log('   ✅ Banco RecPassarosDB já existe');
    }

    await masterPool.close();

    // Agora conectar ao banco específico
    console.log('\n3. Testando conexão com RecPassarosDB...');
    const appConfig = {
      user: 'sa',
      password: 'Sequor123!',
      server: 'localhost',
      database: 'RecPassarosDB',
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
      },
      requestTimeout: 30000,
      connectionTimeout: 30000,
    };

    const appPool = await sql.connect(appConfig);
    console.log('   ✅ Conectado ao RecPassarosDB');

    // Teste de query
    const testResult = await appPool.request().query(`
      SELECT 
        'RecPassarosDB' as database_name,
        GETDATE() as current_time,
        @@VERSION as sql_version
    `);
    
    console.log('   ✅ Query de teste executada:');
    console.log('   ', testResult.recordset[0]);

    await appPool.close();

    console.log('\n🎉 Configuração do banco concluída com sucesso!');
    console.log('\n📋 Informações de conexão:');
    console.log('- Servidor: localhost:1433');
    console.log('- Banco: RecPassarosDB');
    console.log('- Usuário: sa');
    console.log('- Senha: Sequor123!');
    
    return true;

  } catch (err) {
    console.error('\n❌ Erro durante a configuração:');
    console.error('Código:', err.code);
    console.error('Mensagem:', err.message);
    console.error('Detalhes:', err);
    return false;
  }
}

setupDatabase().then((success) => {
  process.exit(success ? 0 : 1);
}).catch((err) => {
  console.error('💥 Erro geral:', err);
  process.exit(1);
});
