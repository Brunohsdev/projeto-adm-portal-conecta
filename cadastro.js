// ===== LISTA DE ALUNOS (mesma do index.js) =====
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

// ===== FUNÇÕES DE GERAÇÃO DE SALA =====
function gerarLetraAleatoria() {
    const alfabetoDoSenai = 'ABCDEFGHIJKLMN';
    const indice = Math.floor(Math.random() * alfabetoDoSenai.length);
    return alfabetoDoSenai[indice];
}

function gerarNumeroAleatorio() {
    return Math.floor(Math.random(1,10));
}

function gerarSala() {
    return `${gerarLetraAleatoria()}${gerarNumeroAleatorio()}`;
}

// ===== FORMATAÇÃO DE CPF =====
const cpfInput = document.getElementById('cpf');

cpfInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    }
});

// ===== VALIDAÇÃO DE CPF =====
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

// ===== GERENCIAMENTO DOS CHECKBOXES =====
const checkboxLabels = document.querySelectorAll('.checkbox-label');
checkboxLabels.forEach(label => {
    label.addEventListener('click', function(e) {
        // Permitir que cliques em links funcionem normalmente
        if (e.target.tagName === 'A') {
            e.preventDefault();
            return;
        }
        
        // Se não clicou no input
        if (e.target.tagName !== 'INPUT') {
            e.preventDefault();
            const input = this.querySelector('input[type="checkbox"]');
            input.checked = !input.checked;
        }
    });
});

// ===== ENVIO DO FORMULÁRIO =====
document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nomeCompleto = document.getElementById('nomeCompleto').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const cpf = document.getElementById('cpf').value.trim();
    const checkbox1 = document.getElementById('checkbox1').checked;
    
    // Validações
    if (!nomeCompleto) {
        alert('Por favor, preencha seu nome completo.');
        return;
    }
    
    if (!email) {
        alert('Por favor, preencha seu e-mail.');
        return;
    }
    
    // Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }
    
    if (!cpf) {
        alert('Por favor, preencha seu CPF.');
        return;
    }
    
    if (!validarCPF(cpf)) {
        alert('CPF inválido. Por favor, verifique o número digitado.');
        return;
    }
    
    if (!checkbox1) {
        alert('Você precisa aceitar as Políticas de Privacidade e os Termos de Uso para continuar.');
        return;
    }
    
    // Verificar se o e-mail está na lista de alunos
    const alunoEncontrado = alunos.find(aluno => aluno.gmail.toLowerCase() === email);
    
    if (alunoEncontrado) {
        // Gerar sala e salvar dados no localStorage
        const sala = gerarSala();
        const dadosAluno = {
            nome: alunoEncontrado.nome,
            sobrenome: alunoEncontrado.sobrenome,
            sala: sala,
            turma: '93313',
            cpf: cpf
        };
        
        localStorage.setItem('alunoLogado', JSON.stringify(dadosAluno));
        
        // Mensagem de sucesso
        alert('Cadastro realizado com sucesso! Você será redirecionado para a página de boas-vindas.');
        
        // Redirecionar para página de boas-vindas
        window.location.href = 'welcome.html';
    } else {
        alert('E-mail não encontrado na base de dados. Entre em contato com a administração.');
    }
});

// ===== ANIMAÇÃO DE FOCO NOS INPUTS =====
const inputs = document.querySelectorAll('.input-field');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.style.transform = 'scale(1.01)';
    });
    
    input.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
    });
});

// ===== PREVENIR LINKS DE REDIRECIONAMENTO =====
document.querySelectorAll('.link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Esta é uma demonstração. Em um ambiente real, este link levaria para as políticas correspondentes.');
    });
});