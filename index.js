const alunos = [
    {nome: 'Julia', sobrenome: 'Oliveira', gmail: 'juliaarb38@gmail.com'},
    {nome: 'Julia', sobrenome: 'Azevedo', gmail: 'julia.m.azevedo@ba.estudante.senai.br'},
    {nome: 'Rafael', sobrenome: 'Magno', gmail: 'rafael.m.reis@ba.estudante.senai.br'},
    {nome: 'Nicole', sobrenome: 'Portela', gmail: 'nicolenpcandeias@gmail.com'},
    {nome: 'Maiane', sobrenome: 'Rocha', gmail: 'maiane12rocha@gmail.com'},
    {nome: 'Kevin', sobrenome: 'Lenon', gmail: 'kevin.l.santos@ba.estudante.senai.br'},
    {nome: 'Thalita', sobrenome: 'Silva', gmail: 'thalita.nascimento@ba.estudante.senai.br'},
    {nome: 'Bruno', sobrenome: 'Santos', gmail: 'bhas795001@gmail.com'}
];

function gerarLetraAleatoria() {
    const alfabetoDoSenai = 'ABCDEFGHIJKLMN';
    const indice = Math.floor(Math.random() * alfabetoDoSenai.length);
    return alfabetoDoSenai[indice];
}

function gerarNumeroAleatorio() {
    return Math.floor(Math.random() * 10);
}

function gerarSala() {
    return `${gerarLetraAleatoria()}${gerarNumeroAleatorio()}`;
}

// Prevenir o envio padrão do formulário
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email').value.trim().toLowerCase();
    const checkbox1 = document.querySelectorAll('input[type="checkbox"]')[0].checked;
    const checkbox2 = document.querySelectorAll('input[type="checkbox"]')[1].checked;
    
    // Validar checkboxes
    if (!checkbox1) {
        alert('Você precisa aceitar as Políticas de Privacidade e Termos de Uso');
        return;
    }
    
    // Buscar aluno pelo email
    const alunoEncontrado = alunos.find(aluno => aluno.gmail.toLowerCase() === emailInput);
    
    if (alunoEncontrado) {
        // Gerar sala e salvar dados no localStorage
        const sala = gerarSala();
        const dadosAluno = {
            nome: alunoEncontrado.nome,
            sobrenome: alunoEncontrado.sobrenome,
            sala: sala,
            turma: '93313'
        };
        
        localStorage.setItem('alunoLogado', JSON.stringify(dadosAluno));
        
        // Redirecionar para página de boas-vindas
        window.location.href = 'welcome.html';
    } else {
        alert('E-mail não encontrado. Por favor, verifique seu e-mail ou registre-se.');
    }
});

// Botão do Facebook (simulação)
document.getElementById('facebook').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Login com Facebook não está disponível no momento.');
});