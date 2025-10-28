# Dankao's Personal Website

> Personal knowledge base & research documentation for PhD journey

## Tech Stack
- **Framework**: [Docusaurus](https://docusaurus.io/) (TypeScript)
- **Content**: Markdown/MDX with LaTeX support
- **Deployment**: GitHub Pages (auto-deploy on push to Master)
- **Search**: Local search powered by @easyops-cn/docusaurus-search-local

## Structure
```
docs/
├── knowledge/      # Knowledge base (Math, CS, EE, etc.)
├── research/       # Research plans & tracking
└── tutorial-*/     # Tutorials
blog/               # Blog posts
src/pages/          # Custom pages (Home, Links)
```

## Development

```bash
npm install && npm start
```

## Deploy

```bash
npm run build        # Build static site
npm run deploy       # Deploy to gh-pages (manual)
# or push to Master branch for auto-deploy via GitHub Actions
```
