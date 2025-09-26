---
sidebar_position: 5

---

# GitHub CI/CD 笔记

## 1. 基本流程
- 使用 GitHub Actions 实现自动化构建和部署（CI/CD）。
- 常见流程：代码 push 到主分支 → 自动安装依赖 → 构建项目 → 部署到 GitHub Pages。

## 2. 关键步骤
1. **配置 workflow 文件**（如 `.github/workflows/deploy.yml`）。
2. **设置 Node 环境**：
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: '18'
   ```
3. **安装依赖**：
   ```yaml
   - run: npm ci
   ```
   > 注意：需要有 `package-lock.json` 或 `yarn.lock` 文件。
4. **构建项目**：
   ```yaml
   - run: npm run build
   ```
5. **部署到 GitHub Pages**：
   ```yaml
   - uses: peaceiris/actions-gh-pages@v4
     with:
       github_token: ${{ secrets.GITHUB_TOKEN }}
       publish_dir: ./build
   ```

## 3. 常见问题与解决方法
- **权限错误（403）**：
  - 错误信息：`Permission to <repo>.git denied to github-actions[bot].`
  - 解决：
    - 检查仓库 Settings → Actions 权限，确保 GITHUB_TOKEN 有写权限。
    - 如为 fork 仓库，需在原仓库设置或用 Personal Access Token。
- **依赖锁文件缺失**：
  - 错误信息：`Dependencies lock file is not found`
  - 解决：
    - 确保根目录有 `package-lock.json` 或 `yarn.lock` 并提交。
- **构建失败**：
  - 检查 Node 版本、依赖安装、构建命令是否正确。

## 4. 参考链接
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages#readme)
- [GitHub Actions 官方文档](https://docs.github.com/en/actions)

---
如遇新问题，建议查看 workflow 日志和官方文档。