# Dankao Wiki

这是一个基于 Docusaurus 构建的个人知识库和研究网站。

## 🚀 CI/CD 自动部署

本项目已配置 GitHub Actions 自动化部署：

### 自动部署工作流

- **触发条件**: 当代码推送到 `main` 分支时
- **部署目标**: GitHub Pages
- **访问地址**: https://ReikiC.github.io/MY-WEBSITE/

### 测试构建工作流

- **触发条件**: Pull Request 到 `main` 分支时
- **目的**: 验证构建是否成功，防止破坏性更改

## 📁 项目结构

```
MY-WEBSITE/
├── .github/workflows/     # GitHub Actions 工作流
│   ├── deploy.yml        # 自动部署到 GitHub Pages
│   └── test-deploy.yml   # 测试构建
├── docs/                 # 文档内容
├── blog/                 # 博客文章
├── src/                  # 源代码
├── static/               # 静态资源
├── docusaurus.config.ts  # Docusaurus 配置
└── package.json          # 项目依赖
```

## 🛠️ 本地开发

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm start
```

### 构建生产版本
```bash
npm run build
```

### 本地预览构建结果
```bash
npm run serve
```

## 📝 部署配置说明

### GitHub Pages 设置

1. 在 GitHub 仓库设置中启用 Pages
2. 源分支选择 `gh-pages`
3. GitHub Actions 会自动创建和更新此分支

### 配置文件修改

主要的部署配置在 `docusaurus.config.ts` 中：

```typescript
{
  url: 'https://ReikiC.github.io',
  baseUrl: '/MY-WEBSITE/',
  organizationName: 'ReikiC',
  projectName: 'MY-WEBSITE',
}
```

## 🔧 可用脚本

- `npm start` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run serve` - 预览构建结果
- `npm run build:serve` - 构建并预览
- `npm run deploy:gh-pages` - 手动部署到 GitHub Pages
- `npm run typecheck` - TypeScript 类型检查

## 📚 内容管理

- **知识库**: 存放在 `docs/knowledge/` 目录
- **研究内容**: 存放在 `docs/research/` 目录
- **博客文章**: 存放在 `blog/` 目录

每次推送到 main 分支时，网站会自动更新部署。