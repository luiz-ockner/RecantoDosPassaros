const sql = require('mssql');
require('dotenv').config();

async function findLocalSQLServer() {
  console.log('🔍 Procurando SQL Server local...\n');

  // Diferentes formas de acessar o host do container
  const hostOptions = [
    'host.docker.internal',  // Docker Desktop (Windows/Mac)
    'host-gateway',          // Docker Linux
    '172.17.0.1',           // Docker bridge padrão
    '10.0.0.1',             // Gateway do dev container
    'localhost'             // Se estiver usando network host
  ];

  // Diferentes configurações de instância
  const serverConfigs = [
    { server: 'RECDOSPASSAROS', description: 'Nome original do servidor' },
    { server: 'localhost', description: 'Localhost padrão' },
    { server: 'localhost\\SQLEXPRESS', description: 'SQL Server Express' },
    { server: 'localhost\\MSSQLSERVER', description: 'SQL Server padrão' },
    { server: '.\\SQLEXPRESS', description: 'Instância local Express' },
    { server: '.', description: 'Instância padrão local' }
  ];

  // Credenciais originais
  const credentials = [
    { user: 'luiz', password: 'sequor', description: 'Credenciais originais' },
    { user: 'sa', password: 'sequor', description: 'SA com senha original' },
    { user: 'sa', password: 'Sequor123!', description: 'SA com senha do container' }
  ];

  console.log('📋 Testando combinações de host, servidor e credenciais...\n');

  for (const host of hostOptions) {
    console.log(`🌐 Testando host: ${host}`);
    
    for (const serverConfig of serverConfigs) {
      for (const cred of credentials) {
        const serverName = serverConfig.server.replace('localhost', host).replace('.', host);
        
        console.log(`   🔧 ${serverConfig.description} com ${cred.description}`);
        console.log(`      Servidor: ${serverName}`);
        console.log(`      Usuário: ${cred.user}`);
        
        try {
          const config = {
            user: cred.user,
            password: cred.password,
            server: serverName,
            database: 'master', // Conecta ao master primeiro
            options: {
              encrypt: false,
              trustServerCertificate: true,
              enableArithAbort: true,
            },
            requestTimeout: 10000,
            connectionTimeout: 10000,
          };

          const pool = await sql.connect(config);
          console.log(`      ✅ SUCESSO! Conectado ao SQL Server`);
          
          // Testar query simples
          const result = await pool.request().query('SELECT @@VERSION as version');
          console.log(`      ✅ Versão: ${result.recordset[0].version.substring(0, 50)}...`);
          
          // Verificar se o banco RecPassarosDB existe
          const dbCheck = await pool.request().query(`
            SELECT name FROM sys.databases WHERE name = 'RecPassarosDB'
          `);
          
          if (dbCheck.recordset.length > 0) {
            console.log(`      ✅ Banco RecPassarosDB encontrado!`);
          } else {
            console.log(`      ⚠️  Banco RecPassarosDB não encontrado (mas conexão OK)`);
          }
          
          await pool.close();
          
          console.log(`\n🎯 CONFIGURAÇÃO ENCONTRADA:`);
          console.log(`HOST: ${host}`);
          console.log(`SERVIDOR: ${serverName}`);
          console.log(`USUÁRIO: ${cred.user}`);
          console.log(`SENHA: ${cred.password}`);
          console.log(`\n💾 Atualizando arquivo .env...`);
          
          return {
            host,
            server: serverName,
            user: cred.user,
            password: cred.password,
            found: true
          };
          
        } catch (err) {
          console.log(`      ❌ Falhou: ${err.message.substring(0, 60)}...`);
          
          // Fechar conexão se necessário
          try {
            await sql.close();
          } catch {}
        }
        
        console.log('');
      }
    }
    console.log('');
  }
  
  return { found: false };
}

async function main() {
  try {
    const result = await findLocalSQLServer();
    
    if (result.found) {
      console.log('🎉 SQL Server local encontrado e configurado!');
      
      // Criar arquivo com as configurações encontradas
      const envConfig = `DB_USER=${result.user}
DB_PASSWORD=${result.password}
DB_SERVER=${result.server}
DB_DATABASE=RecPassarosDB
CONNECTION_STRING=Provider=SQLOLEDB.1;Password=${result.password};Persist Security Info=True;User ID=${result.user};Initial Catalog=RecPassarosDB;Data Source=${result.server}`;
      
      console.log('\n📄 Configuração para .env:');
      console.log(envConfig);
      
    } else {
      console.log('❌ Nenhum SQL Server local acessível encontrado.');
      console.log('\n💡 Possíveis soluções:');
      console.log('1. Verificar se o SQL Server está rodando na máquina host');
      console.log('2. Habilitar protocolo TCP/IP no SQL Server Configuration Manager');
      console.log('3. Configurar firewall para permitir porta 1433');
      console.log('4. Verificar se a autenticação mista está habilitada');
      console.log('5. Usar --network=host no Docker para acesso direto');
    }
    
  } catch (err) {
    console.error('💥 Erro geral:', err);
  }
}

main();
