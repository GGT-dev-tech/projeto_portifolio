# 🗺️ Roadmap - Próximos Passos do Portfólio

## Status Atual ✅

- [x] Estrutura HTML5 semântica completa
- [x] CSS responsivo com variáveis e temas
- [x] JavaScript modular (ThemeManager, FormValidator, DOMUtility)
- [x] Validação de formulário sem alerts
- [x] Acessibilidade WCAG 2.1
- [x] Conteúdo pessoal (Sobre, Formação, Projetos, Contato)
- [x] Documentação completa (README.md)

---

## 📋 Próximos Passos (Prioridade)

### **FASE 1: Imediato (1-2 semanas)**

#### [ ] 1. Substituir Imagens Placeholder

**Descrição:** Adicionar capturas reais dos projetos

**Passos:**
1. Crie pasta `img/` se não existir
2. Adicione imagens com nomes:
   - `projeto1.jpg` - Sistema Inteligente de Propriedades
   - `projeto2.jpg` - Sistema de Gestão Escolar
   - `projeto3.jpg` - Sistema de Controle de Portaria

**Dica:**
```bash
# Redimensionar imagens com ImageMagick
convert projeto1.png -resize 400x250! projeto1.jpg

# Ou usar online: https://pixlr.com/
```

**Padrão recomendado:**
- Formato: JPG (melhor compressão)
- Tamanho: 400x250px (16:10)
- Peso: < 100KB por imagem
- Otimizar: https://tinypng.com/

---

#### [ ] 2. Conectar Formulário a Servidor Backend

**Descrição:** Integrar envio real de emails

**Opção A: Usar Serviço Externo (Mais Fácil)**

1. **EmailJS** (recomendado):
   - Acesse: https://www.emailjs.com/
   - Crie conta gratuita
   - Copie `serviceID` e `templateID`

2. **Atualizar JavaScript:**

```javascript
// Adicione ao topo do script.js
const EMAILJS_CONFIG = {
    serviceID: 'seu_service_id_aqui',
    templateID: 'seu_template_id_aqui',
    publicKey: 'sua_public_key_aqui'
};

// Carregue a library
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js"></script>

// Atualize _submitToServer():
const _submitToServer = async () => {
    _submit.disabled = true;
    _submit.textContent = 'Enviando...';
    
    try {
        // Inicialize EmailJS
        emailjs.init(EMAILJS_CONFIG.publicKey);
        
        // Envie o email
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            {
                to_email: 'gustavot.gomes7@gmail.com',
                from_name: _nome.value,
                from_email: _email.value,
                message: _mensagem.value,
                reply_to: _email.value
            }
        );
        
        return response.status === 200;
    } catch (error) {
        console.error('Erro ao enviar:', error);
        return false;
    } finally {
        _submit.disabled = false;
        _submit.textContent = 'Enviar Mensagem';
    }
};
```

**Opção B: Backend Próprio (Mais Profissional)**

1. **Framework:** Node.js/Express ou Python/FastAPI
2. **Endpoint:** `POST /api/contact`
3. **Envio:** Nodemailer ou sendgrid
4. **Deploy:** Railway, Heroku ou AWS

Exemplo (Node.js + Nodemailer):
```javascript
// backend/routes/contact.js
app.post('/api/contact', async (req, res) => {
    const { nome, email, mensagem } = req.body;
    
    // Validar novamente
    if (!nome || !email || !mensagem) {
        return res.status(400).json({ error: 'Campos obrigatórios' });
    }
    
    try {
        // Enviar email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'gustavot.gomes7@gmail.com',
            replyTo: email,
            subject: `Novo contato de ${nome}`,
            html: `
                <h2>Novo Contato</h2>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${mensagem}</p>
            `
        });
        
        res.json({ success: true, message: 'Email enviado!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao enviar email' });
    }
});
```

---

#### [ ] 3. Adicionar Links Reais

**Descrição:** Conectar a seus perfis profissionais

**Arquivo:** `index.html` - Seção Contato

```html
<div class="info-item">
    <strong>💼 LinkedIn:</strong>
    <a href="https://linkedin.com/in/seu-usuario" target="_blank" rel="noopener">
        Gustavo Gomes
    </a>
</div>

<div class="info-item">
    <strong>🐙 GitHub:</strong>
    <a href="https://github.com/seu-usuario" target="_blank" rel="noopener">
        gustavogomes
    </a>
</div>
```

---

### **FASE 2: Curto Prazo (2-4 semanas)**

#### [ ] 4. Service Worker (Modo Offline)

**Descrição:** Permitir acesso offline ao portfólio

**Arquivo:** `sw.js`

```javascript
const CACHE_NAME = 'portfolio-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/img/projeto1.jpg',
    '/img/projeto2.jpg',
    '/img/projeto3.jpg'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
```

**Registrar em HTML:**
```html
<script>
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
    }
</script>
```

---

#### [ ] 5. Deploy em GitHub Pages

**Descrição:** Publicar portfólio na internet (gratuito)

**Passos:**

1. **Inicialize Git:**
```bash
cd projeto_portifolio
git init
git add .
git commit -m "Initial commit: Portfolio with HTML5, CSS3, JS"
```

2. **Crie repositório no GitHub:**
   - Acesse: https://github.com/new
   - Nome: `portfolio` ou `projeto_portifolio`
   - Public (importante!)

3. **Push para GitHub:**
```bash
git remote add origin https://github.com/seu-usuario/portfolio.git
git branch -M main
git push -u origin main
```

4. **Ative GitHub Pages:**
   - Settings → Pages
   - Branch: `main`
   - Folder: `/ (root)`
   - Save

5. **Acesse seu portfólio:**
```
https://seu-usuario.github.io/portfolio
```

---

### **FASE 3: Médio Prazo (1-2 meses)**

#### [ ] 6. Blog de Artigos Técnicos

**Descrição:** Adicionar seção de blog para compartilhar conhecimento

**Estrutura:**
```html
<section id="blog" class="section">
    <h2 class="section-title">Blog Técnico</h2>
    <div class="blog-grid">
        <article class="blog-card">
            <h3>CSS Variables: Sistema de Design Modular</h3>
            <time datetime="2026-05-07">7 de maio</time>
            <p>Como usar CSS Custom Properties para criar temas dinâmicos...</p>
            <a href="/blog/css-variables.html">Ler mais →</a>
        </article>
    </div>
</section>
```

**Artigos Sugeridos:**
1. "JavaScript Vanilla vs Frameworks: Quando Usar Cada Um"
2. "HTML5 Semântico: Guia Completo para Acessibilidade"
3. "Responsive Design Mobile-First com CSS Grid"
4. "Validação de Formulários sem Frameworks"

---

#### [ ] 7. Analytics & SEO

**Descrição:** Rastrear visitantes e melhorar descoberta

**Analytics:**
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**SEO Checklist:**
- [x] Meta description
- [x] Meta author
- [ ] Open Graph (para compartilhamento)
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Canonical URLs

---

#### [ ] 8. Integração com GitHub API

**Descrição:** Exibir projetos dinamicamente do GitHub

```javascript
const loadGitHubProjects = async () => {
    try {
        const response = await fetch('https://api.github.com/users/seu-usuario/repos');
        const repos = await response.json();
        
        // Filtrar e exibir apenas repos públicos com descrição
        const projects = repos
            .filter(repo => !repo.private && repo.description)
            .slice(0, 3);
        
        // Atualizar DOM...
    } catch (error) {
        console.error('Erro ao carregar repos:', error);
    }
};
```

---

### **FASE 4: Longo Prazo (3+ meses)**

#### [ ] 9. Newsletter Signup

Integrar com:
- Mailchimp (grátis até 500 contatos)
- Substack
- ConvertKit

#### [ ] 10. Sistema de Comentários

- Disqus (fácil)
- Remark42 (open source)
- GitHub Discussions

#### [ ] 11. Modo Dark Automático

```javascript
// Já implementado! Apenas refinar:
// - Animações suaves
// - Persistência melhorada
// - Sincronização com SO
```

#### [ ] 12. Progressive Web App (PWA)

- Manifest.json
- Ícones multi-tamanho
- Installable

---

## 🛠️ Stack Recomendado para Expansão

| Fase | Frontend | Backend | Deploy |
|------|----------|---------|--------|
| Atual | HTML5, CSS3, JS | - | GitHub Pages |
| Curto | React (opcional) | Node.js/FastAPI | Railway |
| Médio | Next.js (opcional) | Django/Express | AWS |
| Longo | Nuxt/SvelteKit | GraphQL | Vercel |

---

## 📊 Checklist de Deploy

Antes de publicar em produção:

- [ ] Testar em Chrome, Firefox, Safari, Edge
- [ ] Testar em dispositivos móveis
- [ ] Validar HTML (https://validator.w3.org/)
- [ ] Validar CSS (https://jigsaw.w3.org/css-validator/)
- [ ] Testar acessibilidade (axe DevTools)
- [ ] Verificar performance (Lighthouse)
- [ ] Remover console.log() de debug
- [ ] Optimizar imagens
- [ ] Minificar CSS/JS (para produção)
- [ ] Configurar headers de segurança
- [ ] Testar offline (Service Worker)

---

## 🎓 Aprendizados Esperados

Ao completar este roadmap, você terá:

✅ Website profissional em produção  
✅ Experiência full-stack (frontend + backend)  
✅ Conhecimento de DevOps (deploy, CI/CD)  
✅ SEO e marketing digital  
✅ Segurança web (validação, HTTPS, CORS)  
✅ Performance e otimização  
✅ Acessibilidade (WCAG)  
✅ Controle de versão (Git/GitHub)  

---

## 📞 Suporte & Recursos

- **MDN Web Docs:** https://developer.mozilla.org/
- **Can I Use:** https://caniuse.com/
- **Stack Overflow:** https://stackoverflow.com/
- **GitHub Discussions:** Comunidade do seu projeto
- **Dev Community:** https://dev.to/

---

**Última atualização:** 7 de maio de 2026  
**Próximo revisão:** Conforme progresso em cada fase
