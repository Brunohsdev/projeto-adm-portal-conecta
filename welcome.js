// Verificar se há dados do aluno no localStorage
const dadosAluno = JSON.parse(localStorage.getItem('alunoLogado'));

if (!dadosAluno) {
    window.location.href = 'index.html';
} else {
    document.getElementById('userName').textContent = `${dadosAluno.nome} ${dadosAluno.sobrenome}`;
    document.getElementById('turma').textContent = dadosAluno.turma;
    document.getElementById('sala').textContent = dadosAluno.sala;
    document.getElementById('nameLink').textContent = dadosAluno.nome + ' ' + dadosAluno.sobrenome;
}

// Link "Não sou..."
document.getElementById('notUser').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('alunoLogado');
    window.location.href = 'index.html';
});

// Solicitar permissão para notificações quando a página carregar
if ('Notification' in window) {
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Botão Continuar
document.getElementById('continuar').addEventListener('click', function() {
    const checkbox1 = document.getElementById('checkbox1').checked;
    
    if (!checkbox1) {
        alert('Você precisa aceitar as Políticas de Privacidade e Termos de Uso para continuar');
        return;
    }
    
    // Verificar se notificações são suportadas
    if ('Notification' in window && Notification.permission === 'granted') {
        enviarNotificacoes();
    } else if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                enviarNotificacoes();
            } else {
                // Se não permitir notificações, apenas tenta fechar
                tentarFecharNavegador();
            }
        });
    } else {
        tentarFecharNavegador();
    }
});

function enviarNotificacoes() {
    // Notificação 1: Conectado
    new Notification('✓ Conectado ao WiFi FiEB', {
        body: `Olá ${dadosAluno.nome}! Você está conectado à rede FiEB.`,
        icon: 'logo.png',
        badge: 'logo.png',
        tag: 'fieb-conectado',
        requireInteraction: false
    });
    
    // Notificação 2: NauFest 2026 (após 3 segundos)
    setTimeout(() => {
        const notif2 = new Notification('🎉 NauFest 2026', {
            body: 'O maior festival de cultura e inovação está chegando! 15-17 de Março.',
            icon: 'logo.png',
            badge: 'logo.png',
            tag: 'naufest',
            requireInteraction: true,
            actions: [
                { action: 'saiba-mais', title: 'Saiba mais' }
            ]
        });
        
        notif2.onclick = function() {
            window.open('https://www.senai.br', '_blank');
            notif2.close();
        };
    }, 3000);
    
    // Notificação 3: Mundo SENAI (após 6 segundos)
    setTimeout(() => {
        const notif3 = new Notification('🚀 Mundo SENAI de Inovação', {
            body: 'Descubra as últimas tendências em tecnologia. 5-8 de Maio, 2026.',
            icon: 'logo.png',
            badge: 'logo.png',
            tag: 'mundo-senai',
            requireInteraction: true
        });
        
        notif3.onclick = function() {
            window.open('https://www.senai.br', '_blank');
            notif3.close();
        };
    }, 6000);
    
    // Notificação 4: Semana de Tecnologia (após 9 segundos)
    setTimeout(() => {
        const notif4 = new Notification('💡 Semana de Tecnologia', {
            body: 'Uma semana dedicada às inovações tecnológicas. 20-24 de Abril.',
            icon: 'logo.png',
            badge: 'logo.png',
            tag: 'semana-tech',
            requireInteraction: true
        });
        
        notif4.onclick = function() {
            window.open('https://www.senai.br', '_blank');
            notif4.close();
        };
    }, 9000);
    
    // Tentar fechar o navegador após mostrar as notificações
    setTimeout(() => {
        tentarFecharNavegador();
    }, 1000);
}

function tentarFecharNavegador() {
    // Tentar fechar a janela
    window.close();
    
    // Se não conseguir fechar, redirecionar para uma página em branco
    // ou mostrar mensagem
    setTimeout(() => {
        // Redirecionar para página que instrui o usuário a fechar
        window.location.href = 'close.html';
    }, 500);
}