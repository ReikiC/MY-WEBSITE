
## LangGraph 节点和 Graph 详解

### 🎯 **核心概念理解**

LangGraph 是一个用于构建 **有状态的多步骤 AI 工作流** 的框架。你可以把它比作：

```
传统程序 → if/else 逻辑控制流
LangGraph  → 状态机 + DAG (有向无环图)
```

---

### 📦 **三个核心组件**

#### **1. 节点（Node）- 工作单元**

一个节点就是一个 **Python 函数**，接收状态，处理，返回更新后的状态：

```python
def generate_query(state: OverallState, config: RunnableConfig) -> QueryGenerationState:
    """这就是一个节点"""
    # 接收状态
    research_topic = get_research_topic(state["messages"])
    
    # 处理逻辑
    llm = ChatOpenAI(...)
    result = llm.invoke(formatted_prompt)
    
    # 返回状态更新
    return {"search_query": result.query}
```

**节点的特点**：
- 是一个 **纯函数** (给定输入，总是相同输出)
- 接收 `state` (整个工作流的状态)
- 返回 `字典` (状态的部分更新)
- 可以调用 LLM、数据库、API 等任何外部服务

---

#### **2. 边（Edge）- 连接**

边定义节点之间的 **执行顺序** 和 **条件**：

```python
# 固定边：总是执行这个路径
builder.add_edge(START, "generate_query")
builder.add_edge("web_research", "reflection")

# 条件边：根据条件决定下一步
builder.add_conditional_edges(
    "reflection",           # 从哪个节点出发
    evaluate_research,      # 决策函数（返回下一个节点名）
    ["web_research", "finalize_answer"]  # 可能的目标节点
)
```

**两种边**：
- `add_edge()` - 顺序边，无条件跳转
- `add_conditional_edges()` - 条件边，根据状态决定下一步

---

#### **3. 状态（State）- 数据流**

状态是 **整个工作流共享的数据**：

```python
class OverallState(TypedDict):
    messages: Annotated[list, add_messages]           # 消息列表
    search_query: Annotated[list, operator.add]        # 搜索查询
    web_research_result: Annotated[list, operator.add] # 研究结果
    sources_gathered: Annotated[list, operator.add]    # 收集的源
    initial_search_query_count: int                     # 初始查询数
    max_research_loops: int                             # 最大循环数
    research_loop_count: int                            # 当前循环数
    reasoning_model: str                                # 推理模型
```

**`Annotated[list, operator.add]` 的含义**：
- 当多个节点返回相同的 key 时，**自动合并** (而不是覆盖)
- 例如，多个 `web_research` 节点都返回 `web_research_result`，它们会被 **拼接** 起来

---

### 🔄 **完整执行流程**

```
用户输入
   ↓
START
   ↓
[generate_query] 节点执行
├─ 输入状态：{messages: [用户问题]}
├─ 输出：{search_query: ["query1", "query2", "query3"]}
├─ 状态更新：messages + search_query
   ↓
[continue_to_web_research] 条件路由
├─ 对每个 search_query，创建一个独立的 web_research 任务
├─ 创建 3 个并行的 Send("web_research", ...) 任务
   ↓
[web_research] 节点执行（3 个并行）
├─ 第 1 个：{search_query: "query1", id: 0} → {web_research_result: [...], sources_gathered: [...]}
├─ 第 2 个：{search_query: "query2", id: 1} → {web_research_result: [...], sources_gathered: [...]}
├─ 第 3 个：{search_query: "query3", id: 2} → {web_research_result: [...], sources_gathered: [...]}
│
├─ 状态合并：3 个结果都通过 operator.add 拼接到 web_research_result 和 sources_gathered
   ↓
[reflection] 节点执行
├─ 输入：{web_research_result: [所有研究结果], ...}
├─ 输出：{is_sufficient: bool, knowledge_gap: str, follow_up_queries: []}
├─ 状态更新：research_loop_count += 1
   ↓
[evaluate_research] 条件决策
├─ IF is_sufficient OR research_loop_count >= max_research_loops
│  └─ 返回 "finalize_answer"
├─ ELSE
│  └─ 返回 [Send("web_research", follow_up_queries), ...]  继续循环
   ↓
条件 1：发现知识缺口，继续研究
   └─ 回到 [web_research] （循环）
   
条件 2：信息充分，完成研究
   ↓
[finalize_answer] 节点执行
├─ 输入：所有研究结果 + 源
├─ 输出：{messages: [最终答案]}
   ↓
END
   ↓
返回最终答案给用户
```

---

### 💡 **节点的四种类型**

#### **1. 处理节点**（大多数节点）

```python
def web_research(state: WebSearchState, config: RunnableConfig) -> OverallState:
    # 接收一个状态，返回更新
    response = llm.invoke(prompt)
    return {
        "web_research_result": [response.content],
        "sources_gathered": [source],
    }
```

#### **2. 路由节点**（决策节点）

```python
def continue_to_web_research(state: QueryGenerationState):
    # 根据状态，生成多个任务
    return [
        Send("web_research", {"search_query": q, "id": i})
        for i, q in enumerate(state["search_query"])
    ]
```

#### **3. 条件决策节点**

```python
def evaluate_research(state: ReflectionState, config: RunnableConfig):
    # 根据状态，返回下一个节点名
    if state["is_sufficient"] or state["research_loop_count"] >= max_loops:
        return "finalize_answer"
    else:
        return "web_research"  # 或 ["web_research", ...] 并行
```

#### **4. 入口和出口**

```python
builder.add_edge(START, "generate_query")  # 入口
builder.add_edge("finalize_answer", END)   # 出口
```

---

### 📊 **状态的三种合并策略**

```python
class OverallState(TypedDict):
    # 策略 1：覆盖（默认）
    reasoning_model: str
    # 新值覆盖旧值
    
    # 策略 2：追加（add_messages）
    messages: Annotated[list, add_messages]
    # 智能合并消息（避免重复）
    
    # 策略 3：拼接（operator.add）
    search_query: Annotated[list, operator.add]
    # list1 + list2 + list3 = [所有元素]
```

---

### 🎬 **实际执行示例**

当你运行 `graph.invoke({...})`：

```python
state = {
    "messages": [HumanMessage(content="Who won Euro 2024")],
    "initial_search_query_count": 3,
    "max_research_loops": 2,
    "reasoning_model": "gpt-4o",
}

result = graph.invoke(state)
```

**状态变化过程**：

```
Step 1: generate_query
  输入：{messages: [HumanMessage]}
  输出：{search_query: ["Euro 2024 winner", "Spain Euro 2024", ...]}
  状态：messages + search_query

Step 2: continue_to_web_research (路由)
  创建 3 个 web_research 任务

Step 3: web_research (×3 并行)
  输入：{search_query: "Euro 2024 winner", id: 0}
  输出：{web_research_result: ["Spain won..."], sources_gathered: [...]}
  
  输入：{search_query: "Spain Euro 2024", id: 1}
  输出：{web_research_result: ["Spain beat England..."], sources_gathered: [...]}
  
  输入：{search_query: "Euro 2024 final", id: 2}
  输出：{web_research_result: ["Final was in Berlin..."], sources_gathered: [...]}
  
  状态合并：
    web_research_result: ["Spain won...", "Spain beat England...", "Final was in Berlin..."]
    sources_gathered: [source1, source2, source3]

Step 4: reflection
  输入：{web_research_result: [所有3个结果], messages: [...]}
  分析：信息充分
  输出：{is_sufficient: true, research_loop_count: 1, follow_up_queries: []}

Step 5: evaluate_research (条件)
  判断：is_sufficient == true
  决策：返回 "finalize_answer"

Step 6: finalize_answer
  输入：所有研究结果 + 源
  输出：{messages: [AIMessage("Spain won Euro 2024...")]}

最终返回给用户：
  "Spain won Euro 2024, defeating England in the final..."
```

---

### 🔍 **Graph 的可视化**

```
        START
          ↓
    [generate_query]
          ↓
[continue_to_web_research] ← 路由，生成 3 个并行任务
    ↙        ↓        ↘
[web_research] [web_research] [web_research]  ← 并行执行
    ↖        ↓        ↙
     [reflection]
          ↓
   [evaluate_research] ← 条件决策
       ↙          ↘
  "web_research"   "finalize_answer" ← 根据情况选择
  (继续循环)      (完成)
                   ↓
              [finalize_answer]
                   ↓
                  END
```

---

### 💪 **LangGraph 的强大之处**

1. **状态管理** - 所有数据在一个地方，节点间共享
2. **条件路由** - 根据 LLM 的决策动态改变流程
3. **并行处理** - 多个节点并行执行（web_research ×3）
4. **循环控制** - 简单实现循环（research loop）
5. **可追踪** - 每步执行都可被追踪和调试
6. **持久化** - 状态可以保存到数据库，支持中断和恢复

---

### 🎓 **一句话总结**

**节点 = 工作单元，边 = 连接逻辑，状态 = 共享数据，Graph = 这三者的编排**
