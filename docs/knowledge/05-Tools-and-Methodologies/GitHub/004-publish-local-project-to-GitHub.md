---
sidebar_position: 4
---

## 将本地项目发布到GitHub的步骤

以本project为例

### 1. 在GitHub上创建一个新仓库

首先，你需要在GitHub上创建一个新的仓库：

1. 登录到你的GitHub账户
2. 点击右上角的加号"+"，然后选择"New repository"
3. 在"Repository name"字段中输入你想要的项目名称（例如"bili-project"）
4. 可以选择添加描述（Description）
5. 选择仓库的可见性（Public或Private）
6. 不要勾选"Initialize this repository with a README"，因为你已经有本地项目了
7. 点击"Create repository"按钮

### 2. 将本地仓库与GitHub仓库连接

在你的本地项目目录中，打开终端或命令提示符，然后运行以下命令：

```bash
# 确保你已经初始化了git仓库，如果没有，请运行：
git init

# 添加远程仓库地址（替换USERNAME和REPOSITORY为你的GitHub用户名和仓库名）
git remote add origin https://github.com/USERNAME/REPOSITORY.git

# 验证远程仓库是否已成功添加
git remote -v
```

### 3. 提交本地文件并推送到GitHub

```bash
# 添加所有文件到暂存区
git add .

# 提交文件
git commit -m "feat: initial commit"

# 将本地main分支推送到GitHub
git push -u origin main
```

注意：如果你的默认分支是`master`而不是`main`，请将上述命令中的`main`替换为`master`。

### 4. 如果遇到分支名称不同的问题

如果你的本地分支名称与GitHub默认分支名称不同，可能会遇到错误。例如，如果你本地是`master`分支，但GitHub使用`main`作为默认分支：

```bash
# 查看本地分支
git branch

# 如果需要，将本地分支重命名为main
git branch -M main

# 然后推送
git push -u origin main
```

### 5. 验证发布

完成上述步骤后，刷新GitHub仓库页面，你应该能看到你的项目文件已经成功发布到GitHub上了。

### 注意事项

1. 确保你的Git已经配置了用户名和邮箱：

   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. 如果你使用的是HTTPS URL，可能需要输入GitHub凭据。如果频繁推送，建议设置SSH密钥。

3. 如果你想要在后续更改项目名称，可以在GitHub仓库的Settings中找到并修改。

按照以上步骤操作，你的bili-project就能成功发布到GitHub上，并设置好项目名称了。
