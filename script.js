/* ============================================
   PORTFÓLIO ACADÊMICO - LÓGICA DE INTERFACE
   JavaScript Vanilla (ES6+) - Sem Frameworks
   
   Arquitetura: Separação de Responsabilidades
   - ThemeManager: Gerencia alternância de temas
   - FormValidator: Valida e gerencia feedback de formulário
   - DOMUtility: Utilitários para manipulação do DOM
   ============================================ */

/* ============================================
   1. THEME MANAGER
   
   Responsabilidade: Gerenciar alternância de temas (claro/escuro)
   com persistência em localStorage e transições suaves.
   
   Justificativa de padrão:
   - Encapsulamento em objeto IIFE (Immediately Invoked Function Expression)
     para evitar poluição do escopo global
   - Métodos com prefixo _ (underscore) para indicar privacidade
   - localStorage para memória da preferência do usuário
   - Padrão Revealing Module: apenas métodos necessários são expostos
   ============================================ */

const ThemeManager = (() => {
    // Constantes privadas
    const THEME_KEY = 'user-theme-preference';
    const THEME_LIGHT = 'light';
    const THEME_DARK = 'dark';
    
    // Elementos do DOM (cache para melhor performance)
    const _btnTema = document.getElementById('btn-tema');
    const _html = document.documentElement;
    const _body = document.body;
    
    /**
     * Obtém o tema preferido pelo usuário.
     * Ordem de preferência:
     * 1. localStorage (preferência salva anteriormente)
     * 2. Preferência do sistema operacional (prefers-color-scheme)
     * 3. Tema claro (fallback)
     * 
     * Justificativa: Respeita preferências do usuário em múltiplos níveis
     * 
     * @returns {string} 'light' ou 'dark'
     */
    const _getPreferredTheme = () => {
        // Verifica se há preferência salva no localStorage
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) return saved;
        
        // Verifica preferência do sistema (dark mode do SO)
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEME_DARK;
        }
        
        return THEME_LIGHT;
    };
    
    /**
     * Aplica o tema ao documento
     * 
     * Justificativa: Aplicar ao [data-theme] no HTML permite
     * que o CSS use seletores de atributo para alternância.
     * Isso é mais escalável e semântico que adicionar/remover classes.
     * 
     * Comparação:
     * ❌ Ruins: classList.toggle('tema-escuro')
     * ✅ Bom:  setAttribute('data-theme', 'dark')
     * 
     * @param {string} theme - 'light' ou 'dark'
     */
    const _applyTheme = (theme) => {
        // Atualiza atributo data-theme para ativar variáveis CSS
        _html.setAttribute('data-theme', theme);
        _body.classList.toggle('tema-escuro', theme === THEME_DARK);
        
        // Atualiza atributo ARIA para acessibilidade (leitores de tela)
        _btnTema.setAttribute('aria-checked', theme === THEME_DARK);
        
        // Salva preferência no localStorage (persistência)
        localStorage.setItem(THEME_KEY, theme);
        
        // Dispara evento customizado para outros scripts ouvirem
        // Padrão Observer: desacoplamento entre módulos
        document.dispatchEvent(new CustomEvent('themechange', { 
            detail: { theme } 
        }));
    };
    
    /**
     * Alterna entre tema claro e escuro
     */
    const _toggleTheme = () => {
        const currentTheme = _html.getAttribute('data-theme') || THEME_LIGHT;
        const newTheme = currentTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
        _applyTheme(newTheme);
    };
    
    /**
     * Inicializa o sistema de temas
     * Chamado automaticamente na carga do documento
     */
    const init = () => {
        if (!_btnTema) {
            console.warn('Botão de tema não encontrado no DOM');
            return;
        }
        
        // Aplica tema preferido na inicialização
        const preferred = _getPreferredTheme();
        _applyTheme(preferred);
        
        // Listener para o botão de alternância
        _btnTema.addEventListener('click', () => {
            _toggleTheme();
        });
        
        // Listener para mudanças de preferência do sistema (em tempo real)
        // Exemplo: usuário muda configuração do SO de light para dark
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                const newTheme = e.matches ? THEME_DARK : THEME_LIGHT;
                _applyTheme(newTheme);
            });
        }
    };
    
    // API pública do módulo (Revealing Module Pattern)
    // Apenas métodos necessários são expostos
    return {
        init,
        // Método público para outras partes do código alterarem tema se necessário
        setTheme: (theme) => {
            if ([THEME_LIGHT, THEME_DARK].includes(theme)) {
                _applyTheme(theme);
            }
        }
    };
})();

/* ============================================
   2. FORM VALIDATOR
   
   Responsabilidade: Validar formulário, exibir erros inline
   e feedback visual sem usar alert().
   
   Justificativa:
   - Regex para validação de email (RFC 5322 simplificado)
   - Mensagens de erro no DOM para acessibilidade (role="alert")
   - Estados visuais (success/error) com classes CSS
   - Aria-live para anunciar mudanças a leitores de tela
   - Validação em tempo real melhora UX
   ============================================ */

const FormValidator = (() => {
    const FORM_SELECTORS = {
        form: '#form-contato',
        nome: '#nome',
        email: '#email',
        mensagem: '#mensagem',
        submit: '.btn-submit',
        status: '#form-status'
    };
    
    const ERROR_MESSAGES = {
        nome: 'O nome deve ter no mínimo 3 caracteres',
        email: 'Por favor, insira um email válido',
        mensagem: 'A mensagem deve ter no mínimo 10 caracteres',
        geral: 'Verifique os campos em vermelho antes de enviar'
    };
    
    const SUCCESS_MESSAGE = 'Mensagem enviada com sucesso! Obrigado pelo contato.';
    
    // Regex para validação de email (RFC 5322 simplificado)
    // Justificativa: Validação no frontend é UX; validação real deve ocorrer no servidor
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Cache de elementos do DOM (melhor performance: querySelector só uma vez)
    const _form = document.querySelector(FORM_SELECTORS.form);
    const _nome = document.querySelector(FORM_SELECTORS.nome);
    const _email = document.querySelector(FORM_SELECTORS.email);
    const _mensagem = document.querySelector(FORM_SELECTORS.mensagem);
    const _submit = document.querySelector(FORM_SELECTORS.submit);
    const _status = document.querySelector(FORM_SELECTORS.status);
    
    /**
     * Valida comprimento de campo de texto
     * @param {string} value - Valor do campo
     * @param {number} minLength - Comprimento mínimo
     * @returns {boolean}
     */
    const _isValidLength = (value, minLength) => {
        return value.trim().length >= minLength;
    };
    
    /**
     * Valida formato de email usando regex
     * 
     * Expressão regular explicada:
     * ^[^\s@]+     - começa com 1+ caracteres que não são espaço nem @
     * @            - literal @
     * [^\s@]+      - 1+ caracteres que não são espaço nem @
     * \.           - literal ponto
     * [^\s@]+$     - termina com 1+ caracteres que não são espaço nem @
     * 
     * @param {string} email - Email a validar
     * @returns {boolean}
     */
    const _isValidEmail = (email) => {
        return EMAIL_REGEX.test(email.trim());
    };
    
    /**
     * Exibe mensagem de erro para um campo específico
     * 
     * Justificativa: Em vez de alert() (bloqueia UX), mostramos erro inline
     * com classe CSS para estilo visual e role="alert" para acessibilidade.
     * Isso é mais profissional e inclusivo.
     * 
     * @param {HTMLElement} field - Campo que contém erro
     * @param {string} fieldName - Nome do campo (nome, email, mensagem)
     */
    const _showFieldError = (field, fieldName) => {
        field.classList.add('erro');
        field.classList.remove('sucesso');
        
        // Obtém elemento de mensagem de erro associado
        const errorElement = document.getElementById(`erro-${fieldName}`);
        if (errorElement) {
            errorElement.textContent = ERROR_MESSAGES[fieldName] || 'Campo inválido';
            errorElement.classList.add('visible');
        }
        
        // Foco automático no primeiro campo com erro (acessibilidade)
        if (!_form.getAttribute('data-focus-set')) {
            field.focus();
            _form.setAttribute('data-focus-set', 'true');
        }
    };
    
    /**
     * Remove mensagem de erro para um campo
     * @param {HTMLElement} field - Campo para limpar erro
     * @param {string} fieldName - Nome do campo
     */
    const _clearFieldError = (field, fieldName) => {
        field.classList.remove('erro');
        
        const errorElement = document.getElementById(`erro-${fieldName}`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('visible');
        }
    };
    
    /**
     * Marca campo como válido (sucesso)
     * Feedback visual positivo durante preenchimento
     * @param {HTMLElement} field - Campo válido
     */
    const _markFieldSuccess = (field) => {
        field.classList.remove('erro');
        field.classList.add('sucesso');
    };
    
    /**
     * Valida todos os campos do formulário
     * Chamado ao submeter e em tempo real
     * @returns {boolean} true se tudo válido, false caso contrário
     */
    const _validateAllFields = () => {
        _form.removeAttribute('data-focus-set'); // Reset para refocar em erro
        
        const nomeValid = _isValidLength(_nome.value, 3);
        const emailValid = _isValidEmail(_email.value);
        const mensagemValid = _isValidLength(_mensagem.value, 10);
        
        // Processa cada campo com feedback individual
        if (nomeValid) {
            _clearFieldError(_nome, 'nome');
            _markFieldSuccess(_nome);
        } else {
            _showFieldError(_nome, 'nome');
        }
        
        if (emailValid) {
            _clearFieldError(_email, 'email');
            _markFieldSuccess(_email);
        } else {
            _showFieldError(_email, 'email');
        }
        
        if (mensagemValid) {
            _clearFieldError(_mensagem, 'mensagem');
            _markFieldSuccess(_mensagem);
        } else {
            _showFieldError(_mensagem, 'mensagem');
        }
        
        return nomeValid && emailValid && mensagemValid;
    };
    
    /**
     * Exibe mensagem de status (sucesso ou erro)
     * Usa aria-live="polite" para anunciar a leitores de tela
     * 
     * Acessibilidade: role="status" + aria-live permite que
     * assistentes de voz leiam mudanças dinamicamente
     * 
     * @param {string} type - 'sucesso' ou 'erro'
     * @param {string} message - Mensagem a exibir
     */
    const _showStatus = (type, message) => {
        _status.textContent = message;
        _status.className = `form-status ${type}`;
    };
    
    /**
     * Limpa mensagem de status
     */
    const _clearStatus = () => {
        _status.textContent = '';
        _status.className = 'form-status';
    };
    
    /**
     * Simula envio do formulário para servidor
     * Em produção, seria uma chamada AJAX/Fetch para backend
     * 
     * Padrão async/await: Código mais legível que .then()
     * 
     * @returns {Promise<boolean>} Promessa que resolve para sucesso/falha
     */
    const _submitToServer = async () => {
        // Desabilita botão durante envio (previne submissão dupla)
        _submit.disabled = true;
        _submit.textContent = 'Enviando...';
        
        try {
            // Simula delay de rede (em produção, seria fetch real)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // EM PRODUÇÃO, você faria assim:
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         nome: _nome.value,
            //         email: _email.value,
            //         mensagem: _mensagem.value
            //     })
            // });
            // 
            // if (!response.ok) throw new Error('Erro na resposta do servidor');
            // 
            // const result = await response.json();
            // return result.success;
            
            return true; // Simula sucesso
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            _showStatus('erro', 'Erro ao enviar. Tente novamente.');
            return false;
        } finally {
            // Restaura botão em qualquer caso (sucesso ou erro)
            _submit.disabled = false;
            _submit.textContent = 'Enviar Mensagem';
        }
    };
    
    /**
     * Handler do evento submit do formulário
     * Orquestração: validação -> envio -> tratamento de resposta
     * 
     * Fluxo:
     * 1. Previne comportamento padrão de submit
     * 2. Limpa mensagens anteriores
     * 3. Valida todos campos
     * 4. Se válido, tenta enviar
     * 5. Exibe feedback apropriado
     * 
     * @param {Event} event - Evento do formulário
     */
    const _handleSubmit = async (event) => {
        event.preventDefault();
        _clearStatus();
        
        // Valida todos os campos
        if (!_validateAllFields()) {
            _showStatus('erro', ERROR_MESSAGES.geral);
            return;
        }
        
        // Tenta enviar para servidor
        const success = await _submitToServer();
        
        if (success) {
            _showStatus('sucesso', SUCCESS_MESSAGE);
            _form.reset();
            
            // Limpa estado de sucesso dos campos após 3 segundos
            // Permite usuário ver o feedback antes de desaparecer
            setTimeout(() => {
                [_nome, _email, _mensagem].forEach(field => {
                    field.classList.remove('sucesso');
                });
                _clearStatus();
            }, 3000);
        } else {
            _showStatus('erro', 'Falha ao enviar. Verifique os dados e tente novamente.');
        }
    };
    
    /**
     * Listener para validação em tempo real
     * Valida campo conforme usuário digita (feedback imediato)
     * 
     * Justificativa: Melhora UX permitindo correção antes de envio.
     * Usuário vê ✓ verde imediatamente quando acerta.
     * 
     * Event: 'input' é disparado a cada caractere
     * (vs 'change' que só dispara ao sair do campo)
     * 
     * @param {Event} event - Evento de input
     */
    const _handleFieldValidation = (event) => {
        const field = event.target;
        const fieldName = field.id;
        
        // Obtém validação específica do campo
        let isValid = false;
        if (fieldName === 'nome') {
            isValid = _isValidLength(field.value, 3);
        } else if (fieldName === 'email') {
            isValid = _isValidEmail(field.value);
        } else if (fieldName === 'mensagem') {
            isValid = _isValidLength(field.value, 10);
        }
        
        // Atualiza estado visual apenas se há conteúdo
        if (isValid && field.value.trim().length > 0) {
            _markFieldSuccess(field);
        } else {
            field.classList.remove('sucesso');
        }
    };
    
    /**
     * Inicializa validador de formulário
     * Registra todos os event listeners
     */
    const init = () => {
        if (!_form) {
            console.warn('Formulário de contato não encontrado no DOM');
            return;
        }
        
        // Listener para submissão do formulário
        _form.addEventListener('submit', _handleSubmit);
        
        // Listeners para validação em tempo real
        // Usuário vê feedback conforme digita
        _nome.addEventListener('input', _handleFieldValidation);
        _email.addEventListener('input', _handleFieldValidation);
        _mensagem.addEventListener('input', _handleFieldValidation);
    };
    
    return { init };
})();

/* ============================================
   3. DOM UTILITY (Utilitários gerais do DOM)
   
   Responsabilidade: Funções auxiliares de manipulação do DOM
   Padrão: Módulo reutilizável e escalável
   ============================================ */

const DOMUtility = (() => {
    /**
     * Suave scroll para elemento (usado em links de âncora)
     * 
     * Tecnologia moderna: CSS propriedade scroll-behavior: smooth
     * JavaScript adiciona fallback e controle programático
     * 
     * Benefício: Melhora UX em navegação interna do site
     */
    const enhanceSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (event) => {
                const href = link.getAttribute('href');
                if (href === '#') return; // Pula links vazios
                
                const target = document.querySelector(href);
                if (target) {
                    event.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // Atualiza URL sem fazer scroll duplo
                    // Permite usar botão "voltar" do navegador
                    window.history.pushState(null, null, href);
                }
            });
        });
    };
    
    /**
     * Lazy loading de imagens com Intersection Observer API
     * 
     * Justificativa: Melhora performance ao carregar imagens
     * conforme aparecem na viewport (não todas de uma vez).
     * 
     * Intersection Observer API:
     * - Nativa do navegador (não requer biblioteca)
     * - Eficiente em performance
     * - Uso: Observar quando elementos ficam visíveis
     */
    const lazyLoadImages = () => {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // EM PRODUÇÃO você faria:
                        // img.src = img.dataset.src;
                        // img.removeAttribute('loading');
                        
                        // Por agora, apenas marca como visível
                        img.classList.add('loaded');
                        imageObserver.unobserve(img); // Para de observar
                    }
                });
            });
            
            // Observa todas as imagens com loading="lazy"
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    };
    
    /**
     * Scroll Reveal Animações
     * 
     * Adiciona classe .active em elementos com .reveal quando entram na viewport.
     * Utiliza IntersectionObserver para alta performance sem sobrecarregar evento de scroll.
     */
    const scrollReveal = () => {
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                threshold: 0.15,
                rootMargin: "0px 0px -30px 0px"
            });
            
            document.querySelectorAll('.reveal').forEach(el => {
                revealObserver.observe(el);
            });
        } else {
            document.querySelectorAll('.reveal').forEach(el => {
                el.classList.add('active');
            });
        }
    };
    
    /**
     * Inicializa utilitários do DOM
     */
    const init = () => {
        enhanceSmoothScroll();
        lazyLoadImages();
        scrollReveal();
    };
    
    return { init };
})();

/* ============================================
   4. INITIALIZATION (Inicializa tudo quando DOM carrega)
   
   Padrão: DOMContentLoaded event
   
   Justificativa: Aguarda DOMContentLoaded para garantir
   que todos elementos estão no DOM antes de manipular.
   
   Fases do carregamento:
   1. HTML parsing
   2. DOMContentLoaded (acionado)
   3. Fetch de recursos (imagens, etc)
   4. load event (acionado)
   
   Usamos DOMContentLoaded (mais rápido que load)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfólio Acadêmico Carregado com Sucesso');
    console.log('📦 Módulos ativados: ThemeManager, FormValidator, DOMUtility');
    
    // Inicia ThemeManager (sistema de temas)
    ThemeManager.init();
    
    // Inicia FormValidator (validação de formulário)
    FormValidator.init();
    
    // Inicia DOMUtility (utilidades gerais)
    DOMUtility.init();
});

/* ============================================
   5. TRATAMENTO DE ERROS GLOBAL
   
   Responsabilidade: Capturar erros não tratados
   
   Justificativa: Evita que erros quebrem a aplicação
   silenciosamente. Facilita debugging.
   ============================================ */

window.addEventListener('error', (event) => {
    console.error('❌ Erro não tratado:', event.error);
    // Em produção, envie para serviço de logging (Sentry, LogRocket, DataDog)
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promise rejection não tratada:', event.reason);
    // Em produção, envie para serviço de logging
});
