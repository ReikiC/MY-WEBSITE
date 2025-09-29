# .NET CLI 命令行完全指南

## 📚 目录

1. [基础命令](#基础命令)
2. [项目管理](#项目管理)
3. [解决方案管理](#解决方案管理)
4. [包管理](#包管理)
5. [构建和运行](#构建和运行)
6. [测试相关](#测试相关)
7. [发布和部署](#发布和部署)
8. [工具管理](#工具管理)
9. [完整项目创建流程](#完整项目创建流程)
10. [常见场景示例](#常见场景示例)

---

## 基础命令

### dotnet --version
查看当前安装的 .NET SDK 版本

```bash
dotnet --version
# 输出示例: 8.0.100
```

### dotnet --info
显示详细的 .NET 信息（SDK、运行时版本等）

```bash
dotnet --info
```

### dotnet --list-sdks
列出所有已安装的 SDK

```bash
dotnet --list-sdks
# 输出示例:
# 6.0.400 [C:\Program Files\dotnet\sdk]
# 7.0.100 [C:\Program Files\dotnet\sdk]
# 8.0.100 [C:\Program Files\dotnet\sdk]
```

### dotnet --list-runtimes
列出所有已安装的运行时

```bash
dotnet --list-runtimes
```

### dotnet -h 或 --help
显示帮助信息

```bash
dotnet --help
dotnet new --help
dotnet build --help
```

---

## 项目管理

### dotnet new
创建新项目或文件

#### 基本语法
```bash
dotnet new <模板名称> [选项]
```

#### 常用项目模板

```bash
# 控制台应用
dotnet new console -n MyConsoleApp

# 类库
dotnet new classlib -n MyLibrary

# ASP.NET Core Web API
dotnet new webapi -n MyWebApi

# ASP.NET Core MVC
dotnet new mvc -n MyMvcApp

# ASP.NET Core Razor Pages
dotnet new razor -n MyRazorApp

# Blazor Server
dotnet new blazorserver -n MyBlazorApp

# Blazor WebAssembly
dotnet new blazorwasm -n MyBlazorWasm

# WPF 应用
dotnet new wpf -n MyWpfApp

# WinForms 应用
dotnet new winforms -n MyWinFormsApp

# xUnit 测试项目
dotnet new xunit -n MyTests

# NUnit 测试项目
dotnet new nunit -n MyTests

# MSTest 测试项目
dotnet new mstest -n MyTests

# Worker Service
dotnet new worker -n MyWorkerService

# gRPC 服务
dotnet new grpc -n MyGrpcService
```

#### 常用选项

```bash
# -n, --name: 指定项目名称
dotnet new console -n MyApp

# -o, --output: 指定输出目录
dotnet new console -o ./src/MyApp

# -f, --framework: 指定目标框架
dotnet new console -f net8.0
dotnet new console -f net6.0

# --use-program-main: 使用传统的 Program.cs 格式（而不是顶级语句）
dotnet new console --use-program-main

# --force: 强制创建（即使目录已存在）
dotnet new console -n MyApp --force

# --language: 指定编程语言
dotnet new console -lang C#
dotnet new console -lang F#
dotnet new console -lang VB
```

### dotnet new list
列出所有可用的模板

```bash
# 列出所有模板
dotnet new list

# 搜索特定模板
dotnet new list web
dotnet new list test
```

### dotnet new install
安装模板包

```bash
# 安装模板包
dotnet new install Microsoft.DotNet.Web.Spa.ProjectTemplates

# 从 NuGet 安装
dotnet new install <包名称>
```

### dotnet new uninstall
卸载模板包

```bash
dotnet new uninstall Microsoft.DotNet.Web.Spa.ProjectTemplates
```

---

## 解决方案管理

### dotnet new sln
创建新的解决方案文件

```bash
# 在当前目录创建解决方案
dotnet new sln

# 指定解决方案名称
dotnet new sln -n MySolution

# 在指定目录创建
dotnet new sln -o ./src -n MySolution
```

### dotnet sln add
向解决方案添加项目

```bash
# 添加单个项目
dotnet sln add MyProject/MyProject.csproj

# 添加多个项目
dotnet sln add Project1/Project1.csproj Project2/Project2.csproj

# 添加目录下所有项目
dotnet sln add **/*.csproj

# 在特定解决方案文件夹中添加项目
dotnet sln add MyProject/MyProject.csproj --solution-folder src
```

### dotnet sln remove
从解决方案移除项目

```bash
# 移除单个项目
dotnet sln remove MyProject/MyProject.csproj

# 移除多个项目
dotnet sln remove Project1/Project1.csproj Project2/Project2.csproj
```

### dotnet sln list
列出解决方案中的所有项目

```bash
dotnet sln list

# 指定解决方案文件
dotnet sln MySolution.sln list
```

---

## 包管理

### dotnet add package
添加 NuGet 包引用

```bash
# 添加最新版本的包
dotnet add package Newtonsoft.Json

# 添加特定版本
dotnet add package Newtonsoft.Json --version 13.0.1

# 添加预览版本
dotnet add package Microsoft.EntityFrameworkCore --prerelease

# 指定项目文件
dotnet add MyProject/MyProject.csproj package Newtonsoft.Json

# 指定包源
dotnet add package MyPackage --source https://api.nuget.org/v3/index.json
```

### dotnet remove package
移除 NuGet 包引用

```bash
# 移除包
dotnet remove package Newtonsoft.Json

# 从特定项目移除
dotnet remove MyProject/MyProject.csproj package Newtonsoft.Json
```

### dotnet list package
列出项目的包引用

```bash
# 列出当前项目的包
dotnet list package

# 列出所有项目的包（在解决方案级别）
dotnet list package

# 显示过时的包
dotnet list package --outdated

# 显示有安全漏洞的包
dotnet list package --vulnerable

# 显示已弃用的包
dotnet list package --deprecated

# 包括传递依赖
dotnet list package --include-transitive
```

### dotnet add reference
添加项目引用

```bash
# 添加项目引用
dotnet add reference ../MyLibrary/MyLibrary.csproj

# 添加多个引用
dotnet add reference ../Lib1/Lib1.csproj ../Lib2/Lib2.csproj

# 指定引用的项目
dotnet add MyProject/MyProject.csproj reference ../MyLibrary/MyLibrary.csproj
```

### dotnet remove reference
移除项目引用

```bash
# 移除引用
dotnet remove reference ../MyLibrary/MyLibrary.csproj
```

### dotnet list reference
列出项目引用

```bash
# 列出当前项目的引用
dotnet list reference

# 列出特定项目的引用
dotnet list MyProject/MyProject.csproj reference
```

---

## 构建和运行

### dotnet restore
恢复项目依赖

```bash
# 恢复当前项目
dotnet restore

# 恢复特定项目
dotnet restore MyProject/MyProject.csproj

# 恢复整个解决方案
dotnet restore MySolution.sln

# 指定包源
dotnet restore --source https://api.nuget.org/v3/index.json

# 强制重新评估所有依赖
dotnet restore --force

# 不使用缓存
dotnet restore --no-cache
```

### dotnet build
编译项目

```bash
# 编译当前项目
dotnet build

# 编译特定项目
dotnet build MyProject/MyProject.csproj

# 编译解决方案
dotnet build MySolution.sln

# 指定配置（Debug/Release）
dotnet build -c Release
dotnet build --configuration Debug

# 指定输出目录
dotnet build -o ./build

# 不进行 restore
dotnet build --no-restore

# 详细输出
dotnet build -v detailed
dotnet build --verbosity normal

# 指定目标框架
dotnet build -f net8.0
```

### dotnet run
运行项目

```bash
# 运行当前项目
dotnet run

# 运行特定项目
dotnet run --project MyProject/MyProject.csproj

# 传递参数给程序
dotnet run -- arg1 arg2

# 指定配置
dotnet run -c Release

# 不进行 build
dotnet run --no-build

# 指定框架
dotnet run -f net8.0

# 指定启动 URL（对于 web 应用）
dotnet run --urls "http://localhost:5000"
```

### dotnet clean
清理构建输出

```bash
# 清理当前项目
dotnet clean

# 清理特定配置
dotnet clean -c Release

# 清理特定项目
dotnet clean MyProject/MyProject.csproj
```

### dotnet watch
监视文件更改并自动重新构建/运行

```bash
# 监视并运行
dotnet watch run

# 监视并运行测试
dotnet watch test

# 监视特定项目
dotnet watch --project MyProject/MyProject.csproj run
```

---

## 测试相关

### dotnet test
运行测试

```bash
# 运行所有测试
dotnet test

# 运行特定项目的测试
dotnet test MyTests/MyTests.csproj

# 运行解决方案中所有测试
dotnet test MySolution.sln

# 指定配置
dotnet test -c Release

# 不进行 build
dotnet test --no-build

# 筛选测试
dotnet test --filter "FullyQualifiedName~MyNamespace"
dotnet test --filter "Category=Unit"

# 生成代码覆盖率
dotnet test --collect:"XPlat Code Coverage"

# 详细输出
dotnet test -v detailed

# 并行运行测试
dotnet test --parallel
```

---

## 发布和部署

### dotnet publish
发布应用程序

```bash
# 发布当前项目
dotnet publish

# 指定输出目录
dotnet publish -o ./publish

# 指定配置
dotnet publish -c Release

# 指定运行时标识符（RID）
dotnet publish -r win-x64
dotnet publish -r linux-x64
dotnet publish -r osx-x64

# 自包含发布（包含运行时）
dotnet publish -r win-x64 --self-contained

# 框架依赖发布
dotnet publish -r win-x64 --self-contained false

# 单文件发布
dotnet publish -r win-x64 -p:PublishSingleFile=true

# 启用 ReadyToRun 编译
dotnet publish -c Release -p:PublishReadyToRun=true

# 启用裁剪（减小输出大小）
dotnet publish -c Release -p:PublishTrimmed=true

# 发布 Web 应用
dotnet publish -c Release -o ./publish --no-restore
```

### 常见运行时标识符（RID）

```bash
# Windows
win-x64          # Windows 64位
win-x86          # Windows 32位
win-arm64        # Windows ARM64

# Linux
linux-x64        # Linux 64位
linux-arm64      # Linux ARM64
linux-musl-x64   # Alpine Linux

# macOS
osx-x64          # macOS Intel
osx-arm64        # macOS Apple Silicon (M1/M2)
```

---

## 工具管理

### dotnet tool install
安装 .NET 工具

```bash
# 全局安装工具
dotnet tool install -g dotnet-ef

# 本地安装工具（在项目中）
dotnet tool install dotnet-ef

# 安装特定版本
dotnet tool install -g dotnet-ef --version 7.0.0

# 从特定源安装
dotnet tool install -g MyTool --add-source https://api.nuget.org/v3/index.json
```

### dotnet tool update
更新工具

```bash
# 更新全局工具
dotnet tool update -g dotnet-ef

# 更新本地工具
dotnet tool update dotnet-ef
```

### dotnet tool uninstall
卸载工具

```bash
# 卸载全局工具
dotnet tool uninstall -g dotnet-ef

# 卸载本地工具
dotnet tool uninstall dotnet-ef
```

### dotnet tool list
列出已安装的工具

```bash
# 列出全局工具
dotnet tool list -g

# 列出本地工具
dotnet tool list
```

### 常用的 .NET 工具

```bash
# Entity Framework Core 工具
dotnet tool install -g dotnet-ef

# ASP.NET Core 代码生成器
dotnet tool install -g dotnet-aspnet-codegenerator

# 用户密钥管理
dotnet tool install -g dotnet-user-secrets

# 开发证书
dotnet tool install -g dotnet-dev-certs

# SQL Server 缓存工具
dotnet tool install -g dotnet-sql-cache
```

---

## 完整项目创建流程

### 示例1：创建简单的控制台应用项目结构

```bash
# 1. 创建项目目录
mkdir MyConsoleApp
cd MyConsoleApp

# 2. 创建解决方案
dotnet new sln -n MyConsoleApp

# 3. 创建主项目
dotnet new console -n MyConsoleApp.Core

# 4. 创建类库
dotnet new classlib -n MyConsoleApp.Data

# 5. 创建测试项目
dotnet new xunit -n MyConsoleApp.Tests

# 6. 添加项目到解决方案
dotnet sln add MyConsoleApp.Core/MyConsoleApp.Core.csproj
dotnet sln add MyConsoleApp.Data/MyConsoleApp.Data.csproj
dotnet sln add MyConsoleApp.Tests/MyConsoleApp.Tests.csproj

# 7. 添加项目引用
cd MyConsoleApp.Core
dotnet add reference ../MyConsoleApp.Data/MyConsoleApp.Data.csproj
cd ..

cd MyConsoleApp.Tests
dotnet add reference ../MyConsoleApp.Core/MyConsoleApp.Core.csproj
cd ..

# 8. 添加 NuGet 包
cd MyConsoleApp.Data
dotnet add package Newtonsoft.Json
cd ..

cd MyConsoleApp.Tests
dotnet add package FluentAssertions
cd ..

# 9. 恢复并构建
dotnet restore
dotnet build

# 10. 运行
cd MyConsoleApp.Core
dotnet run
```

### 示例2：创建 Web API 项目结构

```bash
# 1. 创建根目录
mkdir MyWebApi
cd MyWebApi

# 2. 创建解决方案
dotnet new sln -n MyWebApi

# 3. 创建 src 目录
mkdir src
cd src

# 4. 创建 Web API 项目
dotnet new webapi -n MyWebApi.Api

# 5. 创建数据访问层
dotnet new classlib -n MyWebApi.Data

# 6. 创建业务逻辑层
dotnet new classlib -n MyWebApi.Services

# 7. 创建领域模型层
dotnet new classlib -n MyWebApi.Models

cd ..

# 8. 创建 tests 目录
mkdir tests
cd tests

# 9. 创建测试项目
dotnet new xunit -n MyWebApi.Api.Tests
dotnet new xunit -n MyWebApi.Services.Tests

cd ..

# 10. 添加所有项目到解决方案
dotnet sln add src/MyWebApi.Api/MyWebApi.Api.csproj
dotnet sln add src/MyWebApi.Data/MyWebApi.Data.csproj
dotnet sln add src/MyWebApi.Services/MyWebApi.Services.csproj
dotnet sln add src/MyWebApi.Models/MyWebApi.Models.csproj
dotnet sln add tests/MyWebApi.Api.Tests/MyWebApi.Api.Tests.csproj
dotnet sln add tests/MyWebApi.Services.Tests/MyWebApi.Services.Tests.csproj

# 11. 配置项目引用
cd src/MyWebApi.Data
dotnet add reference ../MyWebApi.Models/MyWebApi.Models.csproj
cd ../..

cd src/MyWebApi.Services
dotnet add reference ../MyWebApi.Data/MyWebApi.Data.csproj
dotnet add reference ../MyWebApi.Models/MyWebApi.Models.csproj
cd ../..

cd src/MyWebApi.Api
dotnet add reference ../MyWebApi.Services/MyWebApi.Services.csproj
dotnet add reference ../MyWebApi.Models/MyWebApi.Models.csproj
cd ../..

# 12. 添加 NuGet 包
cd src/MyWebApi.Data
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
cd ../..

cd src/MyWebApi.Api
dotnet add package Swashbuckle.AspNetCore
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
cd ../..

# 13. 构建解决方案
dotnet build

# 14. 运行 API
cd src/MyWebApi.Api
dotnet run
```

### 示例3：创建聊天系统（来自你的示例）

```bash
# 1. 创建根目录
mkdir NetworkerChatDemo
cd NetworkerChatDemo

# 2. 创建解决方案
dotnet new sln -n NetworkerChatDemo

# 3. 创建共享库
dotnet new classlib -n ChatSystem.Common

# 4. 创建服务器
dotnet new console -n ChatSystem.Server

# 5. 创建客户端
dotnet new console -n ChatSystem.Client

# 6. 创建核心网络库
dotnet new classlib -n Networker

# 7. 创建 JSON 扩展
dotnet new classlib -n Networker.Extensions.Json

# 8. 添加到解决方案
dotnet sln add ChatSystem.Common/ChatSystem.Common.csproj
dotnet sln add ChatSystem.Server/ChatSystem.Server.csproj
dotnet sln add ChatSystem.Client/ChatSystem.Client.csproj
dotnet sln add Networker/Networker.csproj
dotnet sln add Networker.Extensions.Json/Networker.Extensions.Json.csproj

# 9. 配置 Networker 依赖
cd Networker
dotnet add package Microsoft.Extensions.DependencyInjection --version 2.2.0
dotnet add package Microsoft.Extensions.Logging --version 2.2.0
dotnet add package System.Memory --version 4.5.2
cd ..

# 10. 配置 JSON 扩展
cd Networker.Extensions.Json
dotnet add reference ../Networker/Networker.csproj
dotnet add package Newtonsoft.Json --version 12.0.3
cd ..

# 11. 配置服务器依赖
cd ChatSystem.Server
dotnet add reference ../ChatSystem.Common/ChatSystem.Common.csproj
dotnet add reference ../Networker/Networker.csproj
dotnet add reference ../Networker.Extensions.Json/Networker.Extensions.Json.csproj
dotnet add package Microsoft.Extensions.Logging.Console --version 2.2.0
cd ..

# 12. 配置客户端依赖
cd ChatSystem.Client
dotnet add reference ../ChatSystem.Common/ChatSystem.Common.csproj
dotnet add reference ../Networker/Networker.csproj
dotnet add reference ../Networker.Extensions.Json/Networker.Extensions.Json.csproj
dotnet add package Microsoft.Extensions.Logging.Console --version 2.2.0
cd ..

# 13. 恢复并构建
dotnet restore
dotnet build

# 14. 运行服务器（在一个终端）
cd ChatSystem.Server
dotnet run

# 15. 运行客户端（在另一个终端）
cd ChatSystem.Client
dotnet run
```

---

## 常见场景示例

### 场景1：克隆项目后的初始化

```bash
# 1. 克隆仓库
git clone https://github.com/username/project.git
cd project

# 2. 恢复 NuGet 包
dotnet restore

# 3. 构建项目
dotnet build

# 4. 运行测试
dotnet test

# 5. 运行项目
dotnet run --project src/MyProject/MyProject.csproj
```

### 场景2：更新所有 NuGet 包

```bash
# 1. 查看过时的包
dotnet list package --outdated

# 2. 更新包（需要手动编辑 .csproj 或使用工具）
# 或者使用 NuGet CLI
nuget update

# 3. 清理和重建
dotnet clean
dotnet restore
dotnet build
```

### 场景3：创建并运行 Docker 化的应用

```bash
# 1. 创建 Web API
dotnet new webapi -n MyDockerApp

# 2. 添加 Dockerfile（手动创建）
# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# ...

# 3. 发布应用
dotnet publish -c Release -o ./publish

# 4. 构建 Docker 镜像
docker build -t mydockerapp .

# 5. 运行容器
docker run -p 8080:80 mydockerapp
```

### 场景4：迁移 .NET Framework 项目到 .NET Core/6+

```bash
# 1. 使用迁移工具评估
dotnet tool install -g try-convert
try-convert -p MyOldProject.csproj

# 2. 创建新的 .NET 6+ 项目
dotnet new classlib -n MyProject -f net8.0

# 3. 复制源文件并调整

# 4. 更新 NuGet 包
dotnet list package
dotnet add package <PackageName> --version <Version>

# 5. 构建并测试
dotnet build
dotnet test
```

### 场景5：性能分析

```bash
# 1. 安装诊断工具
dotnet tool install -g dotnet-trace
dotnet tool install -g dotnet-counters
dotnet tool install -g dotnet-dump

# 2. 运行应用
dotnet run -c Release

# 3. 收集性能数据
dotnet-trace collect --process-id <pid>

# 4. 监控性能计数器
dotnet-counters monitor --process-id <pid>
```

---

## 实用技巧和快捷方式

### 使用 PowerShell 脚本自动化

```powershell
# 批量创建项目
$projects = @("Core", "Data", "Services", "Api")
foreach ($project in $projects) {
    dotnet new classlib -n "MyApp.$project"
    dotnet sln add "MyApp.$project/MyApp.$project.csproj"
}
```

### 使用别名简化命令

```bash
# PowerShell
Set-Alias -Name dnb -Value "dotnet build"
Set-Alias -Name dnr -Value "dotnet run"
Set-Alias -Name dnt -Value "dotnet test"

# Bash/Zsh (~/.bashrc 或 ~/.zshrc)
alias dnb='dotnet build'
alias dnr='dotnet run'
alias dnt='dotnet test'
alias dnp='dotnet publish'
```

### global.json 管理 SDK 版本

```bash
# 创建 global.json 固定 SDK 版本
dotnet new globaljson --sdk-version 8.0.100

# global.json 内容示例
{
  "sdk": {
    "version": "8.0.100",
    "rollForward": "latestPatch"
  }
}
```

### Directory.Build.props 统一项目配置

创建根目录的 `Directory.Build.props`:

```xml
<Project>
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <LangVersion>latest</LangVersion>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
</Project>
```

---

## 常用环境变量

```bash
# 设置 .NET CLI 输出语言
DOTNET_CLI_UI_LANGUAGE=en-US

# 禁用遥测
DOTNET_CLI_TELEMETRY_OPTOUT=1

# 设置包缓存位置
NUGET_PACKAGES=/path/to/packages

# 跳过首次运行体验
DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1

# 使用示例（PowerShell）
$env:DOTNET_CLI_TELEMETRY_OPTOUT = "1"
dotnet build

# 使用示例（Bash）
export DOTNET_CLI_TELEMETRY_OPTOUT=1
dotnet build
```

---

## 总结

### 最常用的命令速查

```bash
# 创建和管理
dotnet new sln -n MySolution
dotnet new console -n MyApp
dotnet sln add MyApp/MyApp.csproj

# 包管理
dotnet add package PackageName
dotnet remove package PackageName
dotnet list package

# 引用管理
dotnet add reference ../MyLibrary/MyLibrary.csproj
dotnet list reference

# 构建和运行
dotnet restore
dotnet build
dotnet run
dotnet test

# 发布
dotnet publish -c Release -o ./publish

# 工具
dotnet tool install -g ToolName
dotnet tool list -g
```

### 项目结构最佳实践

```
MySolution/
├── MySolution.sln
├── src/
│   ├── MyApp.Api/
│   ├── MyApp.Core/
│   ├── MyApp.Data/
│   └── MyApp.Models/
├── tests/
│   ├── MyApp.Api.Tests/
│   └── MyApp.Core.Tests/
├── docs/
├── scripts/
└── README.md
```

.NET CLI 是一个功能强大的工具，掌握这些命令可以大大提高开发效率。建议常用命令熟练掌握，其他命令需要时查阅即可。