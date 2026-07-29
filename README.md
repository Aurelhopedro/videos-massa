# VideosMassa Browser

Navegador web leve e moderno, construído em HTML5, CSS3 e JavaScript puro (sem frameworks),
com dados salvos localmente no dispositivo via IndexedDB.

## Funcionalidades

- Tela inicial com atalhos, recentes e favoritos
- Barra de endereço com pesquisa (Google, Bing, DuckDuckGo)
- Sistema de abas (criar, fechar, alternar)
- Favoritos organizados por pasta, com exportar/importar (JSON)
- Histórico com busca e limpeza
- Gestor de downloads com progresso, cancelar, repetir, exclusão em lote
- Configurações: tema claro/escuro/automático, motor de pesquisa, página inicial, backup e restauração
- Tema Material Design simplificado, com suporte a claro/escuro automático

## Limitações importantes (por design)

- **Navegação embutida via iframe**: muitos sites (Google, Instagram, bancos etc.) bloqueiam
  serem exibidos dentro de um iframe por segurança própria (`X-Frame-Options` / `CSP`). Quando isso
  acontece, o app oferece um botão para abrir o site no navegador padrão do sistema.
- **Downloads**: o gestor de downloads baixa apenas arquivos com link direto e cujo download seja
  permitido pelo servidor de origem (ex: arquivos hospedados publicamente, acervos livres). O app
  não contorna proteções de streaming nem extrai vídeos de redes sociais (YouTube, Instagram,
  TikTok, Facebook) — isso violaria os Termos de Serviço dessas plataformas.

## Como rodar

É um site estático — não precisa de build. Basta abrir `index.html` num navegador,
ou hospedar a pasta em qualquer servidor estático (GitHub Pages, Netlify, Vercel etc.)
para acessar pelo celular.

### Publicar no GitHub Pages (opcional)

1. Vá em **Settings → Pages** no repositório.
2. Em "Source", selecione a branch `main` e a pasta raiz `/`.
3. Salve — o GitHub gera uma URL pública para acessar o app pelo navegador do Android.

## Estrutura

```
index.html         → tela inicial
browser.html        → navegação com abas
favorites.html       → favoritos
history.html         → histórico
downloads.html       → downloads
settings.html        → configurações
css/style.css        → estilos (temas, componentes)
js/db.js             → camada de persistência (IndexedDB)
js/utils.js          → funções utilitárias
js/theme.js          → tema claro/escuro
js/tabs.js           → sistema de abas
js/favorites.js       → lógica de favoritos
js/history.js         → lógica de histórico
js/downloads.js       → lógica do gestor de downloads
```
