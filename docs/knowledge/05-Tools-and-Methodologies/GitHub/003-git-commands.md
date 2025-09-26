---
sidebar_position: 3
---

# Git 常用命令笔记

这里是一份 Git 常用命令的笔记，帮助你处理日常开发工作：

## 初始化和基本配置

```bash
# 初始化新仓库
git init

# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 修改默认分支名
git config --global init.defaultBranch main
```

## 基本操作

```bash
# 查看状态
git status

# 添加文件到暂存区
git add <file>         # 添加特定文件
git add .              # 添加所有更改

# 提交更改
git commit -m "feat: 你的提交信息"

# 查看提交历史
git log
git log --oneline      # 简洁模式
git log --graph        # 图形化显示
```

## 分支操作

```bash
# 查看分支
git branch                  # 查看本地分支
git branch -r               # 查看远程分支
git branch -a               # 查看所有分支

# 创建分支
git branch <branch-name>

# 切换分支
git checkout <branch-name>
git switch <branch-name>    # Git 2.23+ 新命令

# 创建并切换到新分支
git checkout -b <branch-name>
git switch -c <branch-name> # Git 2.23+ 新命令

# 重命名分支
git branch -m <old-name> <new-name>

# 删除分支
git branch -d <branch-name>  # 安全删除（阻止删除未合并的分支）
git branch -D <branch-name>  # 强制删除
```

## 远程仓库操作

```bash
# 添加远程仓库
git remote add origin <repository-url>

# 查看远程仓库
git remote -v

# 从远程仓库获取/拉取
git fetch <remote>           # 获取但不合并
git pull <remote> <branch>   # 获取并合并

# 推送到远程仓库
git push <remote> <branch>
git push -u origin main      # 首次推送并设置上游分支
git push --force             # 强制推送（谨慎使用）
```

## 合并和解决冲突

```bash
# 合并分支
git merge <branch-name>

# 中止合并
git merge --abort

# 查看冲突文件
git diff --name-only --diff-filter=U
```

## 撤销更改

```bash
# 撤销工作区修改
git restore <file>          # Git 2.23+ 新命令
git checkout -- <file>      # 老命令

# 撤销暂存的文件
git restore --staged <file> # Git 2.23+ 新命令
git reset HEAD <file>       # 老命令

# 撤销提交
git reset --soft HEAD~1     # 撤销最近的提交但保留更改
git reset --hard HEAD~1     # 撤销最近的提交并删除更改（谨慎使用）

# 修改最近的提交
git commit --amend
```

## 标签操作

```bash
# 创建标签
git tag <tag-name>
git tag -a <tag-name> -m "标签信息"  # 附注标签

# 查看标签
git tag

# 推送标签
git push origin <tag-name>
git push origin --tags      # 推送所有标签
```

## 临时存储

```bash
# 存储当前更改
git stash

# 查看存储列表
git stash list

# 应用存储
git stash apply             # 应用最近的存储但不删除
git stash pop               # 应用最近的存储并删除
git stash apply stash@{n}   # 应用特定存储

# 删除存储
git stash drop stash@{n}
git stash clear             # 删除所有存储
```

## Commit 规范（Conventional Commits）

```bash
# 功能开发
git commit -m "feat: 添加用户登录功能"

# 修复缺陷
git commit -m "fix: 修复视频无法播放的问题"

# 文档修改
git commit -m "docs: 更新API文档"

# 代码重构
git commit -m "refactor: 重构数据处理逻辑"

# 性能优化
git commit -m "perf: 优化图片加载速度"

# 测试相关
git commit -m "test: 添加用户验证测试"

# 构建系统或依赖
git commit -m "build: 升级依赖库版本"

# 持续集成
git commit -m "ci: 修改CI配置"

# 样式修改（不影响功能）
git commit -m "style: 格式化代码"

# 杂项修改
git commit -m "chore: 更新gitignore文件"
```

## 高级技巧

```bash
# Cherry-pick（选择性合并）
git cherry-pick <commit-hash>

# 创建和应用补丁
git format-patch -1 <commit-hash>
git apply <patch-file>

# 查看特定文件的历史
git log --follow <file>

# 二分查找问题
git bisect start
git bisect bad              # 标记当前版本有问题
git bisect good <commit>    # 标记某个旧版本正常
# Git会自动切换版本让你测试
git bisect good/bad         # 标记当前测试版本的结果
git bisect reset            # 完成查找
```

这份笔记涵盖了 Git 的各种常用命令，特别突出了项目中使用的 Conventional Commits 规范。希望对你的日常开发有所帮助！
