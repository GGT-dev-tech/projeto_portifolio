# 🚀 Portfólio Acadêmico - Gustavo Gomes

## Sobre Este Projeto

Portfólio profissional desenvolvido com **HTML5 semântico, CSS3 puro (Vanilla) e JavaScript ES6+** seguindo rigorosamente os padrões de uma atividade acadêmica de Engenharia de Software.

**Características Principais:**
- ✅ Zero frameworks (Bootstrap, Tailwind, React)
- ✅ 100% Vanilla JS (sem jQuery, Angular, Vue)
- ✅ Layout responsivo (Mobile-First)
- ✅ Sistema de temas (Light/Dark) com persistência
- ✅ Validação de formulário sem alerts
- ✅ Acessibilidade WCAG 2.1
- ✅ Performance otimizada
- ✅ Código amplamente comentado

---

## 📁 Estrutura do Projeto

```
projeto_portifolio/
├── index.html          # Estrutura semântica (260+ linhas)
├── style.css           # Estilos profissionais (900+ linhas)
├── script.js           # Lógica modular (600+ linhas)
├── README.md           # Documentação
└── img/
    ├── projeto1.jpg    # Sistema Inteligente de Propriedades
    ├── projeto2.jpg    # Sistema de Gestão Escolar
    └── projeto3.jpg    # Sistema de Controle de Portaria
```

---

## 🎨 Arquitetura Técnica

### HTML5 - Estrutura Semântica

- `<header>`: Navegação principal
- `<main>`: Conteúdo principal
- `<section>`: Agrupamento lógico de conteúdo
- `<article>`: Conteúdo independente (cards, posts)
- `<figure> + <figcaption>`: Imagens com semântica
- `<footer>`: Informações finais e links sociais
- Atributos ARIA: `role`, `aria-label`, `aria-required`, `aria-live`

**Benefício:** Melhor SEO, acessibilidade, e reconhecimento de conteúdo por search engines.

### CSS3 - Design System Modular

#### 1. **CSS Variables (Custom Properties)**

```css
:root {
    /* Esquema de cores - 16 variáveis */
    --color-primary: #2563eb;
    --color-secondary: #1e40af;
    --color-bg: #ffffff;
    --color-text: #1f2937;
    
    /* Espaçamento - 7 níveis */
    --spacing-xs: 0.25rem;  /* 4px */
    --spacing-md: 1rem;     /* 16px */
    --spacing-xl: 3rem;     /* 48px */
    
    /* Tipografia */
    --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
    --font-size-base: 1rem;
    --font-size-2xl: 1.5rem;
    
    /* Transições (Motion Design) */
    --transition-fast: 150ms ease-in-out;
}

/* Tema Escuro: Sobrescreve variáveis automaticamente */
[data-theme="dark"] {
    --color-bg: #1f2937;
    --color-text: #f3f4f6;
}
```

**Justificativa:** Herança automática + alternância de temas sem duplicar regras CSS.

#### 2. **Layouts Responsivos**

**Flexbox** (para componentes lineares):
```css
.nav-list {
    display: flex;
    gap: var(--spacing-lg);
    justify-content: space-between;
    align-items: center;
}
```

**CSS Grid** (para layouts 2D):
```css
.portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-xl);
}
```

**Media Queries** (Mobile-First):
```css
/* Base: Mobile */
.portfolio-grid {
    grid-template-columns: 1fr;
}

/* Tablets */
@media (min-width: 768px) {
    .portfolio-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Desktops */
@media (min-width: 1024px) {
    .portfolio-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

### JavaScript - Padrões Profissionais

#### 1. **IIFE (Immediately Invoked Function Expression) + Revealing Module**

```javascript
const ThemeManager = (() => {
    // Privadas (escopo fechado)
    const _applyTheme = (theme) => {
        // ...
    };
    
    // Públicas (expostas na API)
    return {
        init: () => { /* ... */ },
        setTheme: (theme) => { /* ... */ }
    };
})();

// Uso:
ThemeManager.init();
```

**Benefício:** Encapsulamento + evita poluição do escopo global.

#### 2. **localStorage para Persistência**

```javascript
const THEME_KEY = 'user-theme-preference';

// Salvar
localStorage.setItem(THEME_KEY, 'dark');

// Recuperar
const saved = localStorage.getItem(THEME_KEY);
```

#### 3. **Validação em Tempo Real com Regex**

```javascript
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const _isValidEmail = (email) => {
    return EMAIL_REGEX.test(email.trim());
};
```

#### 4. **Async/Await para Requisições**

```javascript
const _submitToServer = async () => {
    _submit.disabled = true;
    
    try {
        // Em produção:
        // const response = await fetch('/api/contact', {...});
        // const result = await response.json();
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        return true;
    } catch (error) {
        console.error('Erro ao enviar:', error);
        return false;
    } finally {
        _submit.disabled = false;
    }
};
```

#### 5. **Intersection Observer para Lazy Loading**

```javascript
const lazyLoadImages = () => {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;  // Carrega apenas quando visível
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            observer.observe(img);
        });
    }
};
```

---

## 🎯 Validação de Formulário

### Sem `alert()`! ❌

```javascript
// ANTES (ruim):
if (!isValid) {
    alert("Campo inválido!");  // ❌ Bloqueia UX
}

// DEPOIS (bom):
if (!isValid) {
    field.classList.add('erro');
    errorElement.textContent = "Campo inválido!";
}
```

### Estados Visuais

| Estado | Classe CSS | Visual |
|--------|-----------|--------|
| Válido | `.sucesso` | Borda verde |
| Erro | `.erro` | Borda vermelha |
| Enviando | `.disabled` | Botão desabilitado |
| Sucesso | `.form-status.sucesso` | Mensagem verde |

### Validações Implementadas

✅ **Nome:** Mínimo 3 caracteres  
✅ **Email:** Formato válido (regex)  
✅ **Mensagem:** Mínimo 10 caracteres  
✅ **Feedback:** Imediato (evento `input`)  
✅ **Foco automático:** Primeiro erro  

---

## 🌍 Acessibilidade (WCAG 2.1)

### Atributos ARIA Implementados

```html
<!-- Navegação -->
<nav role="navigation" aria-label="Navegação principal">

<!-- Botão de tema -->
<button role="switch" aria-checked="false" aria-label="Alternar tema">

<!-- Seções -->
<section aria-labelledby="titulo-sobre">

<!-- Erros de formulário -->
<span role="alert" id="erro-email"></span>

<!-- Status dinâmico -->
<div role="status" aria-live="polite" id="form-status"></div>
```

### Contraste de Cores (WCAG AA)

- **Texto normal:** Contraste mínimo 4.5:1
- **Texto grande:** Contraste mínimo 3:1
- **Tema escuro:** Cores ajustadas para acessibilidade

### Navegação por Teclado

- ✅ Tab funciona em todos elementos interativos
- ✅ Enter ativa botões
- ✅ Scroll suave (CSS)
- ✅ Âncoras com `scroll-behavior: smooth`

---

## 📊 Performance

### Otimizações Implementadas

1. **CSS Variables** (zero overhead)
2. **Lazy Loading** (`loading="lazy"` + Intersection Observer)
3. **Event Delegation** (um listener para múltiplos elementos)
4. **Cache DOM** (querySelector chamado uma única vez)
5. **Compressão Gzip** (ideal para produção)
6. **Media Queries** (estilos apenas necessários por breakpoint)

### Métrica de Performance

```
First Contentful Paint (FCP): < 1.5s
Largest Contentful Paint (LCP): < 2.5s
Cumulative Layout Shift (CLS): < 0.1
```

---

## 🔒 Segurança

### Vulnerabilidades Evitadas

❌ **Não usar `innerHTML`**
```javascript
// ❌ INSEGURO (XSS):
element.innerHTML = userInput;

// ✅ SEGURO:
element.textContent = userInput;
```

✅ **Validação no Frontend E Backend**
```javascript
// Frontend: UX imediato
if (!isValidEmail(email)) {
    showError("Email inválido");
}

// Backend: OBRIGATÓRIO em produção
POST /api/contact
Body: { nome, email, mensagem }
// Backend valida NOVAMENTE
```

✅ **Proteção contra CSRF**
```html
<!-- Em produção, usar token CSRF -->
<form method="POST" action="/api/contact">
    <input type="hidden" name="csrf_token" value="...">
</form>
```

---

## 🚀 Como Usar

### Abrir Localmente

```bash
# Clone ou baixe o projeto
cd projeto_portifolio

# Abra em um servidor local (recomendado)
python -m http.server 8000

# Acesse: http://localhost:8000
```

### Customizar Tema

```javascript
// Mudar tema programaticamente
ThemeManager.setTheme('dark');  // ou 'light'

// Escutar mudanças
document.addEventListener('themechange', (e) => {
    console.log('Novo tema:', e.detail.theme);
});
```

### Adicionar Novos Projetos

1. Abra `index.html`
2. Na seção `#portfolio`, copie um `.portfolio-card`
3. Atualize informações (título, descrição, tecnologias)
4. Adicione imagem em `img/projeto[N].jpg`

---

## 📚 Conceitos Acadêmicos Demonstrados

### CSS

- ✅ Herança de propriedades
- ✅ Cascata (especificidade)
- ✅ CSS Variables (Custom Properties)
- ✅ Pseudo-elementos (`:hover`, `::after`)
- ✅ Media Queries (Responsive Design)
- ✅ Flexbox (1D layouts)
- ✅ Grid (2D layouts)
- ✅ Box Model
- ✅ Seletores avançados

### JavaScript

- ✅ Escopo e Closures (IIFE)
- ✅ Padrões de Design (Revealing Module, Observer)
- ✅ Async/Await (Promises)
- ✅ Manipulação do DOM (querySelector, classList)
- ✅ Event Listeners (addEventListener)
- ✅ localStorage (Web Storage API)
- ✅ matchMedia (Media Queries em JS)
- ✅ Intersection Observer (Lazy Loading)
- ✅ Template Literals
- ✅ Spread Operator

### HTML5

- ✅ Semântica (header, main, section, article, footer)
- ✅ ARIA attributes (acessibilidade)
- ✅ Meta tags (SEO)
- ✅ Form validation attributes
- ✅ Data attributes

---

## 🎓 Próximos Passos

### Fase 1: Melhorias Imediatas
- [ ] Substituir imagens placeholder por capturas reais
- [ ] Conectar formulário a servidor backend
- [ ] Adicionar links reais (LinkedIn, GitHub)

### Fase 2: Expansão
- [ ] Service Worker (modo offline)
- [ ] Deploy em GitHub Pages
- [ ] Blog de artigos técnicos
- [ ] Integração com GitHub API (projetos dinâmicos)

### Fase 3: Profissionalização
- [ ] Analytics (Google Analytics)
- [ ] CMS headless (Contentful)
- [ ] Search funcional
- [ ] Comentários (Disqus)
- [ ] Newsletter signup

---

## 📞 Contato

- **Email:** gustavot.gomes7@gmail.com
- **WhatsApp:** (48) 99145-1169
- **LinkedIn:** [Seu Perfil]
- **GitHub:** [Seu Perfil]

---

## 📜 Licença

Este projeto é fornecido como portfólio acadêmico. Sinta-se livre para usar como referência e customizar para seu próprio uso.

---

## 🙏 Agradecimentos

Desenvolvido como atividade de **Engenharia de Software - UNINTER (2026)**  
Valores: Qualidade, Responsabilidade, Inovação e Impacto no Usuário.

---

**Última atualização:** 7 de maio de 2026  
**Status:** ✅ Produção
