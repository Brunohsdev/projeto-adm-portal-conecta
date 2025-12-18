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

// Detectar se é mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Registrar Service Worker
async function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('service-worker.js');
            console.log('Service Worker registrado:', registration);
            return registration;
        } catch (error) {
            console.error('Erro ao registrar Service Worker:', error);
            return null;
        }
    }
    return null;
}

// Solicitar permissão para notificações ao carregar a página
window.addEventListener('load', async function() {
    if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
    }
    await registrarServiceWorker();
});

// Botão Continuar
document.getElementById('continuar').addEventListener('click', async function() {
    const checkbox1 = document.querySelectorAll('input[type="checkbox"]')[0].checked;
    
    if (!checkbox1) {
        alert('Você precisa aceitar as Políticas de Privacidade e Termos de Uso para continuar');
        return;
    }
    
    // Marcar como conectado
    localStorage.setItem('fiebConectado', 'true');
    
    // Se for mobile, usar estratégia diferente
    if (isMobile()) {
        await conectarMobile();
    } else {
        await conectarDesktop();
    }
});

async function conectarMobile() {
    // Verificar permissão de notificações
    let permission = Notification.permission;
    
    if (permission === 'default') {
        permission = await Notification.requestPermission();
    }
    
    if (permission === 'granted') {
        // Redirecionar para página de sucesso que mostrará as notificações
        window.location.href = 'mobile-notifications.html';
    } else {
        // Se não permitir notificações, ir direto para página de sucesso
        alert('Conectado com sucesso! Você já pode navegar.');
        window.location.href = 'close.html';
    }
}

async function conectarDesktop() {
    if ('Notification' in window && Notification.permission === 'granted') {
        enviarNotificacoes();
    } else if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            enviarNotificacoes();
        } else {
            tentarFecharNavegador();
        }
    } else {
        tentarFecharNavegador();
    }
}

function enviarNotificacoes() {
    // Notificação 1: Conectado
    new Notification('✓ Conectado ao WiFi FiEB', {
        body: `Olá ${dadosAluno.nome}! Você está conectado à rede FiEB.`,
        icon: 'logo.png',
        badge: 'logo.png',
        tag: 'fieb-conectado',
        requireInteraction: false
    });
    
    // Notificação 2: NauFest 2026
    setTimeout(() => {
        const notif2 = new Notification('🎉 NauFest 2026', {
            body: 'O maior festival de cultura e inovação está chegando! 15-17 de Março.',
            icon: 'logo.png',
            tag: 'naufest'
        });
        
        notif2.onclick = function() {
            window.open('https://www.senai.br', '_blank');
            notif2.close();
        };
    }, 3000);
    
    // Notificação 3: Mundo SENAI
    setTimeout(() => {
        const notif3 = new Notification('🚀 Mundo SENAI de Inovação', {
            body: 'Descubra as últimas tendências em tecnologia. 5-8 de Maio, 2026.',
            icon: 'logo.png',
            tag: 'mundo-senai'
        });
        
        notif3.onclick = function() {
            window.open('https://www.senai.br', '_blank');
            notif3.close();
        };
    }, 6000);
    
    // Notificação 4: Semana de Tecnologia
    setTimeout(() => {
        const notif4 = new Notification('💡 Semana de Tecnologia', {
            body: 'Uma semana dedicada às inovações tecnológicas. 20-24 de Abril.',
            icon: 'logo.png',
            tag: 'semana-tech'
        });
        
        notif4.onclick = function() {
            window.open('https://www.senai.br', '_blank');
            notif4.close();
        };
    }, 9000);
    
    setTimeout(() => {
        tentarFecharNavegador();
    }, 1000);
}

function tentarFecharNavegador() {
    window.close();
    setTimeout(() => {
        window.location.href = 'close.html';
    }, 500);
}