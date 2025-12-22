// ===== DADOS DO ALUNO =====
const dadosAluno = JSON.parse(localStorage.getItem('alunoLogado'));

if (!dadosAluno) {
    window.location.href = 'index.html';
} else {
    document.getElementById('userName').textContent =
        `${dadosAluno.nome} ${dadosAluno.sobrenome}`;
    document.getElementById('turma').textContent = dadosAluno.turma;
    document.getElementById('sala').textContent = dadosAluno.sala;
    document.getElementById('nameLink').textContent =
        `${dadosAluno.nome} ${dadosAluno.sobrenome}`;
}

// ===== NÃO SOU O USUÁRIO =====
document.getElementById('notUser').addEventListener('click', e => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = 'index.html';
});

// ===== SERVICE WORKER =====
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

// ===== BOTÃO CONTINUAR =====
document.getElementById('continuar').addEventListener('click', async () => {
    const aceitou = document.querySelector('#checkbox1').checked;

    if (!aceitou) {
        alert('Você precisa aceitar os Termos de Uso.');
        return;
    }

    localStorage.setItem('fiebConectado', 'true');

    // Pedir permissão APÓS clique
    if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
    }

    // Sempre vai para a página de notificações
    window.location.href = 'mobile-notifications.html';
});
