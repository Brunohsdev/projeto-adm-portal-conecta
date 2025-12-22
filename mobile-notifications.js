const dadosAluno = JSON.parse(localStorage.getItem('alunoLogado'));

if (!dadosAluno) {
    window.location.href = 'index.html';
}

document.getElementById('userNameConnected').textContent =
    `${dadosAluno.nome} ${dadosAluno.sobrenome}`;

// ===== FUNÇÃO POPUP VISUAL =====
function criarPopup(icon, title, body, url, delay) {
    setTimeout(() => {
        const overlay = document.getElementById('notificationsOverlay');

        const el = document.createElement('div');
        el.className = 'notification-popup';
        el.innerHTML = `
            <div class="notification-icon-popup">${icon}</div>
            <div class="notification-content">
                <p class="notification-title">${title}</p>
                <p class="notification-body">${body}</p>
            </div>
        `;

        if (url) {
            el.onclick = () => window.open(url, '_blank');
        }

        overlay.appendChild(el);

        setTimeout(() => el.remove(), 4000);
    }, delay);
}

// ===== NOTIFICAÇÃO DO SISTEMA (SE PERMITIDO) =====
function notifSistema(title, body, url) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const n = new Notification(title, {
            body,
            icon: 'logo.png'
        });

        if (url) {
            n.onclick = () => {
                window.open(url, '_blank');
                n.close();
            };
        }
    }
}

// ===== SEQUÊNCIA =====
window.addEventListener('load', () => {

    // 1️⃣ Conectado
    criarPopup(
        '✓',
        'Conectado ao WiFi FiEB',
        `Olá ${dadosAluno.nome}! Conexão realizada com sucesso.`,
        null,
        500
    );

    notifSistema(
        '✓ Conectado ao WiFi FiEB',
        `Olá ${dadosAluno.nome}! Conexão realizada com sucesso.`
    );

    // 2️⃣ Evento
    setTimeout(() => {
        criarPopup(
            '🎉',
            'NauFest 2026',
            '15–17 de março. O maior evento de inovação.',
            'https://www.senai.br',
            0
        );

        notifSistema(
            '🎉 NauFest 2026',
            '15–17 de março. O maior evento de inovação.',
            'https://www.senai.br'
        );
    }, 3000);

    // 3️⃣ Outro aviso
    setTimeout(() => {
        criarPopup(
            '🚀',
            'Mundo SENAI',
            'Descubra as tendências em tecnologia.',
            'https://www.senai.br',
            0
        );

        notifSistema(
            '🚀 Mundo SENAI',
            'Descubra as tendências em tecnologia.',
            'https://www.senai.br'
        );
    }, 6000);
});

// ===== FINALIZAR =====
function fecharPagina() {
    alert('Você já pode minimizar esta página ou fechar a aba.');
}
