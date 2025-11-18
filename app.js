// Registra Service Worker para PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker registrado'))
        .catch(error => console.log('Falha no registro do SW:', error));
}

// Animação da tela inicial
document.addEventListener('DOMContentLoaded', () => {
    // ... Código de inicialização ...
});

// Função para alternar entre login/cadastro
function switchTab(tab) {
    const registerFields = document.getElementById('passwordFields');
    const form = document.getElementById('authForm');
    
    if (tab === 'register') {
        registerFields.classList.remove('hidden');
    } else {
        registerFields.classList.add('hidden');
    }
    
    // Atualiza classes das tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tabElement => {
        tabElement.classList.remove('active');
        if ((tab === 'login' && tabElement.textContent === 'Entrar') || 
            (tab === 'register' && tabElement.textContent === 'Cadastrar')) {
            tabElement.classList.add('active');
        }
    });
}

// Função para alternar tipo de entrada (email/telefone)
function switchInputType(type) {
    const emailInput = document.getElementById('emailInput');
    const labels = document.querySelectorAll('.tab-label');
    
    // Atualiza tipo do input
    emailInput.type = type === 'email' ? 'email' : 'tel';
    
    // Atualiza classes das tabs
    labels.forEach(label => {
        label.classList.remove('active');
        if (label.textContent.toLowerCase() === type) {
            label.classList.add('active');
        }
    });
}

// Simulação de login/cadastro
document.getElementById('authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Pega dados do formulário
    const name = document.getElementById('name').value;
    const emailOrPhone = document.getElementById('emailInput').value;
    const isRegister = !document.getElementById('passwordFields').classList.contains('hidden');
    
    if (isRegister) {
        // Processa cadastro
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Valida senhas
        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }
        
        // Simula armazenamento local
        localStorage.setItem('user', JSON.stringify({
            name,
            emailOrPhone,
            password,
            registrationDate: new Date().toISOString()
        }));
        
        // Atualiza interface
        document.getElementById('authContainer').innerHTML = `
            <div class="registration-success">
                <p>${name}, sua conta foi criada com sucesso!</p>
                <button onclick="completeRegistration()">Entrar no App</button>
            </div>
        `;
    } else {
        // Processa login
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // Simula login bem-sucedido
            document.getElementById('welcomeScreen').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
        } else {
            alert('Usuário não encontrado! Tente se cadastrar primeiro.');
        }
    }
});

function completeRegistration() {
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
}

// Função para mostrar abas
function showTab(tabId) {
    // Esconde todas as abas
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Mostra a aba selecionada
    document.getElementById(tabId).classList.remove('hidden');
    
    // Atualiza estilo das abas inferior
    document.querySelectorAll('.nav-item').forEach(item => {
        item.style.transform = 'none';
    });
    
    event.currentTarget.style.transform = 'scale(1.1)';
}

// Simulação de dados do treinador
function loadCoachInstructions() {
    const instructions = [
        {date: '2023-11-15', text: 'Hoje você deve concentrar-se na postura correta durante os exercícios de costas.'},
        {date: '2023-11-16', text: 'Não esqueça de manter hidratação adequada durante o treino de pernas.'},
        {date: '2023-11-17', text: 'Foco na alimentação: mais proteínas para recuperação muscular.'}
    ];
    
    const container = document.getElementById('coachInstructions');
    container.innerHTML = instructions.map(instr => `
        <li>
            <strong>${instr.date}</strong>: ${instr.text}
        </li>
    `).join('');
}

// Função para marcar treino como concluído
function markAsCompleted(day) {
    const barElement = document.getElementById(day);
    barElement.classList.add('completed');
    
    // Salva no localStorage
    const completedDays = JSON.parse(localStorage.getItem('completedDays') || '{}');
    completedDays[day] = true;
    localStorage.setItem('completedDays', JSON.stringify(completedDays));
    
    updateChartStats();
}

// Atualiza estatísticas do gráfico
function updateChartStats() {
    const completedDays = JSON.parse(localStorage.getItem('completedDays') || '{}');
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const completedCount = days.filter(day => completedDays[day]).length;
    
    document.getElementById('totalDays').textContent = completedCount;
}

// Função para enviar mensagens no chat
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
        // Cria elemento da mensagem
        const chatBox = document.getElementById('chatBox');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.textContent = message;
        
        chatBox.appendChild(messageDiv);
        input.value = '';
        
        // Simula resposta do treinador
        setTimeout(() => {
            const coachMessage = document.createElement('div');
            coachMessage.className = 'message';
            coachMessage.textContent = 'Resposta do treinador: ' + generateCoachResponse(message);
            chatBox.appendChild(coachMessage);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1000);
    }
}

// Gera resposta automática para mensagens
function generateCoachResponse(userMessage) {
    // Simula processamento simples
    return userMessage.includes('jejum') ? 'O jejum intermitente pode ser eficaz, mas priorize sua energia para treinos.' :
           userMessage.includes('dieta') ? 'Mantenha uma dieta equilibrada com carboidratos complexos e proteínas magras.' :
           userMessage.includes('pernas') ? 'Mantenha a postura ereta durante os agachamentos e não descuide da hidratação.' :
           'Agende uma conversa para maiores esclarecimentos!';
}

// Carrega histórico de mensagens
function loadChatHistory() {
    // Simula carregamento de histórico
    const chatBox = document.getElementById('chatBox');
    const history = [
        {user: 'Treinador', text: 'Bem-vindo ao app! Você está pronto para alcançar seus objetivos.'},
        {user: 'Você', text: 'Quando devo aumentar o peso nos treinos?'},
        {user: 'Treinador', text: 'Aguarde até completar 4 semanas, aí faremos uma avaliação.'}
    ];
    
    history.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.textContent = msg.text;
        chatBox.appendChild(messageDiv);
    });
}

// Função para salvar métricas
function saveMetrics() {
    const date = document.getElementById('metricsDate').value;
    const weight = document.getElementById('weight').value;
    
    if (!date || !weight) {
        alert('Preencha todos os campos!');
        return;
    }
    
    // Cria objeto da métrica
    const metric = {
        date: date,
        weight: parseFloat(weight)
    };
    
    // Carrega métricas existentes
    const metrics = JSON.parse(localStorage.getItem('metrics') || '[]');
    
    // Adiciona nova métrica
    metrics.push(metric);
    
    // Salva no localStorage
    localStorage.setItem('metrics', JSON.stringify(metrics));
    
    // Atualiza gráfico
    updateBars();
    
    // Atualiza lista de métricas
    updateMetricsList(metric);
    
    // Atualiza estatísticas de peso perdido
    updateWeightStats();
    
    // Limpa campos
    document.getElementById('metricsDate').value = '';
    document.getElementById('weight').value = '';
}

// Atualiza a lista de métricas
function updateMetricsList(metric) {
    const container = document.getElementById('metricsList');
    
    // Cria elemento para nova métrica
    const metricDiv = document.createElement('div');
    metricDiv.className = 'metric-item';
    metricDiv.innerHTML = `<strong>${metric.date}</strong>: ${metric.weight} kg`;
    
    container.prepend(metricDiv);
}

// Atualiza estatísticas de peso
function updateWeightStats() {
    const metrics = JSON.parse(localStorage.getItem('metrics') || '[]');
    if (metrics.length < 2) return;
    
    // Calcula diferença entre primeira e última métrica
    const firstWeight = metrics[0].weight;
    const lastWeight = metrics[metrics.length - 1].weight;
    
    // Calcula diferença e exibe
    const diff = (firstWeight - lastWeight).toFixed(2);
    document.getElementById('totalWeight').textContent = diff;
}

// Atualiza as barras do gráfico com base nos dados do usuário
function updateBars() {
    const metrics = JSON.parse(localStorage.getItem('metrics') || '[]');
    
    if (metrics.length > 0) {
        metrics.forEach((metric, index) => {
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            if (index < days.length) {
                const barElement = document.getElementById(days[index]);
                barElement.classList.add('completed');
                
                // Calcula porcentagem com base no peso para preencher a barra
                const percentage = Math.min(100, (metric.weight / 100) * 100);
                barElement.style.height = `${percentage}%`;
                barElement.style.backgroundColor = getColorFromPercentage(percentage);
            }
        });
    }
}

function getColorFromPercentage(percentage) {
    // Linear gradient from red to green based on percentage
    const red = percentage < 50 ? 255 : Math.round(255 * (1 - (percentage - 50) / 50) * 0.8);
    const green = percentage < 50 ? Math.round(255 * (0.2 + (percentage / 50) * 0.8)) : 255;
    return `rgb(${red}, ${green}, 0)`;
}

// Função para carregar todos os dados ao iniciar o dashboard
document.getElementById('dashboard')?.addEventListener('load', () => {
    loadCoachInstructions();
    loadChatHistory();
    updateBars();
    updateChartStats();
});

// Notificação de instalação do PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Previne o prompt automático
    e.preventDefault();
    // Armazena o evento para usar posteriormente
    deferredPrompt = e;
    
    // Mostra o botão de instalação
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.style.display = 'block';
        installBtn.addEventListener('click', () => {
            // Mostra o prompt de instalação
            deferredPrompt.prompt();
            // Espera a escolha do usuário
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Usuário aceitou a instalação');
                }
                deferredPrompt = null;
            });
        });
    }
});

// Monitora o offline e online para notificações
window.addEventListener('online', () => {
    showNotification('Você está online', 'Pode sincronizar seus dados agora!');
});

window.addEventListener('offline', () => {
    showNotification('Você está offline', 'As atividades estão sendo salvas localmente e serão sincronizadas quando voltar online.');
});

function showNotification(title, body) {
    if (!("Notification" in window)) {
        console.log('Este navegador não suporta notificações');
        return;
    }
    
    if (Notification.permission === "granted") {
        navigator.serviceWorker.getRegistration().then(registration => {
            registration.showNotification(title, {
                body: body,
                icon: 'icons/icon-192x192.png'
            });
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                navigator.serviceWorker.getRegistration().then(registration => {
                    registration.showNotification(title, {
                        body: body,
                        icon: 'icons/icon-192x192.png'
                    });
                });
            }
        });
    }
}