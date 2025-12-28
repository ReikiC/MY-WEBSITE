## LangSmith 网页和后端 Graph 的关联

### 🔗 **关键概念**

```
LangSmith 网页 (Web UI)
    ↑
    │ (通过 API Key 连接)
    │
LangSmith Cloud (https://smith.langchain.com)
    ↑
    │ (自动上传追踪数据)
    │
Backend Graph (langgraph dev 运行时)
```

---

### 🚀 **启动流程：`langgraph dev` 做了什么**

当你运行：
```bash
cd backend
uv run langgraph dev
```

LangGraph CLI 会：

#### **第 1 步：读取配置** (`langgraph.json`)
```json
{
  "graphs": {
    "agent": "./src/agent/graph.py:graph"
  },
  "http": {
    "app": "./src/agent/app.py:app"
  },
  "env": ".env"
}
```

#### **第 2 步：启动三个服务**

```
langgraph dev
├─ 后端 API Server (http://localhost:8000)
│  └─ 暴露 LangGraph Agent
│
├─ LangGraph Studio UI (http://localhost:8123)
│  └─ 本地 Web 界面，用于测试 Agent
│
└─ 自动检测 .env 中的 LANGSMITH_API_KEY
   └─ 如果配置了，自动上传追踪数据到 LangSmith Cloud
```

#### **第 3 步：自动打开浏览器**

```bash
$ uv run langgraph dev

✓ Uvicorn server running on http://localhost:8000
✓ LangGraph Studio running on http://localhost:8123

Opening browser to http://localhost:8123...  ← 自动打开
```

---

### 🌐 **两种看图的方式**

#### **方式 1：本地 LangGraph Studio** (Always Available)

```
http://localhost:8123  (langgraph dev 自动启动)
│
└─ 完全本地运行
   ├─ 看不到其他人的数据
   ├─ 查不到历史运行记录
   └─ 适合快速调试
```

#### **方式 2：云端 LangSmith** (需要配置 API Key)

```
https://smith.langchain.com  (需要手动打开)
│
└─ 云端平台
   ├─ 可以看到完整追踪信息
   ├─ 保存所有历史运行记录
   ├─ 支持团队协作
   └─ 需要 LANGSMITH_API_KEY
```

---

### 🔑 **云端 LangSmith 关联步骤**

#### **第 1 步：获取 API Key**

访问 [LangSmith Settings](https://smith.langchain.com/settings) 获取 API Key

#### **第 2 步：配置到项目**

**开发环境** - 修改 `.env` 文件：
```bash
# backend/.env
LANGSMITH_API_KEY=your_api_key_here
```

**生产环境** - Docker Compose：
```bash
LANGSMITH_API_KEY=<your_langsmith_api_key> docker-compose up
```

#### **第 3 步：自动关联**

LangChain/LangGraph 框架会自动检测环境变量：

```python
# 这是 langchain 库内部自动做的，无需在代码中显式配置
import os

if "LANGSMITH_API_KEY" in os.environ:
    # 自动启用追踪
    # 所有 LLM 调用、工具执行都会被记录
```

---

### 📊 **Graph 中追踪的流程**

```
Graph 执行（在 langgraph dev 中）
├─ generate_query node 执行
│  ├─ 调用 OpenAI API
│  ├─ 追踪数据被捕获
│  └─ 如果配置了 LANGSMITH_API_KEY，上传到云端
│
├─ web_research node 执行
│  └─ 继续追踪...
│
├─ reflection node 执行
│  └─ 继续追踪...
│
└─ finalize_answer node 执行
   └─ 完整的执行链被保存

    ↓ (自动上传到)

LangSmith Cloud (https://smith.langchain.com)
└─ 可以看到完整的执行链、每个 node 的输入输出、token 消耗等
```

---

### 🎯 **LangSmith 能看到什么**

#### **在 LangSmith Cloud 上** (https://smith.langchain.com/projects)

```
Project: "default"
├─ Run 1 (执行记录)
│  ├─ generate_query node
│  │  ├─ Input: {"messages": [...]}
│  │  ├─ Output: {"search_query": ["query1", "query2"]}
│  │  └─ Tokens used: 150
│  │
│  ├─ web_research node (× 2)
│  │  ├─ Input: {"search_query": "query1"}
│  │  └─ Output: {"web_research_result": [...]}
│  │
│  ├─ reflection node
│  │  ├─ Input: {"web_research_result": [...]}
│  │  └─ Output: {"is_sufficient": true}
│  │
│  └─ finalize_answer node
│     ├─ Input: {...}
│     └─ Output: {"messages": [AIMessage(...)]}
│
├─ Run 2 (下一次执行)
│  └─ ...
│
└─ Run N
   └─ ...
```

#### **在本地 LangGraph Studio** (http://localhost:8123)

```
左侧面板：选择执行记录
中间面板：显示 Graph 结构
右侧面板：显示当前执行的 Node 和数据
```

---

### 💾 **数据存储位置**

```
开发环境：
├─ 本地 Studio 数据
│  └─ 存储在：内存 或 ~/.langgraph/
│
└─ LangSmith Cloud (如果配置了 API Key)
   └─ 存储在：https://smith.langchain.com (云端)

生产环境（Docker）：
├─ PostgreSQL (langgraph-postgres)
│  └─ 存储 runs、threads、assistant 数据
│
├─ Redis (langgraph-redis)
│  └─ 用于消息队列和实时推送
│
└─ LangSmith Cloud (如果配置了 API Key)
   └─ 完整的追踪日志 (云端备份)
```

---

### 🔄 **完整流程示意**

#### **开发场景**

```
$ make dev

1. 启动后端 (langgraph dev)
   ├─ 读取 langgraph.json
   ├─ 读取 .env (检查 LANGSMITH_API_KEY)
   ├─ 启动 API Server (localhost:8000)
   ├─ 启动 Studio UI (localhost:8123)
   └─ 自动打开浏览器到 http://localhost:8123

2. 在 Studio 中测试 Agent
   ├─ 输入消息
   └─ 看到执行链：generate_query → web_research → reflection → finalize_answer

3. 同时上传到 LangSmith Cloud
   ├─ 如果配置了 LANGSMITH_API_KEY
   └─ 访问 https://smith.langchain.com 看详细追踪
```

#### **生产场景**

```
```
```
$ LANGSMITH_API_KEY=<key> docker-compose up

1. 启动所有服务
   ├─ Redis (消息队列)
   ├─ PostgreSQL (状态存储)
   └─ LangGraph API (localhost:8123)

2. 执行 Agent
   ├─ 所有执行记录保存到 PostgreSQL
   └─ 同时上传到 LangSmith Cloud

3. 查看执行记录
   ├─ 本地：http://localhost:8123 (LangGraph API UI)
   └─ 云端：https://smith.langchain.com (LangSmith)
```

---

### 📱 **访问 URL 总结**

| 地址 | 何时出现 | 需要什么 |
|------|--------|---------|
| `http://localhost:8123` | `langgraph dev` 时 | 无需配置 |
| `http://localhost:8000/api` | `langgraph dev` 时 | 无需配置 |
| `https://smith.langchain.com` | 任何时候 | LANGSMITH_API_KEY |
| `http://localhost:8123/app` | 前端打开 | 访问完整应用 |

---

### ⚙️ **环境变量配置**

```bash
# .env
OPENAI_API_KEY=sk-xxx          # OpenAI API Key (必需)
LANGSMITH_API_KEY=lsv_xxx      # LangSmith API Key (可选)

# 自动作用：
# 1. LangChain 检测到 LANGSMITH_API_KEY
# 2. 所有 LLM 调用自动被追踪
# 3. 追踪数据自动上传到 LangSmith Cloud
```

总结一句话：**`langgraph dev` 自动启动本地 Studio，如果配置了 `LANGSMITH_API_KEY` 环境变量，所有执行数据会同时上传到 LangSmith Cloud，形成完整的追踪记录！**