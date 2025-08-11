#!/bin/bash

echo "🔍 Diagnóstico de conectividade SQL Server"
echo "=========================================="
echo ""

echo "📍 Informações de rede do container:"
echo "- Gateway (Host IP): $(ip route show default | awk '/default/ {print $3}')"
echo "- IP do container: $(hostname -I | awk '{print $1}')"
echo ""

echo "🔌 Testando conectividade de rede:"
echo ""

# Teste 1: Ping para o host
echo "1. Testando ping para o host..."
if timeout 3 bash -c '</dev/tcp/10.0.0.1/22' 2>/dev/null; then
    echo "   ✅ Host acessível (porta SSH respondendo)"
else
    echo "   ❌ Host não acessível ou SSH não está rodando"
fi
echo ""

# Teste 2: Verificar portas específicas
echo "2. Testando portas específicas do SQL Server:"
for port in 1433 1434; do
    echo "   Testando porta $port..."
    if timeout 3 bash -c "</dev/tcp/10.0.0.1/$port" 2>/dev/null; then
        echo "   ✅ Porta $port está aberta"
    else
        echo "   ❌ Porta $port não está acessível"
    fi
done
echo ""

# Teste 3: Verificar se há algum serviço rodando no host
echo "3. Verificando serviços acessíveis no host:"
accessible_ports=()
for port in 80 443 3000 3001 5000 5001 8080 8081 22 21; do
    if timeout 1 bash -c "</dev/tcp/10.0.0.1/$port" 2>/dev/null; then
        accessible_ports+=($port)
    fi
done

if [ ${#accessible_ports[@]} -gt 0 ]; then
    echo "   ✅ Portas acessíveis: ${accessible_ports[*]}"
    echo "   ✅ O host está acessível, problema específico do SQL Server"
else
    echo "   ❌ Nenhuma porta comum acessível"
    echo "   ❌ Problema de conectividade geral com o host"
fi
echo ""

echo "📋 Instruções para resolver:"
echo ""
if [ ${#accessible_ports[@]} -gt 0 ]; then
    echo "✅ O host está acessível. Para resolver o SQL Server:"
    echo ""
    echo "1. Abra o SQL Server Configuration Manager"
    echo "2. Vá em 'SQL Server Network Configuration'"
    echo "3. Clique em 'Protocols for [SuaInstância]'"
    echo "4. Habilite 'TCP/IP'"
    echo "5. Clique com botão direito em TCP/IP > Properties"
    echo "6. Na aba 'IP Addresses', encontre 'IPAll'"
    echo "7. Defina 'TCP Port' como 1433"
    echo "8. Reinicie o serviço SQL Server"
    echo ""
    echo "🔥 Firewall do Windows:"
    echo "9. Abra o Windows Firewall"
    echo "10. Crie uma regra de entrada para porta 1433"
    echo ""
else
    echo "❌ Problema de conectividade geral. Soluções:"
    echo ""
    echo "1. Verifique se o dev container está em modo 'host' networking"
    echo "2. No VS Code, abra as configurações do dev container"
    echo "3. Adicione '--network=host' nas configurações do Docker"
    echo ""
    echo "Ou configure port forwarding:"
    echo "4. No devcontainer.json, adicione:"
    echo '   "forwardPorts": [1433]'
    echo ""
fi

echo "🧪 Alternativa rápida para desenvolvimento:"
echo "- Usar SQL Server em container Docker"
echo "- Comando: docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=YourPassword123!' -p 1433:1433 -d mcr.microsoft.com/mssql/server:2019-latest"
