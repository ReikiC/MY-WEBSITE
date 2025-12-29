# DAG 在 Agent 系统中的应用：从理论到实践

## 目录
1. [DAG 的核心概念](#dag-的核心概念)
2. [DAG 对 Agent 系统的启发](#dag-对-agent-系统的启发)
3. [当前流行方案对比](#当前流行方案对比)
4. [实现案例分析](#实现案例分析)
5. [最佳实践](#最佳实践)

---

## DAG 的核心概念

### 什么是 DAG？

**DAG** (Directed Acyclic Graph，有向无环图) 是一种图论数据结构，定义如下：

```
定义：
- Directed（有向）：边有方向，从起点指向终点
- Acyclic（无环）：不存在循环路径
- Graph（图）：由节点（顶点）和边组成

数学表示：
G = (V, E)
- V：顶点集合 {v1, v2, v3, ...}
- E：边集合 {(v1→v2), (v1→v3), ...}

约束条件：
∄ 路径 v_i → v_j → ... → v_i（不存在回路）
```

### DAG 的可视化

```
简单 DAG 例子：

    v1
   /  \
  v2  v3
  |   |
  v4  |
   \ /
    v5

特点：
- 从 v1 出发可以到达 v5（多条路径）
- 没有循环
- 可以定义拓扑排序
```

### DAG 的关键性质

```
1. 拓扑排序（Topological Sort）
   将所有节点排成一条线，保证：
   如果存在边 u→v，则 u 在排序中必然在 v 之前
   
   例子：v1 → v2 → v4 → v5
         v1 → v3 → v5
   
   拓扑排序结果：v1, v2, v3, v4, v5（多个有效排序）

2. 最长路径问题可以高效求解（O(V+E)）
   在 DAG 中，可以用动态规划找出从任意点到任意点的最长路径

3. 可以进行动态规划
   因为没有环，所以能按拓扑序遍历，每个节点的结果只需计算一次

4. 支持并行化
   没有依赖关系的节点可以并行执行
   
   例子：
   v2 和 v3 没有依赖关系 → 可以并行
   v4 依赖 v2 → 必须等 v2 完成
```

### DAG vs 其他图结构

```
DAG                     环形图              树
-----                   -------             ---
    v1                    v1              v1
   /  \                   /  \            / \
  v2  v3                 v2--v3          v2 v3
  |   |                  |   |           |
  v4  |                  v4  |          v4
   \ /                    \ /
    v5                    v5
                         (无法执行)   (特殊的DAG)

特点：无环           特点：有环      特点：
可以执行任务         无法执行        单亲（严格）
支持复杂依赖         需要打破环      依赖关系简单
```

---

## DAG 对 Agent 系统的启发

### 问题：为什么需要 DAG？

#### 场景 1：线性 Pipeline（不需要 DAG）

```
输入 → Node1 → Node2 → Node3 → 输出

这是一条直线，不需要 DAG。
但现实很复杂...
```

#### 场景 2：条件分支（需要 DAG）

```
输入
 ↓
[决策]
 ├─ if A → PathA（查询数据库）→ 处理
 ├─ if B → PathB（调用 API）→ 处理
 └─ if C → PathC（读文件）→ 处理
 ↓
[汇聚点]合并结果
 ↓
输出

每条路径是独立的，最后汇聚 → DAG！
```

#### 场景 3：并行工作（需要 DAG）

```
研究任务
 ↓
┌─────────────────────┐
│  分解成三个子任务    │
└─────────────────────┘
 ↙        ↓        ↘
[Research] [Code] [Analysis]  ← 可以并行
 ↖        ↓        ↙
┌─────────────────────┐
│  汇聚结果，生成报告  │
└─────────────────────┘
 ↓
输出

三个任务没有依赖 → 可以并行执行 ✓
最后汇聚合并 → DAG ✓
```

#### 场景 4：复杂依赖（需要 DAG）

```
大项目任务：构建完整系统

设计方案
 ↙      ↖
数据库设计  API设计
 ↓         ↓
初始化DB  实现API
 ↖       ↙
  集成测试
  ↓
部署

多个节点，多种依赖关系 → DAG ✓
```

### DAG 如何解决 Agent 系统的问题

#### 问题 1：工作流不可预测

传统方式：
```python
def agent_work(task):
    result1 = do_research(task)
    if sufficient(result1):
        return result1
    else:
        result2 = do_more_research(task)
        if sufficient(result2):
            return result2
        else:
            # ... 无限嵌套可能
            pass

问题：
- 无法可视化整个流程
- 无法预测执行时间
- 无法复用工作流
```

DAG 解决方案：
```
[Research]
    ↓
[Evaluate] ──是→ [Finalize] → 输出
    ↓
   否
    ↓
[Research] (再次)
    ↓
[Evaluate]
    ...

好处：
- 清晰的拓扑结构
- 可以可视化
- 可以计算最大步数
- 支持条件循环
```

#### 问题 2：无法利用并行性

传统 Hub-Spoke（星形）：
```python
main_agent.call_subagent("research")      # 等待完成
main_agent.call_subagent("code")          # 然后调用
main_agent.call_subagent("analysis")      # 再调用

总时间 = 研究时间 + 编码时间 + 分析时间
```

DAG 并行方案：
```python
# 同时启动三个任务
tasks = [
    research_team.start(),
    code_team.start(),
    analysis_team.start(),
]
results = await asyncio.gather(*tasks)

总时间 = max(研究时间, 编码时间, 分析时间)
         通常能快 3 倍！
```

#### 问题 3：无法处理复杂依赖

```
简单的顺序依赖：A → B → C
这很容易用 if/else 实现

复杂的依赖：
          ┌─────────────┐
          │  Task Input │
          └─────────────┘
             ↙  ↓  ↘
           A    B    C (并行)
           ↓    ↓    ↓
           ├────┼────┤
           │    ↓    │
           D    E    F (E 依赖 A, B)
           │    ↓    │ (F 依赖 B, C)
           └────┼────┘
                ↓
           ┌─────────────┐
           │  Synthesis  │
           └─────────────┘

这很难用 if/else 表达
但用 DAG 非常清晰！
```

### DAG 的核心启发

```
启发 1：显式表达依赖关系
────────────────────────
传统：隐式（代码逻辑中）
DAG：显式（图结构中）

示例对比：
# 传统（隐式）
def workflow():
    r1 = research()
    if r1.sufficient:
        return finalize(r1)
    else:
        r2 = research()
        return finalize(r2)

# DAG（显式）
graph.add_edge("research", "evaluate")
graph.add_conditional_edges(
    "evaluate",
    lambda x: "finalize" if x.sufficient else "research",
    ["finalize", "research"]
)

优势：可视化、可验证、可复用


启发 2：支持并行和异步
─────────────────
传统：顺序执行
DAG：自动识别并行机会

示例：
# LangGraph 自动识别：
web_research ×3 个实例（无相互依赖）
→ 自动并行执行


启发 3：支持循环，但有保证
──────────────────
传统：可能无限循环
DAG：通过条件边可以实现可控循环

示例：
"evaluate" 可以有一条边回到 "research"
但必须有终止条件（evaluation 返回 "finalize"）


启发 4：可以进行静态分析
────────────────
DAG 的拓扑结构允许：
- 验证流程的正确性（所有节点都能被访问吗？）
- 计算最坏情况执行时间
- 识别关键路径（瓶颈在哪？）
- 进行资源分配优化

示例：
find_critical_path(graph)
→ 研究时间通常是瓶颈
→ 优化研究可以加速整个流程
```

---

## 当前流行方案对比

### 方案 1：LangGraph（最成熟）

#### 核心设计

```python
from langgraph.graph import StateGraph, START, END

# 定义状态
class State(TypedDict):
    messages: Annotated[list, add_messages]
    search_results: list
    final_answer: str

# 创建 DAG
graph = StateGraph(State)

# 添加节点
graph.add_node("research", research_node)
graph.add_node("analyze", analyze_node)
graph.add_node("finalize", finalize_node)

# 添加边（定义 DAG 结构）
graph.add_edge(START, "research")
graph.add_edge("research", "analyze")
graph.add_conditional_edges(
    "analyze",
    lambda x: "finalize" if x.sufficient else "research",
    ["research", "finalize"]
)
graph.add_edge("finalize", END)

# 编译为可执行的 DAG
compiled_graph = graph.compile()
```

#### 特点

```
✅ 优点：
- 完全显式的 DAG 定义
- 支持状态合并（add_messages, operator.add）
- 自动并行（Send()）
- 支持子图嵌套
- 完整的追踪和调试
- 与 LangSmith 集成

❌ 缺点：
- 学习曲线较陡
- 需要显式定义所有节点和边
- 状态共享可能导致 context bloat
```

#### DAG 特性支持

```
拓扑排序：✓ 支持（编译时）
并行执行：✓ 支持（Send()）
条件分支：✓ 支持（conditional_edges）
循环：✓ 支持（条件边可以回指）
嵌套：✓ 支持（subgraph）
静态分析：✓ 支持（graph.get_graph()）
```

### 方案 2：OpenAI Swarm（最简洁）

#### 核心设计

```python
from swarm import Swarm, Agent

def transfer_to_code():
    return code_agent

research_agent = Agent(
    name="research",
    instructions="Do research...",
    functions=[transfer_to_code],  # 可以转移到其他 agent
)

code_agent = Agent(
    name="code",
    instructions="Write code...",
    functions=[],
)

client = Swarm()
response = client.run(research_agent, "Research and code...")
```

#### 特点

```
✅ 优点：
- 非常简洁
- 学习成本低
- 自然的对话流程
- Agent 可以直接转移

❌ 缺点：
- DAG 隐式（在代码逻辑中）
- 不支持真正的并行
- 无法进行静态分析
- 不支持复杂的依赖关系
```

#### DAG 特性支持

```
拓扑排序：✗ 不支持
并行执行：✗ 不支持
条件分支：△ 部分支持（return different agent）
循环：✓ 支持（agent.transfer）
嵌套：△ 部分支持
静态分析：✗ 不支持
```

### 方案 3：CrewAI（最灵活）

#### 核心设计

```python
from crewai import Agent, Task, Crew

research_agent = Agent(
    role="Research Expert",
    goal="Conduct thorough research",
    tools=[search_tool, api_tool],
)

code_agent = Agent(
    role="Code Expert",
    goal="Write clean code",
    tools=[code_executor],
)

task1 = Task(
    description="Research the topic",
    agent=research_agent,
)

task2 = Task(
    description="Write code based on research",
    agent=code_agent,
    depends_on=[task1],  # ← 显式依赖
)

crew = Crew(agents=[research_agent, code_agent], tasks=[task1, task2])
result = crew.kickoff()
```

#### 特点

```
✅ 优点：
- 角色和目标清晰
- 显式的任务依赖关系
- 支持 tools 集成
- 较好的 memory 管理

❌ 缺点：
- DAG 只在 Task 级别（不够细粒度）
- 不支持真正的并行（还在开发中）
- Node 级别没有细粒度控制
```

#### DAG 特性支持

```
拓扑排序：△ 部分支持（task 级别）
并行执行：△ 部分支持（开发中）
条件分支：△ 部分支持（callback）
循环：✗ 不支持
嵌套：△ 部分支持
静态分析：△ 部分支持
```

### 方案 4：AutoGen（最成熟的多 Agent）

#### 核心设计

```python
from autogen import AssistantAgent, UserProxyAgent

# 定义 agent
researcher = AssistantAgent(
    name="Researcher",
    system_message="You are a researcher...",
)

programmer = AssistantAgent(
    name="Programmer",
    system_message="You are a programmer...",
)

user_proxy = UserProxyAgent(
    name="User",
    human_input_mode="NEVER",
)

# 定义对话（隐式 DAG）
user_proxy.initiate_chat(
    researcher,
    message="Research AI trends",
)

# researcher 可以委托给 programmer
# 通过消息内容（隐式）
```

#### 特点

```
✅ 优点：
- 多 Agent 对话流程很自然
- 支持复杂的协作
- 有内存管理
- 可以自动委托

❌ 缺点：
- DAG 完全隐式（对话内容中）
- 难以可视化
- 难以验证
- 难以预测执行时间
```

#### DAG 特性支持

```
拓扑排序：✗ 不支持
并行执行：✗ 不支持
条件分支：△ 隐式（通过消息）
循环：✓ 支持（自然对话）
嵌套：△ 支持（agent 群组）
静态分析：✗ 不支持
```

### 方案对比总结

```
                LangGraph  Swarm  CrewAI  AutoGen
────────────────────────────────────────────────
DAG 显式性       ★★★★★     ★☆☆☆☆   ★★☆☆☆   ★☆☆☆☆
并行执行        ★★★★★     ★☆☆☆☆   ★★☆☆☆   ★☆☆☆☆
静态分析        ★★★★☆     ★☆☆☆☆   ★★☆☆☆   ★☆☆☆☆
学习成本        ★★★☆☆     ★★★★★   ★★★☆☆   ★★★☆☆
复杂性支持      ★★★★★     ★★☆☆☆   ★★★☆☆   ★★★★☆
社区活跃度      ★★★★☆     ★★★★★   ★★★☆☆   ★★★★☆
生产就绪        ★★★★★     ★★★☆☆   ★★★☆☆   ★★★★☆
────────────────────────────────────────────────

推荐场景：
- LangGraph：复杂工作流、需要精细控制
- Swarm：简单 Agent 对话、快速原型
- CrewAI：多 Agent 协作、具有明确角色
- AutoGen：研究、需要自然的多轮对话
```

---

## 实现案例分析

### 案例 1：当前项目的 DAG

#### 现状

```
START
  ↓
[generate_query]
  ↓
[continue_to_web_research] ← 路由节点
  ├→ [web_research] (id=0)
  ├→ [web_research] (id=1)
  └→ [web_research] (id=2) ← 并行执行
  ↓（所有完成后合并）
[reflection]
  ↓
[evaluate_research] ← 条件节点
  ├→ "finalize_answer" (if sufficient)
  └→ "web_research" (if not) ← 循环！
  ↓
[finalize_answer]
  ↓
END

DAG 特性分析：
✓ 显式的 DAG 结构
✓ 支持并行（web_research ×3）
✓ 支持循环（evaluate 的条件边）
✓ 支持状态合并（web_research 结果自动拼接）
```

#### DAG 优化方向

```
优化 1：并行研究和分析
────────────────────

当前：
[web_research] → [reflection] → [evaluate]

问题：必须等所有 web_research 完成才能进行 reflection

优化：如果有足够的信息，可以提前进行 reflection
[web_research #1] ──→ [reflection] ──→ [evaluate]
[web_research #2] ──→ /
[web_research #3] ──→ /

实现：使用 StreamIn 或 GroupByNode


优化 2：多个反思循环并行
────────────────────

当前：一个 evaluate 决定是否继续，串行

优化：不同的知识缺口并行补充
[web_research] → [reflection] → [evaluate]
   ↑                                ↓
   └── [specialized_research] ←────┘
       (针对特定缺口)

实现：使用 SendMany 生成多个并行的 specialized_research


优化 3：分阶段处理
──────────────

当前：所有数据都在全局状态

优化：使用子图隔离不同阶段
┌─ [Research Team] ────┐
│ ├─ generate_query    │ → research_output
│ ├─ web_research      │
│ └─ compile_results   │
└──────────────────────┘
         ↓
┌─ [Analysis Team] ────┐
│ ├─ reflection        │ → analysis_output
│ └─ evaluate          │
└──────────────────────┘
         ↓
┌─ [Finalization] ─────┐
│ └─ finalize_answer   │ → final_output
└──────────────────────┘
```

### 案例 2：电商推荐系统的 DAG

#### 系统需求

```
用户查询 → 推荐产品

涉及任务：
1. 查询用户历史（并行）
2. 查询产品库（并行）
3. 基于用户查询分类（单个）
4. 计算相似度（并行）
5. 排序和过滤（单个）
6. 生成解释（并行）
7. 综合结果（单个）
```

#### DAG 结构

```
                    INPUT
                      ↓
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
    [User History] [Product DB] [Query Classify]
        ↓             ↓             ↓
        └─────────────┼─────────────┘
                      ↓
              ┌──────────────────┐
              │ [Similarity Cal] │ ← 并行（为每个产品计算）
              └──────────────────┘
                      ↓
            [Sort & Filter]
                      ↓
           ┌─────────┼─────────┐
           ↓         ↓         ↓
    [Explain-1] [Explain-2] [Explain-3] ← 并行
           ↓         ↓         ↓
           └─────────┼─────────┘
                      ↓
            [Synthesize Results]
                      ↓
                    OUTPUT

关键特性：
✓ 并行：User History + Product DB + Query Classify
✓ 依赖：Similarity Cal 依赖前三个的结果
✓ 并行：Explain 为多个产品并行生成
✓ 汇聚：最后综合所有解释
```

#### LangGraph 实现

```python
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send
from typing import TypedDict, Annotated, List
import operator

class RecommendState(TypedDict):
    query: str
    user_id: str
    user_history: List[dict]
    product_db: List[dict]
    query_class: str
    similarities: Annotated[List[dict], operator.add]
    explanations: Annotated[List[str], operator.add]
    final_recommendations: List[dict]

# 节点定义
async def get_user_history(state):
    # 查询数据库
    return {"user_history": fetch_user_history(state["user_id"])}

async def get_product_db(state):
    # 获取产品库
    return {"product_db": fetch_product_db()}

async def classify_query(state):
    # 分类用户查询
    class_label = llm.classify(state["query"])
    return {"query_class": class_label}

async def calculate_similarity(state):
    # 为每个产品计算相似度
    return [
        Send("generate_explanation", {"product": p, "similarity": sim})
        for p, sim in compute_similarities(state)
    ]

async def generate_explanation(state):
    # 生成单个产品的解释
    explanation = llm.explain(state["product"], state["similarity"])
    return {"explanations": [explanation]}

async def sort_and_filter(state):
    # 排序和过滤
    sorted_products = sort_by_similarity(state["similarities"])
    filtered = filter_by_score(sorted_products, threshold=0.5)
    return {"final_recommendations": filtered}

# 构建图
graph = StateGraph(RecommendState)

graph.add_node("user_history", get_user_history)
graph.add_node("product_db", get_product_db)
graph.add_node("classify_query", classify_query)
graph.add_node("calc_similarity", calculate_similarity)
graph.add_node("gen_explanation", generate_explanation)
graph.add_node("sort_filter", sort_and_filter)

# 添加边
graph.add_edge(START, "user_history")
graph.add_edge(START, "product_db")
graph.add_edge(START, "classify_query")

graph.add_edge("user_history", "calc_similarity")
graph.add_edge("product_db", "calc_similarity")
graph.add_edge("classify_query", "calc_similarity")

graph.add_conditional_edges(
    "calc_similarity",
    lambda x: [Send("gen_explanation", ...) for ...],
    ["gen_explanation"]
)

graph.add_edge("gen_explanation", "sort_filter")
graph.add_edge("sort_filter", END)

compiled = graph.compile()

# 执行
result = compiled.invoke({
    "query": "我想要一个便宜的手机",
    "user_id": "user123"
})
```

---

## 最佳实践

### 设计 DAG 的原则

#### 原则 1：显式化依赖关系

```
✗ 不好的做法（隐式）
────────────────
def workflow(task):
    if is_research_task(task):
        result = research(task)
    else:
        result = something_else(task)
    
    if result.sufficient:
        return finalize(result)
    else:
        # ... 嵌套逻辑
    
问题：很难看出完整的流程

✓ 好的做法（显式）
────────────────
graph = StateGraph(State)
graph.add_node("research", research_node)
graph.add_node("evaluate", evaluate_node)
graph.add_node("finalize", finalize_node)

graph.add_edge(START, "research")
graph.add_conditional_edges(
    "research",
    route_on_task_type,
    ["research", "something_else"]
)

好处：一目了然，可以画出来
```

#### 原则 2：最小化节点间的数据转移

```
✗ 不好的做法
────────────
state = {
    "all_research_results": [...],  # 很大
    "all_analysis_results": [...],  # 很大
    "all_temp_data": [...],         # 很大
}

问题：每个节点都看到所有数据，context bloat

✓ 好的做法
────────
# 使用子图隔离

research_state = {
    "query": str,
    "results": list,
}

analysis_state = {
    "results": list,
    "analysis": dict,
}

main_state = {
    "input": str,
    "research_summary": str,
    "final_output": str,
}

好处：每个节点只看需要的数据
```

#### 原则 3：设计可复用的子图

```
✓ 好的做法
────────

# 定义可复用的 Research 子图
class ResearchTeam:
    def build_graph(self):
        g = StateGraph(ResearchState)
        g.add_node("generate_query", ...)
        g.add_node("search", ...)
        g.add_node("compile", ...)
        return g.compile()

# 在多个地方复用
main_graph.add_node("research_team", ResearchTeam().build_graph())
main_graph.add_node("deeper_research", ResearchTeam().build_graph())

好处：减少代码重复，容易维护
```

#### 原则 4：设计清晰的接口

```
✓ 好的做法
────────

class NodeInterface:
    """清晰的节点接口"""
    
    INPUT_SCHEMA = {
        "query": str,
        "depth": Literal["shallow", "deep"],
    }
    
    OUTPUT_SCHEMA = {
        "results": List[dict],
        "confidence": float,
    }
    
    DEPENDENCIES = ["user_history", "product_db"]
    
    async def execute(self, state):
        # 节点逻辑
        pass

好处：可以自动化路由、验证、配置
```

### DAG 的常见反模式

#### 反模式 1：环形依赖

```
✗ 错误
──
Node-A → Node-B
  ↑       ↓
  └───────┘

解决：
1. 打破环（如上面的 evaluate 返回不同节点）
2. 使用条件边确保循环有终止条件
```

#### 反模式 2：过于复杂的分支

```
✗ 错误
──
一个节点有 20+ 个条件分支
→ 难以维护

✓ 改进
───
使用路由层简化：
graph.add_node("router", route_node)
graph.add_conditional_edges("router", route_fn, 20_targets)

或使用子图：
graph.add_node("subgraph", complex_subgraph.compile())
```

#### 反模式 3：所有数据都在全局状态

```
✗ 错误
──
state = {
    "all_data": {...},  # 巨大的字典
}

✓ 改进
───
# 使用可选字段和类型提示
state = {
    "input": str,
    "research_results": Optional[List],  # 只在需要时填充
    "analysis_results": Optional[Dict],  # 只在需要时填充
}
```

### 性能优化

#### 优化 1：并行化关键路径外的任务

```
# 识别关键路径
critical_path = find_critical_path(graph)

# 关键路径：Research (2s) → Analysis (1s) = 3s
# 非关键路径：UI Rendering (0.5s)

# 优化：并行执行 UI Rendering，不阻塞 Analysis
graph.add_edge("research", "analysis")
graph.add_edge("research", "render_ui")  # 并行
graph.add_edge(["analysis", "render_ui"], "finalize")
```

#### 优化 2：流式处理

```
# 不等待所有 web_search 完成再做 reflection
# 而是边搜索边反思

graph.add_node("streaming_search", search_and_stream)
# search_and_stream 返回流式结果，reflection 可以增量处理

好处：减少总延迟
```

#### 优化 3：缓存中间结果

```
# 如果同样的查询出现过，直接用缓存

class CachedNode:
    def __init__(self, node_fn):
        self.node_fn = node_fn
        self.cache = {}
    
    async def __call__(self, state):
        cache_key = hash(state["query"])
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        result = await self.node_fn(state)
        self.cache[cache_key] = result
        return result
```

---

## 总结

### 为什么要用 DAG？

```
1. 显式化复杂的工作流
   从 if/else 地狱 → 清晰的图结构

2. 支持并行执行
   从串行 → 充分利用计算资源

3. 支持循环和条件
   既有明确的流程，又能处理动态情况

4. 可验证和可追踪
   能做静态分析，能追踪执行

5. 易于维护和扩展
   新增功能时，只需添加节点和边
```

### 选择哪个框架？

```
┌─────────────────────────────────────┐
│ 想要精细控制和复杂工作流？          │
│ → LangGraph                         │
└─────────────────────────────────────┘
         ↓ 否
┌─────────────────────────────────────┐
│ 想要快速原型和简洁 API？            │
│ → Swarm                             │
└─────────────────────────────────────┘
         ↓ 否
┌─────────────────────────────────────┐
│ 想要角色清晰的多 Agent 协作？        │
│ → CrewAI                            │
└─────────────────────────────────────┘
         ↓ 否
┌─────────────────────────────────────┐
│ 想要自然对话的多轮协作？            │
│ → AutoGen                           │
└─────────────────────────────────────┘
```

### 未来方向

```
1. DAG 编译优化
   - 自动识别并行机会
   - 自动资源分配
   - 自动缓存决策

2. Contract-based DAG
   - 节点声明输入输出契约
   - DAG 自动生成和优化
   - 不需要手动定义边

3. 学习性 DAG
   - 根据执行历史优化
   - 动态调整拓扑
   - 自适应路由

4. 分布式 DAG
   - 跨机器执行
   - 自动负载均衡
   - 容错和恢复
```

---

## 参考资源

### 官方文档
- [LangGraph Docs](https://langchain-ai.github.io/langgraph/)
- [OpenAI Swarm](https://github.com/openai/swarm)
- [CrewAI](https://docs.crewai.com/)
- [AutoGen](https://microsoft.github.io/autogen/)

### 论文和研究
- DAG 理论基础：《Introduction to Algorithms》- Cormen, Leiserson, Rivest, Stein
- 多 Agent 系统：《Multi-Agent Systems: An Introduction to Distributed AI》
- 工作流优化：《Scientific Workflow Provenance》

### 博客和文章
- LangGraph 设计思想
- 多 Agent 架构对比
- DAG 在 ML Pipeline 中的应用

