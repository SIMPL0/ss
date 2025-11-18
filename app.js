// =================================================================
// 1. Configuração do PWA (Service Worker)
// =================================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => console.log('Service Worker registrado com sucesso:', registration.scope))
            .catch(error => console.error('Falha no registro do SW:', error));
    });
}

// =================================================================
// 2. Variáveis e Seletores
// =================================================================
const welcomeScreen = document.getElementById('welcomeScreen');
const dashboard = document.getElementById('dashboard');
const authForm = document.getElementById('authForm');
const authContainer = document.getElementById('authContainer');
const passwordFields = document.getElementById('passwordFields');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const tabButtons = document.querySelectorAll('.tabs .tab');
const inputTypeLabels = document.querySelectorAll('.input-tabs .tab-label');
const contentSections = document.querySelectorAll('.content-section');
const navItems = document.querySelectorAll('.bottom-nav .nav-item');
const coachInstructionsContainer = document.getElementById('coachInstructions');
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const metricsDateInput = document.getElementById('metricsDate');
const weightInput = document.getElementById('weight');
const metricsListContainer = document.getElementById('metricsList');
const totalDaysSpan = document.getElementById('totalDays');
const totalWeightSpan = document.getElementById('totalWeight');

// =================================================================
// 3. Funções de Autenticação e Navegação
// =================================================================

/**
 * Alterna entre as abas de Login e Cadastro.
 * @param {string} tab - 'login' ou 'register'
 */
function switchTab(tab) {
    const isRegister = tab === 'register';
    
    if (isRegister) {
        passwordFields.classList.remove('hidden');
    } else {
        passwordFields.classList.add('hidden');
    }
    
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tab)) {
            btn.classList.add('active');
        }
    });
}

/**
 * Alterna o tipo de input para E-mail ou Telefone.
 * @param {string} type - 'email' ou 'phone'
 */
function switchInputType(type) {
    emailInput.type = type === 'email' ? 'email' : 'tel';
    
    inputTypeLabels.forEach(label => {
        label.classList.remove('active');
        if (label.textContent.toLowerCase().includes(type)) {
            label.classList.add('active');
        }
    });
}

/**
 * Processa o envio do formulário de autenticação.
 * @param {Event} e 
 */
function handleAuthSubmit(e) {
    e.preventDefault();
    
    const name = nameInput.value.trim();
    const emailOrPhone = emailInput.value.trim();
    const isRegister = !passwordFields.classList.contains('hidden');
    
    if (isRegister) {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }
        
        // Simula armazenamento local do usuário
        localStorage.setItem('user', JSON.stringify({
            name,
            emailOrPhone,
            password,
            registrationDate: new Date().toISOString()
        }));
        
        // Feedback de sucesso
        authContainer.innerHTML = `
            <div class="registration-success">
                <p>Bem-vindo(a), ${name}! Sua conta foi criada com sucesso.</p>
                <button id="completeRegistrationBtn" class="auth-btn">Entrar no App</button>
            </div>
        `;
        document.getElementById('completeRegistrationBtn').addEventListener('click', completeRegistration);
    } else {
        // Simula login
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // Verifica se o nome/email/telefone corresponde (simulação simples)
            const user = JSON.parse(storedUser);
            if (user.emailOrPhone === emailOrPhone) {
                completeRegistration();
            } else {
                alert('Credenciais inválidas. Verifique seu e-mail/telefone.');
            }
        } else {
            alert('Usuário não encontrado! Tente se cadastrar primeiro.');
        }
    }
}

/**
 * Finaliza o processo de autenticação e exibe o dashboard.
 */
function completeRegistration() {
    welcomeScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    // Carrega dados iniciais do dashboard
    loadDashboardData();
}

/**
 * Mostra a seção de conteúdo selecionada na navegação inferior.
 * @param {string} tabId - ID da seção a ser exibida.
 * @param {HTMLElement} target - O elemento de navegação clicado.
 */
function showTab(tabId, target) {
    contentSections.forEach(section => {
        section.classList.add('hidden');
    });
    
    document.getElementById(tabId).classList.remove('hidden');
    
    // Atualiza o estilo do item de navegação
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    target.classList.add('active');
}

// =================================================================
// 4. Funções do Dashboard
// =================================================================

/**
 * Carrega as instruções do treinador.
 */
function loadCoachInstructions() {
    const instructions = [
        {date: '2023-11-15', text: 'Hoje você deve concentrar-se na postura correta durante os exercícios de costas.'},
        {date: '2023-11-16', text: 'Não esqueça de manter hidratação adequada durante o treino de pernas.'},
        {date: '2023-11-17', text: 'Foco na alimentação: mais proteínas para recuperação muscular.'}
    ];
    
    coachInstructionsContainer.innerHTML = instructions.map(instr => `
        <li>
            <strong>${instr.date}</strong>: ${instr.text}
        </li>
    `).join('');
}

/**
 * Marca um dia de treino como concluído.
 * @param {string} day - O dia da semana (ex: 'monday').
 */
function markAsCompleted(day) {
    const barElement = document.getElementById(day);
    barElement.classList.add('completed');
    
    // Salva no localStorage
    const completedDays = JSON.parse(localStorage.getItem('completedDays') || '{}');
    completedDays[day] = true;
    localStorage.setItem('completedDays', JSON.stringify(completedDays));
    
    updateChartStats();
}

/**
 * Atualiza as estatísticas de dias concluídos.
 */
function updateChartStats() {
    const completedDays = JSON.parse(localStorage.getItem('completedDays') || '{}');
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const completedCount = days.filter(day => completedDays[day]).length;
    
    totalDaysSpan.textContent = completedCount;
    
    // Atualiza o gráfico de barras
    days.forEach(day => {
        const barElement = document.getElementById(day);
        if (completedDays[day]) {
            barElement.classList.add('completed');
            // Simula altura da barra para visualização
            barElement.style.height = '100%'; 
        } else {
            barElement.classList.remove('completed');
            barElement.style.height = '0%';
        }
    });
}

/**
 * Envia uma mensagem no chat.
 */
function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message) {
        appendMessage(message, 'user');
        messageInput.value = '';
        
        // Simula resposta do treinador
        setTimeout(() => {
            const coachResponse = generateCoachResponse(message);
            appendMessage(coachResponse, 'coach');
        }, 1000);
    }
}

/**
 * Adiciona uma mensagem ao chat.
 * @param {string} text - O texto da mensagem.
 * @param {string} sender - 'user' ou 'coach'.
 */
function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = text;
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Rola para a última mensagem
}

/**
 * Gera uma resposta automática do treinador (simulação).
 * @param {string} userMessage - Mensagem do usuário.
 * @returns {string} - Resposta do treinador.
 */
function generateCoachResponse(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes('jejum')) {
        return 'O jejum intermitente pode ser eficaz, mas priorize sua energia para treinos.';
    } else if (lowerCaseMessage.includes('dieta')) {
        return 'Mantenha uma dieta equilibrada com carboidratos complexos e proteínas magras.';
    } else if (lowerCaseMessage.includes('pernas')) {
        return 'Mantenha a postura ereta durante os agachamentos e não descuide da hidratação.';
    } else {
        return 'Agende uma conversa para maiores esclarecimentos!';
    }
}

/**
 * Carrega o histórico de mensagens do chat.
 */
function loadChatHistory() {
    // Simula carregamento de histórico
    const history = [
        {sender: 'coach', text: 'Bem-vindo ao app! Você está pronto para alcançar seus objetivos.'},
        {sender: 'user', text: 'Quando devo aumentar o peso nos treinos?'},
        {sender: 'coach', text: 'Aguarde até completar 4 semanas, aí faremos uma avaliação.'}
    ];
    
    chatBox.innerHTML = ''; // Limpa o chat antes de carregar
    history.forEach(msg => {
        appendMessage(msg.text, msg.sender);
    });
}

/**
 * Salva uma nova métrica corporal (peso).
 */
function saveMetrics() {
    const date = metricsDateInput.value;
    const weight = weightInput.value;
    
    if (!date || !weight) {
        alert('Preencha a data e o peso!');
        return;
    }
    
    const metric = {
        date: date,
        weight: parseFloat(weight)
    };
    
    // Carrega métricas existentes, garante que é um array
    const metrics = JSON.parse(localStorage.getItem('metrics') || '[]');
    
    // Adiciona nova métrica e ordena por data (mais recente primeiro)
    metrics.push(metric);
    metrics.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Salva no localStorage
    localStorage.setItem('metrics', JSON.stringify(metrics));
    
    // Atualiza a lista de métricas e estatísticas
    updateMetricsList();
    updateWeightStats();
    
    // Limpa campos
    metricsDateInput.value = '';
    weightInput.value = '';
}

/**
 * Atualiza a lista de métricas exibida.
 */
function updateMetricsList() {
    const metrics = JSON.parse(localStorage.getItem('metrics') || '[]');
    metricsListContainer.innerHTML = '';
    
    metrics.forEach(metric => {
        const metricDiv = document.createElement('div');
        metricDiv.className = 'metric-item';
        metricDiv.innerHTML = `<strong>${new Date(metric.date).toLocaleDateString('pt-BR')}</strong>: ${metric.weight} kg`;
        metricsListContainer.appendChild(metricDiv);
    });
}

/**
 * Atualiza as estatísticas de peso perdido.
 */
function updateWeightStats() {
    const metrics = JSON.parse(localStorage.getItem('metrics') || '[]');
    
    if (metrics.length < 2) {
        totalWeightSpan.textContent = '0.00';
        return;
    }
    
    // A lista está ordenada por data decrescente, então o último é o mais antigo
    const firstWeight = metrics[metrics.length - 1].weight; 
    const lastWeight = metrics[0].weight; // O mais recente
    
    const diff = (firstWeight - lastWeight).toFixed(2);
    totalWeightSpan.textContent = diff;
}

/**
 * Carrega todos os dados do dashboard ao iniciar.
 */
function loadDashboardData() {
    loadCoachInstructions();
    loadChatHistory();
    updateChartStats();
    updateMetricsList();
    updateWeightStats();
    
    // Garante que a primeira aba seja exibida
    showTab('instructions', navItems[0]);
}

// =================================================================
// 5. Inicialização e Event Listeners
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 5.1. Event Listeners para Autenticação
    authForm.addEventListener('submit', handleAuthSubmit);
    
    // 5.2. Event Listeners para Tabs de Autenticação
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.textContent.toLowerCase().includes('entrar') ? 'login' : 'register'));
    });
    
    // 5.3. Event Listeners para Tipo de Input
    inputTypeLabels.forEach(label => {
        label.addEventListener('click', () => switchInputType(label.textContent.toLowerCase().includes('e-mail') ? 'email' : 'phone'));
    });
    
    // 5.4. Event Listeners para Navegação Inferior
    navItems.forEach(item => {
        const tabId = item.getAttribute('data-tab');
        item.addEventListener('click', (e) => showTab(tabId, e.currentTarget));
    });
    
    // 5.5. Event Listeners para Treino
    document.querySelectorAll('.workout-grid button').forEach(btn => {
        const day = btn.getAttribute('data-day');
        btn.addEventListener('click', () => markAsCompleted(day));
    });
    
    // 5.6. Event Listeners para Chat
    document.querySelector('#chat .chat-input button').addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 5.7. Event Listeners para Métricas
    document.querySelector('.metrics-form button').addEventListener('click', saveMetrics);
    
    // 5.8. Inicialização da tela
    switchTab('login'); // Inicia na aba de login
    
    // Se o usuário já estiver "logado" (simulação), carrega o dashboard
    if (localStorage.getItem('user')) {
        completeRegistration();
    }
});

// =================================================================
// 6. Funções de Notificação (PWA)
// =================================================================

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Aqui você pode mostrar um botão de instalação customizado se quiser
    console.log('Evento beforeinstallprompt capturado.');
});

window.addEventListener('online', () => {
    showNotification('Você está online', 'Pode sincronizar seus dados agora!');
});

window.addEventListener('offline', () => {
    showNotification('Você está offline', 'As atividades estão sendo salvas localmente e serão sincronizadas quando voltar online.');
});

/**
 * Exibe uma notificação do sistema.
 * @param {string} title - Título da notificação.
 * @param {string} body - Corpo da notificação.
 */
function showNotification(title, body) {
    if (!("Notification" in window)) {
        console.warn('Este navegador não suporta notificações');
        return;
    }
    
    if (Notification.permission === "granted") {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration) {
                registration.showNotification(title, {
                    body: body,
                    icon: 'icons/icon-192x192.png'
                });
            }
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                // Tenta mostrar a notificação novamente
                showNotification(title, body);
            }
        });
    }
}
