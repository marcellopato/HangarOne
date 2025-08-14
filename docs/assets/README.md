# 📊 HangarOne - Assets & Logo

Este diretório contém os assets visuais do projeto HangarOne, incluindo logos e ícones com tema de aviação.

## 🎨 Logos Disponíveis

### Logo Principal (`logo.svg`)
- Logo completo com texto "HangarOne"
- Inclui ícone de hangar estilizado 
- Cores: Azul aviação (#0066cc) e cinza (#6c757d)
- Uso: Headers, documentação, apresentações

### Logo Compacto (`logo-compact.svg`)
- Versão apenas com ícone do hangar
- Ideal para favicons e espaços reduzidos
- Mesmo padrão de cores do logo principal
- Uso: Ícones, favicons, apps móveis

## 🎨 Paleta de Cores

```css
:root {
  --primary-blue: #0066cc;    /* Azul aviação principal */
  --secondary-blue: #004d99;  /* Azul mais escuro */
  --light-blue: #e6f3ff;      /* Azul claro para backgrounds */
  --success-green: #28a745;   /* Verde para status positivo */
  --warning-orange: #fd7e14;  /* Laranja para avisos */
  --danger-red: #dc3545;      /* Vermelho para alertas */
  --dark-gray: #343a40;       /* Cinza escuro para textos */
  --light-gray: #f8f9fa;      /* Cinza claro para backgrounds */
  --border-gray: #dee2e6;     /* Cinza para bordas */
  --text-gray: #6c757d;       /* Cinza para textos secundários */
}
```

## 🚀 Uso dos Assets

### No Frontend React
```tsx
import logo from '../assets/logo.svg';
import logoCompact from '../assets/logo-compact.svg';

// Logo principal
<img src={logo} alt="HangarOne" />

// Logo compacto
<img src={logoCompact} alt="HangarOne" width="32" height="32" />
```

### No HTML
```html
<!-- Favicon -->
<link rel="icon" href="/assets/logo-compact.svg" />

<!-- Logo no header -->
<img src="/assets/logo.svg" alt="HangarOne - Gerenciamento de Aeroclubes" />
```

## 📐 Diretrizes de Uso

1. **Espaçamento**: Mantenha sempre um espaço mínimo ao redor dos logos
2. **Cores**: Use as cores originais sempre que possível
3. **Proporção**: Mantenha a proporção original dos logos
4. **Fundo**: Os logos funcionam melhor em fundos claros
5. **Tamanho mínimo**: Logo compacto: 24px, Logo principal: 120px de largura

## 🎯 Contextos de Uso

- **Header do site**: Logo principal
- **Favicon**: Logo compacto
- **Apps móveis**: Logo compacto
- **Documentação**: Logo principal
- **Emails**: Logo principal
- **Redes sociais**: Logo compacto ou principal dependendo do formato