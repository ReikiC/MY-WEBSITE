---
sidebar_position: 2
---

# 配置Git（SSH）

建议：0，1，2，3，4，5（或者9）

## 0. 电脑上得有Git吧

首先要安装 Git Bash

SSH 更安全方便！对于不同电脑，**建议配置不同的 SSH 密钥**，这样更安全。

## 1. 生成 SSH 密钥

```bash
# 生成新的 SSH 密钥（推荐 ed25519）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 如果系统不支持 ed25519，使用 RSA
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

按提示操作：

- 文件保存位置：直接回车（使用默认 `~/.ssh/id_ed25519`）
- 密码：可以设置也可以留空

## 2. 添加 SSH 密钥到 ssh-agent

```bash
# 启动 ssh-agent
eval "$(ssh-agent -s)"

# 添加私钥到 ssh-agent，看你选取的密钥类型选下面其中一个运行
ssh-add ~/.ssh/id_ed25519
ssh-add ~/.ssh/id_rsa
```

## 3. 复制公钥并添加到 GitHub

```bash
# 复制公钥到剪贴板
# macOS: 密钥方式二选一
pbcopy < ~/.ssh/id_ed25519.pub
pbcopy < ~/.ssh/id_rsa.pub

# Linux:
cat ~/.ssh/id_ed25519.pub
```

然后去 GitHub：

1. Settings → SSH and GPG keys
2. New SSH key
3. 粘贴公钥内容
4. 给这个密钥起个名字（比如 "MacMini-2024"）

## 4. 测试 SSH 连接

```bash
ssh -T git@github.com
```

## 5. 修改现有仓库为 SSH

```bash
# 查看当前远程配置
git remote -v

# 修改为 SSH URL
git remote set-url origin git@github.com:ReikiC/ReGSM-Beginner.git

# 现在可以正常拉取了
git pull
```

## 6. 为不同电脑配置 SSH 的最佳实践

### 推荐方案：每台电脑独立密钥

```bash
# 在每台电脑上生成独立密钥
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### 给密钥起有意义的名字

- `MacMini-Home-2024`
- `MacBook-Work-2024`
- `Linux-Server-2024`

### 如果想用同一个密钥（不推荐但可行）

```bash
# 从一台电脑复制私钥到另一台
scp ~/.ssh/id_ed25519 user@other-computer:~/.ssh/
scp ~/.ssh/id_ed25519.pub user@other-computer:~/.ssh/
```

## 7. SSH 配置优化（可选）

创建 `~/.ssh/config` 文件：

```bash
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    AddKeysToAgent yes
    UseKeychain yes
```

## 8. 全局设置（让所有新克隆的仓库默认使用 SSH）

```bash
# 设置 Git 在克隆时自动将 HTTPS URL 转换为 SSH
git config --global url."git@github.com:".insteadOf "https://github.com/"
```

## 9. 将所有Git操作都使用SSH（可选，个人推荐）

```bash
git config --global url."git@github.com:".insteadOf "https://github.com/"
```

这样设置后：

- ✅ 所有 `https://github.com/...` 的 URL 都会自动转换为 `git@github.com:...`
- ✅ 所有 Git 操作都会使用 SSH（即 laper32 的身份）
- ✅ 不需要手动修改每个仓库的 remote URL
- ✅ 新克隆的仓库也会自动使用 SSH

### 效果：

```bash
# 这个命令：
git clone https://github.com/some-user/some-repo.git

# 实际会变成：
git clone git@github.com:some-user/some-repo.git
```
