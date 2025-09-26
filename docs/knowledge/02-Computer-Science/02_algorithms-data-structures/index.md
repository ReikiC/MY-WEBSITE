---
sidebar_position: 1
---

# 算法与数据结构 (Algorithms & Data Structures)

算法与数据结构是计算机科学的核心基础，决定了程序的效率和性能。

## 核心领域

### 🔍 **排序搜索算法** (Sorting & Searching)
- **排序算法** - 快速排序、归并排序、堆排序等
- **搜索算法** - 二分搜索、哈希查找、模式匹配
- **时间复杂度** - 各算法的性能分析和比较

### 📈 **图算法** (Graph Algorithms)
- **图遍历** - DFS、BFS深度和广度优先搜索
- **最短路径** - Dijkstra、Floyd-Warshall算法
- **最小生成树** - Prim、Kruskal算法
- **网络流** - 最大流、最小割问题

### 🎯 **动态规划** (Dynamic Programming)
- **基础概念** - 最优子结构、重叠子问题
- **经典问题** - 背包问题、最长公共子序列
- **优化技巧** - 状态压缩、滚动数组
- **应用领域** - 字符串匹配、数值计算

### 🌳 **树结构** (Tree Structures)  
- **二叉树** - 遍历、平衡、红黑树
- **多路树** - B树、B+树、字典树
- **堆结构** - 大顶堆、小顶堆、优先队列
- **高级树** - 线段树、树状数组

### ⚡ **复杂性理论** (Complexity Theory)
- **时间复杂度** - 大O符号、最坏/平均情况分析
- **空间复杂度** - 内存使用效率分析
- **算法分类** - P问题、NP问题、NP完全问题
- **近似算法** - 贪心算法、启发式方法

## 数据结构分类

### 🏗️ **线性结构**
```python
# 数组 - 随机访问O(1)
arr = [1, 2, 3, 4, 5]

# 链表 - 动态插入删除O(1)
class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

# 栈 - 后进先出LIFO
stack = []
stack.append(item)  # 入栈
item = stack.pop()  # 出栈

# 队列 - 先进先出FIFO
from collections import deque
queue = deque()
queue.append(item)    # 入队
item = queue.popleft()  # 出队
```

### 🌐 **非线性结构**
```python
# 二叉树
class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

# 图 - 邻接表表示
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
}

# 哈希表 - 平均O(1)查找
hash_table = {}
hash_table[key] = value
```

## 算法设计策略

### 🎯 **分治法** (Divide & Conquer)
- **思想** - 分解问题、递归求解、合并结果
- **典型算法** - 快速排序、归并排序、二分搜索
- **时间复杂度** - 通常为O(n log n)

### 🔄 **贪心算法** (Greedy Algorithm)
- **思想** - 每步选择局部最优解
- **应用** - 活动选择、哈夫曼编码、最小生成树
- **特点** - 不一定得到全局最优解

### 🎲 **回溯法** (Backtracking)
- **思想** - 试探性搜索，失败时回退
- **应用** - N皇后问题、数独求解、图着色
- **优化** - 剪枝技术提高效率

## 性能分析

### ⏱️ **时间复杂度排序**
```
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)
```

### 🔍 **常见算法复杂度**
| 算法 | 最好情况 | 平均情况 | 最坏情况 | 空间复杂度 |
|------|----------|----------|----------|------------|
| 快速排序 | O(n log n) | O(n log n) | O(n²) | O(log n) |
| 归并排序 | O(n log n) | O(n log n) | O(n log n) | O(n) |
| 堆排序 | O(n log n) | O(n log n) | O(n log n) | O(1) |
| 二分搜索 | O(1) | O(log n) | O(log n) | O(1) |

## 学习建议

1. **理论结合实践** - 理解原理后动手编程实现
2. **循序渐进** - 从简单数据结构开始，逐步掌握复杂算法
3. **多做题目** - LeetCode、ACM等在线练习平台
4. **性能分析** - 培养复杂度分析的直觉
5. **应用导向** - 学习如何在实际项目中选择合适的算法

---
*好的算法和数据结构是高效程序的基石*