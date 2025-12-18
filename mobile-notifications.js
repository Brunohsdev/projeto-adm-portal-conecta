// Verificar dados do aluno
const dadosAluno = JSON.parse(localStorage.getItem('alunoLogado'));

if (!dadosAluno) {
    window.location.href = 'index.html';
} else {
    document.getElementById('userNameConnected').textContent = `${dadosAluno.nome} ${dadosAluno.sobrenome}`;
}

// Função para criar notificação popup na tela
function criarNotificacaoPopup(icon, title, body, url, delay) {
    setTimeout(() => {
        const overlay = document.getElementById('notificationsOverlay');
        
        const notification = document.createElement('div');
        notification.className = 'notification-popup';
        notification.innerHTML = `
            <div class="notification-icon-popup">${icon}</div>
            <div class="notification-content">
                <p class="notification-title">${title}</p>
                <p class="notification-body">${body}</p>
            </div>
        `;
        
        if (url) {
            notification.onclick = function() {
                window.open(url, '_blank');
            };
        }
        
        overlay.appendChild(notification);
        
        // Remover após 4 segundos
        setTimeout(() => {
            notification.remove();
        }, 4000);
        
        // Tentar enviar notificação real também
        if ('Notification' in window && Notification.permission === 'granted') {
            const realNotif = new Notification(title, {
                body: body,
                icon: 'logo.png',
                vibrate: [200, 100, 200]
            });
            
            if (url) {
                realNotif.onclick = function() {
                    window.open(url, '_blank');
                    realNotif.close();
                };
            }
        }
    }, delay);
}

// Enviar notificações sequencialmente
window.addEventListener('load', function() {
    // Notificação 1: Conectado
    criarNotificacaoPopup(
        '✓',
        'Conectado ao WiFi FiEB',
        `Olá ${dadosAluno.nome}! Você está conectado à rede FiEB.`,
        null,
        500
    );
    
    // Notificação 2: NauFest 2026
    criarNotificacaoPopup(
        '🎉',
        'NauFest 2026',
        'O maior festival de cultura e inovação está chegando! 15-17 de Março.',
        'https://www.senai.br',
        3000
    );
    
    // Notificação 3: Mundo SENAI
    criarNotificacaoPopup(
        '🚀',
        'Mundo SENAI de Inovação',
        'Descubra as últimas tendências em tecnologia. 5-8 de Maio, 2026.',
        'https://www.senai.br',
        6000
    );
    
    // Notificação 4: Semana de Tecnologia
    criarNotificacaoPopup(
        '💡',
        'Semana de Tecnologia',
        'Uma semana dedicada às inovações tecnológicas. 20-24 de Abril.',
        'https://www.senai.br',
        9000
    );
});

function fecharPagina() {
    // Instruir usuário a minimizar
    alert('Você pode minimizar o navegador agora e continuar navegando. As notificações foram enviadas!');
    
    // Tentar usar o botão nativo do navegador
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.close();
    }
}