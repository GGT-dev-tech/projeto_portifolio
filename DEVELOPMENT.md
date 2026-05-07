# ⚙️ Guia de Desenvolvimento Local

## 🚀 Configuração Inicial

### Pré-requisitos
- Um navegador moderno (Chrome, Firefox, Safari, Edge)
- Um editor de código (VS Code recomendado)
- Git (opcional, para versionamento)

### Estrutura de Arquivos

```
projeto_portifolio/
├── index.html          ← Abra este arquivo no navegador
├── style.css           ← Estilos
├── script.js           ← Lógica
├── README.md           ← Documentação
├── ROADMAP.md          ← Próximos passos
├── DEVELOPMENT.md      ← Este arquivo
├── .gitignore          ← Para Git
└── img/
    ├── projeto1.jpg    ← Adicione suas imagens aqui
    ├── projeto2.jpg
    └── projeto3.jpg
```

---

## 🌐 Executar Localmente

### Opção 1: Servidor Python (Recomendado)

```bash
# Navegue até a pasta do projeto
cd /Users/gustavo/Documents/dev/projects/trabalho_uninter/projeto_portifolio

# Inicie servidor local
python -m http.server 8000

# Acesse no navegador
http://localhost:8000
```

### Opção 2: Node.js (npm)

```bash
# Instale servidor global (uma única vez)
npm install -g http-server

# Inicie servidor
http-server

# Acesse
http://localhost:8080
```

### Opção 3: VS Code Live Server

1. Instale extensão: "Live Server" (Ritwick Dey)
2. Clique direito em `index.html`
3. "Open with Live Server"
4. Abre automaticamente em `http://127.0.0.1:5500`

### Opção 4: Abrir Diretamente (⚠️ Restrições)

```bash
# Simplesmente abra o arquivo
open /Users/gustavo/Documents/dev/projects/trabalho_uninter/projeto_portifolio/index.html
```

⚠️ **Nota:** Alguns recursos (localStorage, fetch) podem não funcionar corretamente em `file://`

---

## 🔍 Testes de Funcionalidade

### 1. Testar Sistema de Temas

1. Clique no botão 🌙 (moon) na navegação
2. Verifique se fundo muda para escuro
3. Recarregue a página - tema deve persistir
4. Tema deve estar no localStorage:
   - Abra DevTools (F12)
   - Vá em "Application" → "Local Storage"
   - Procure por `user-theme-preference`

### 2. Testar Validação de Formulário

1. Role até seção "Entre em Contato"
2. Deixe nome em branco, clique em "Enviar"
3. Deve aparecer mensagem em vermelho: "O nome deve ter no mínimo 3 caracteres"
4. Preencha nome com 2 caracteres (ex: "Jo")
5. Deve mostrar erro
6. Preencha nome com 3+ caracteres
7. Campo deve ficar verde ✓

### 3. Testar Email Validation

1. Preencha email inválido (ex: "teste")
2. Deve mostrar erro
3. Preencha email válido (ex: "teste@email.com")
4. Campo deve ficar verde

### 4. Testar Responsividade

**DevTools (F12) → Dispositivo:**

- [ ] iPhone SE (375px)
- [ ] iPad (768px)
- [ ] Desktop (1024px+)

**Checklist:**
- Navegação adaptável
- Cards se reorganizam
- Texto legível em mobile
- Imagens responsive
- Botões acessíveis

### 5. Testar Acessibilidade

**Teclado:**
1. Pressione `Tab` para navegar
2. Deve navegar por: Botão tema → Links → Formulário
3. `Enter` deve ativar botões
4. `Shift+Tab` volta

**DevTools → Lighthouse:**
1. F12 → Lighthouse
2. Click "Analyze page load"
3. Verifique:
   - Accessibility > 90
   - Performance > 80
   - Best Practices > 80

---

## 🛠️ Fazer Alterações

### Editar Conteúdo (HTML)

**Arquivo:** `index.html`

```html
<!-- Para mudar título -->
<h1 class="logo">Seu Nome Aqui</h1>

<!-- Para adicionar projeto -->
<article class="portfolio-card">
    <figure>
        <img src="img/projeto-novo.jpg" alt="Descrição">
    </figure>
    <h3>Título do Projeto</h3>
    <p>Descrição...</p>
    <div class="tech-tags">
        <span class="tag">Tecnologia1</span>
        <span class="tag">Tecnologia2</span>
    </div>
    <a href="#" class="btn-projeto">Ver Projeto →</a>
</article>
```

### Editar Estilos (CSS)

**Arquivo:** `style.css`

```css
/* Mudar cores */
:root {
    --color-primary: #seu-azul;      /* Azul principal */
    --color-secondary: #seu-azul-escuro; /* Hover */
    --color-text: #seu-texto;        /* Texto */
}

/* Ajustar espaçamento */
--spacing-lg: 2rem;  /* Mude este valor */

/* Mudar fonte */
--font-family: 'Sua Fonte', sans-serif;
```

### Adicionar Funcionalidade (JavaScript)

**Arquivo:** `script.js`

Exemplo: Adicionar novo módulo
```javascript
const MyNewModule = (() => {
    const init = () => {
        console.log('Novo módulo iniciado');
    };
    
    return { init };
})();

// Chame em DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    MyNewModule.init();
});
```

---

## 🐛 Debug & Troubleshooting

### Tema não persiste
```javascript
// Verifique localStorage em DevTools
localStorage.getItem('user-theme-preference')

// Limpe cache
localStorage.clear()
```

### Imagens não carregam
1. Verifique caminho: `img/projeto1.jpg`
2. Extensão correta (.jpg, .png)
3. Arquivo existe na pasta
4. Permissões de leitura

### JavaScript não funciona
1. Abra DevTools (F12)
2. Vá em "Console"
3. Procure por erros em vermelho
4. Copie mensagem de erro
5. Pesquise no Google ou StackOverflow

### CSS não aplicado
1. Verifique seletor CSS
2. Especificidade (use `!important` como último recurso)
3. Recarregue página (Ctrl+F5 para limpar cache)
4. Verifique se arquivo está linkado

---

## 📊 Performance Optimization

### Otimizar Imagens

```bash
# Converter para WebP (melhor compressão)
cwebp -q 80 projeto1.jpg -o projeto1.webp

# Redimensionar
convert projeto1.jpg -resize 400x250 projeto1-small.jpg

# Usar online
https://www.optimizeimages.com/
https://tinypng.com/
```

### Minificar CSS/JS (Produção)

```bash
# Instale ferramentas
npm install -g terser cssnano-cli

# Minificar
terser script.js -o script.min.js
cssnano style.css -o style.min.js

# Atualize HTML
<link rel="stylesheet" href="style.min.css">
<script src="script.min.js"></script>
```

### Medir Performance

```javascript
// Performance API
console.time('MyTask');
// ... código aqui ...
console.timeEnd('MyTask');

// Exemplo output: MyTask: 123.45ms
```

---

## 🔐 Segurança Checklist

- [ ] Validar input do formulário (frontend + backend)
- [ ] Usar HTTPS em produção
- [ ] Implementar CSRF token
- [ ] Não expor senhas em código
- [ ] Sanitizar HTML (`textContent` vs `innerHTML`)
- [ ] Configurar headers de segurança

---

## 📝 Git Workflow

```bash
# Clonar projeto
git clone https://seu-repo-url

# Criar branch para feature
git checkout -b feature/nova-funcionalidade

# Fazer alterações...
# Adicionar arquivos
git add .

# Commit
git commit -m "Adicionar: descrição das mudanças"

# Push
git push origin feature/nova-funcionalidade

# Criar Pull Request no GitHub
```

---

## 🧪 Testes Manuais Checklist

- [ ] Carrega sem erros no console
- [ ] Tema funciona (light/dark)
- [ ] Formulário valida corretamente
- [ ] Links internos funcionam (#sobre, #contato, etc)
- [ ] Responsivo em mobile (375px)
- [ ] Responsivo em tablet (768px)
- [ ] Responsivo em desktop (1024px+)
- [ ] Acessibilidade com teclado (Tab)
- [ ] Mensagens de erro aparecem
- [ ] Mensagens de sucesso aparecem
- [ ] Imagens carregam
- [ ] Sem erros no console (F12)

---

## 📞 Recursos Úteis

- **MDN Web Docs:** https://developer.mozilla.org/
- **Can I Use:** https://caniuse.com/ (compatibilidade)
- **VS Code Shortcuts:** https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf
- **Regex Testing:** https://regex101.com/
- **Color Picker:** https://coolors.co/
- **Font Pairing:** https://www.googlefonts.com/

---

**Dúvidas?** Consulte README.md ou ROADMAP.md

Última atualização: 7 de maio de 2026
