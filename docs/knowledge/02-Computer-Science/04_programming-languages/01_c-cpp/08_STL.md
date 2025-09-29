# C++ STL 完全指南

## 📚 目录

1. [STL简介](#STL简介)
2. [容器（Containers）](#容器Containers)
3. [迭代器（Iterators）](#迭代器Iterators)
4. [算法（Algorithms）](#算法Algorithms)
5. [函数对象（Functors）](#函数对象Functors)
6. [适配器（Adapters）](#适配器Adapters)
7. [实用工具](#实用工具)
8. [实际应用示例](#实际应用示例)
9. [性能对比](#性能对比)
10. [最佳实践](#最佳实践)

---

## STL简介

### 什么是STL？

**STL（Standard Template Library，标准模板库）** 是C++标准库的核心部分，提供了一套通用的、高效的、经过充分测试的数据结构和算法。

### STL的六大组件

```
┌─────────────────────────────────────────┐
│              C++ STL                    │
├─────────────────────────────────────────┤
│  1. 容器 (Containers)                   │
│     - 存储数据的数据结构                │
│                                         │
│  2. 迭代器 (Iterators)                  │
│     - 遍历容器的"指针"                  │
│                                         │
│  3. 算法 (Algorithms)                   │
│     - 对数据进行操作的函数              │
│                                         │
│  4. 函数对象 (Functors)                 │
│     - 可调用的对象                      │
│                                         │
│  5. 适配器 (Adapters)                   │
│     - 改变接口的包装器                  │
│                                         │
│  6. 分配器 (Allocators)                 │
│     - 管理内存分配                      │
└─────────────────────────────────────────┘
```

### 为什么使用STL？

```cpp
// ❌ 不使用STL - 自己实现动态数组
class MyArray {
    int* data;
    int size;
    int capacity;
public:
    MyArray() : data(nullptr), size(0), capacity(0) {}
    ~MyArray() { delete[] data; }
    void push_back(int value) {
        if (size == capacity) {
            // 需要自己处理扩容
            capacity = capacity == 0 ? 1 : capacity * 2;
            int* newData = new int[capacity];
            for (int i = 0; i < size; i++) {
                newData[i] = data[i];
            }
            delete[] data;
            data = newData;
        }
        data[size++] = value;
    }
    // ... 还需要实现很多方法
};

// ✅ 使用STL - 简单高效
#include <vector>
vector<int> numbers;
numbers.push_back(42);
```

**优势：**
1. ✅ **节省时间** - 不需要重复造轮子
2. ✅ **高效** - 经过优化的实现
3. ✅ **可靠** - 经过大量测试
4. ✅ **标准化** - 所有C++编译器都支持
5. ✅ **通用** - 适用于各种数据类型

---

## 容器（Containers）

### 容器分类

```
容器 (Containers)
│
├── 序列容器 (Sequence Containers)
│   ├── vector      - 动态数组
│   ├── deque       - 双端队列
│   ├── list        - 双向链表
│   ├── forward_list - 单向链表
│   └── array       - 固定大小数组
│
├── 关联容器 (Associative Containers)
│   ├── set         - 集合（唯一，有序）
│   ├── multiset    - 多重集合（可重复，有序）
│   ├── map         - 映射（键值对，唯一键）
│   └── multimap    - 多重映射（可重复键）
│
├── 无序关联容器 (Unordered Containers)
│   ├── unordered_set      - 哈希集合
│   ├── unordered_multiset - 哈希多重集合
│   ├── unordered_map      - 哈希映射
│   └── unordered_multimap - 哈希多重映射
│
└── 容器适配器 (Container Adapters)
    ├── stack       - 栈（LIFO）
    ├── queue       - 队列（FIFO）
    └── priority_queue - 优先队列
```

### 1. vector - 动态数组

```cpp
#include <vector>
#include <iostream>
using namespace std;

int main() {
    // 创建 vector
    vector<int> numbers;                    // 空
    vector<int> numbers2(10);               // 10个元素，默认值0
    vector<int> numbers3(10, 5);            // 10个元素，值都是5
    vector<int> numbers4 = {1, 2, 3, 4, 5}; // 初始化列表
    
    // 添加元素
    numbers.push_back(10);      // 末尾添加
    numbers.push_back(20);
    numbers.push_back(30);
    
    // 访问元素
    cout << numbers[0] << endl;      // 10 (不检查越界)
    cout << numbers.at(1) << endl;   // 20 (检查越界)
    cout << numbers.front() << endl; // 10 (第一个)
    cout << numbers.back() << endl;  // 30 (最后一个)
    
    // 大小和容量
    cout << "Size: " << numbers.size() << endl;       // 当前元素数量
    cout << "Capacity: " << numbers.capacity() << endl; // 容量
    cout << "Empty: " << numbers.empty() << endl;     // 是否为空
    
    // 修改元素
    numbers[0] = 100;
    
    // 删除元素
    numbers.pop_back();           // 删除最后一个
    numbers.erase(numbers.begin()); // 删除第一个
    numbers.clear();              // 清空所有元素
    
    // 插入元素
    numbers.insert(numbers.begin(), 99);  // 在开头插入
    
    // 遍历
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}
```

**特点：**
- ✅ 随机访问快（O(1)）
- ✅ 末尾添加/删除快（O(1)）
- ❌ 中间插入/删除慢（O(n)）
- ✅ 内存连续

### 2. list - 双向链表

```cpp
#include <list>
#include <iostream>
using namespace std;

int main() {
    list<int> numbers = {1, 2, 3, 4, 5};
    
    // 添加元素
    numbers.push_front(0);  // 开头添加
    numbers.push_back(6);   // 末尾添加
    
    // 删除元素
    numbers.pop_front();    // 删除开头
    numbers.pop_back();     // 删除末尾
    
    // 插入元素（需要迭代器）
    auto it = numbers.begin();
    advance(it, 2);         // 移动到第3个位置
    numbers.insert(it, 99); // 插入
    
    // 遍历
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    // 排序
    numbers.sort();
    
    // 反转
    numbers.reverse();
    
    // 去重（需要先排序）
    numbers.unique();
    
    return 0;
}
```

**特点：**
- ❌ 不支持随机访问
- ✅ 任意位置插入/删除快（O(1)）
- ❌ 内存不连续

### 3. deque - 双端队列

```cpp
#include <deque>
#include <iostream>
using namespace std;

int main() {
    deque<int> dq = {3, 4, 5};
    
    // 两端操作
    dq.push_front(2);  // 前端添加
    dq.push_back(6);   // 后端添加
    dq.pop_front();    // 删除前端
    dq.pop_back();     // 删除后端
    
    // 支持随机访问
    cout << dq[0] << endl;
    
    // 遍历
    for (int num : dq) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}
```

**特点：**
- ✅ 随机访问（O(1)）
- ✅ 两端添加/删除快（O(1)）
- ❌ 中间插入/删除慢（O(n)）

### 4. set - 集合（唯一，自动排序）

```cpp
#include <set>
#include <iostream>
using namespace std;

int main() {
    set<int> numbers = {3, 1, 4, 1, 5, 9, 2, 6};
    
    // 自动去重和排序
    // 输出: 1 2 3 4 5 6 9
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    // 插入元素
    numbers.insert(7);
    numbers.insert(1);  // 重复，不会插入
    
    // 查找元素
    if (numbers.find(5) != numbers.end()) {
        cout << "Found 5" << endl;
    }
    
    // 删除元素
    numbers.erase(3);   // 删除值为3的元素
    
    // 计数（只会是0或1）
    cout << numbers.count(5) << endl;  // 1
    
    // 大小
    cout << "Size: " << numbers.size() << endl;
    
    return 0;
}
```

**特点：**
- ✅ 元素唯一
- ✅ 自动排序
- ✅ 查找快（O(log n)）
- ✅ 基于红黑树实现

### 5. map - 映射（键值对）

```cpp
#include <map>
#include <iostream>
#include <string>
using namespace std;

int main() {
    // 创建 map
    map<string, int> ages;
    
    // 添加元素
    ages["Alice"] = 25;
    ages["Bob"] = 30;
    ages["Charlie"] = 35;
    ages.insert({"David", 28});
    ages.insert(make_pair("Eve", 22));
    
    // 访问元素
    cout << ages["Alice"] << endl;  // 25
    
    // 查找元素
    if (ages.find("Bob") != ages.end()) {
        cout << "Bob's age: " << ages["Bob"] << endl;
    }
    
    // 检查键是否存在
    if (ages.count("Frank") == 0) {
        cout << "Frank not found" << endl;
    }
    
    // 遍历
    for (const auto& pair : ages) {
        cout << pair.first << ": " << pair.second << endl;
    }
    
    // 删除元素
    ages.erase("Charlie");
    
    // 大小
    cout << "Size: " << ages.size() << endl;
    
    return 0;
}
```

**特点：**
- ✅ 键唯一
- ✅ 按键自动排序
- ✅ 查找快（O(log n)）

### 6. unordered_map - 哈希映射

```cpp
#include <unordered_map>
#include <iostream>
#include <string>
using namespace std;

int main() {
    unordered_map<string, int> scores;
    
    // 添加元素
    scores["Alice"] = 95;
    scores["Bob"] = 87;
    scores["Charlie"] = 92;
    
    // 访问（比 map 更快）
    cout << scores["Alice"] << endl;
    
    // 遍历（顺序不确定）
    for (const auto& pair : scores) {
        cout << pair.first << ": " << pair.second << endl;
    }
    
    return 0;
}
```

**特点：**
- ✅ 查找更快（平均O(1)）
- ❌ 不排序
- ✅ 基于哈希表

### 7. stack - 栈（LIFO）

```cpp
#include <stack>
#include <iostream>
using namespace std;

int main() {
    stack<int> s;
    
    // 入栈
    s.push(1);
    s.push(2);
    s.push(3);
    
    // 栈顶元素
    cout << s.top() << endl;  // 3
    
    // 出栈
    s.pop();  // 移除3
    cout << s.top() << endl;  // 2
    
    // 大小
    cout << "Size: " << s.size() << endl;
    
    // 是否为空
    if (!s.empty()) {
        cout << "Stack is not empty" << endl;
    }
    
    return 0;
}
```

### 8. queue - 队列（FIFO）

```cpp
#include <queue>
#include <iostream>
using namespace std;

int main() {
    queue<int> q;
    
    // 入队
    q.push(1);
    q.push(2);
    q.push(3);
    
    // 队首元素
    cout << q.front() << endl;  // 1
    
    // 队尾元素
    cout << q.back() << endl;   // 3
    
    // 出队
    q.pop();  // 移除1
    cout << q.front() << endl;  // 2
    
    return 0;
}
```

### 9. priority_queue - 优先队列

```cpp
#include <queue>
#include <iostream>
using namespace std;

int main() {
    // 默认：最大堆
    priority_queue<int> pq;
    
    pq.push(3);
    pq.push(1);
    pq.push(4);
    pq.push(2);
    
    // 总是返回最大值
    while (!pq.empty()) {
        cout << pq.top() << " ";  // 4 3 2 1
        pq.pop();
    }
    cout << endl;
    
    // 最小堆
    priority_queue<int, vector<int>, greater<int>> minHeap;
    
    minHeap.push(3);
    minHeap.push(1);
    minHeap.push(4);
    
    while (!minHeap.empty()) {
        cout << minHeap.top() << " ";  // 1 3 4
        minHeap.pop();
    }
    
    return 0;
}
```

---

## 迭代器（Iterators）

### 什么是迭代器？

迭代器是"智能指针"，用于遍历容器中的元素。

### 迭代器类型

```cpp
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> numbers = {1, 2, 3, 4, 5};
    
    // 1. begin() 和 end()
    auto it = numbers.begin();  // 指向第一个元素
    auto end = numbers.end();   // 指向最后一个元素的下一个位置
    
    // 2. 遍历
    for (auto it = numbers.begin(); it != numbers.end(); ++it) {
        cout << *it << " ";  // 解引用获取值
    }
    cout << endl;
    
    // 3. rbegin() 和 rend() - 反向迭代器
    for (auto it = numbers.rbegin(); it != numbers.rend(); ++it) {
        cout << *it << " ";  // 5 4 3 2 1
    }
    cout << endl;
    
    // 4. const 迭代器
    for (auto it = numbers.cbegin(); it != numbers.cend(); ++it) {
        // *it = 10;  // 错误！不能修改
        cout << *it << " ";
    }
    cout << endl;
    
    return 0;
}
```

### 迭代器操作

```cpp
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> numbers = {10, 20, 30, 40, 50};
    
    auto it = numbers.begin();
    
    // 访问
    cout << *it << endl;      // 10
    
    // 移动
    ++it;                     // 下一个
    cout << *it << endl;      // 20
    
    --it;                     // 上一个
    cout << *it << endl;      // 10
    
    it += 2;                  // 前进2个位置
    cout << *it << endl;      // 30
    
    // 距离
    auto distance = numbers.end() - numbers.begin();
    cout << "Distance: " << distance << endl;  // 5
    
    // 比较
    if (it != numbers.end()) {
        cout << "Not at end" << endl;
    }
    
    return 0;
}
```

---

## 算法（Algorithms）

STL提供了80多个算法，都在 `<algorithm>` 头文件中。

### 常用算法分类

```
算法 (Algorithms)
│
├── 非修改序列算法
│   ├── find, find_if        - 查找
│   ├── count, count_if      - 计数
│   ├── all_of, any_of       - 条件判断
│   └── for_each             - 遍历
│
├── 修改序列算法
│   ├── copy, copy_if        - 复制
│   ├── fill, fill_n         - 填充
│   ├── transform            - 变换
│   ├── replace              - 替换
│   └── remove, remove_if    - 删除
│
├── 排序算法
│   ├── sort                 - 排序
│   ├── stable_sort          - 稳定排序
│   ├── partial_sort         - 部分排序
│   └── nth_element          - 第n个元素
│
├── 二分查找
│   ├── binary_search        - 二分查找
│   ├── lower_bound          - 下界
│   └── upper_bound          - 上界
│
└── 其他算法
    ├── min, max             - 最值
    ├── min_element, max_element - 最值元素
    ├── accumulate           - 累加
    └── reverse              - 反转
```

### 1. 查找算法

```cpp
#include <algorithm>
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9};
    
    // find - 查找元素
    auto it = find(numbers.begin(), numbers.end(), 5);
    if (it != numbers.end()) {
        cout << "Found: " << *it << endl;
        cout << "Position: " << distance(numbers.begin(), it) << endl;
    }
    
    // find_if - 条件查找
    auto it2 = find_if(numbers.begin(), numbers.end(), [](int x) {
        return x > 5;
    });
    cout << "First element > 5: " << *it2 << endl;
    
    // count - 计数
    int count = count(numbers.begin(), numbers.end(), 3);
    cout << "Count of 3: " << count << endl;
    
    // count_if - 条件计数
    int evenCount = count_if(numbers.begin(), numbers.end(), [](int x) {
        return x % 2 == 0;
    });
    cout << "Even numbers: " << evenCount << endl;
    
    return 0;
}
```

### 2. 排序算法

```cpp
#include <algorithm>
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> numbers = {5, 2, 8, 1, 9, 3, 7, 4, 6};
    
    // sort - 升序排序
    sort(numbers.begin(), numbers.end());
    for (int num : numbers) cout << num << " ";
    cout << endl;
    
    // sort - 降序排序
    sort(numbers.begin(), numbers.end(), greater<int>());
    for (int num : numbers) cout << num << " ";
    cout << endl;
    
    // sort - 自定义比较
    sort(numbers.begin(), numbers.end(), [](int a, int b) {
        return abs(a - 5) < abs(b - 5);  // 按与5的距离排序
    });
    
    // reverse - 反转
    reverse(numbers.begin(), numbers.end());
    
    return 0;
}
```

### 3. 变换算法

```cpp
#include <algorithm>
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> numbers = {1, 2, 3, 4, 5};
    vector<int> squared(5);
    
    // transform - 变换每个元素
    transform(numbers.begin(), numbers.end(), squared.begin(), [](int x) {
        return x * x;
    });
    
    for (int num : squared) cout << num << " ";  // 1 4 9 16 25
    cout << endl;
    
    return 0;
}
```

### 4. 累加算法

```cpp
#include <numeric>
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> numbers = {1, 2, 3, 4, 5};
    
    // accumulate - 累加
    int sum = accumulate(numbers.begin(), numbers.end(), 0);
    cout << "Sum: " << sum << endl;  // 15
    
    // accumulate - 累乘
    int product = accumulate(numbers.begin(), numbers.end(), 1, 
                            [](int a, int b) { return a * b; });
    cout << "Product: " << product << endl;  // 120
    
    return 0;
}
```

### 5. 最值算法

```cpp
#include <algorithm>
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> numbers = {3, 1, 4, 1, 5, 9, 2, 6};
    
    // min_element - 最小元素
    auto minIt = min_element(numbers.begin(), numbers.end());
    cout << "Min: " << *minIt << endl;
    
    // max_element - 最大元素
    auto maxIt = max_element(numbers.begin(), numbers.end());
    cout << "Max: " << *maxIt << endl;
    
    // minmax_element - 同时找最小和最大
    auto [minIt2, maxIt2] = minmax_element(numbers.begin(), numbers.end());
    cout << "Min: " << *minIt2 << ", Max: " << *maxIt2 << endl;
    
    return 0;
}
```

---

## 函数对象（Functors）

### 什么是函数对象？

函数对象是重载了 `operator()` 的类，可以像函数一样调用。

```cpp
#include <iostream>
#include <algorithm>
#include <vector>
using namespace std;

// 函数对象
class Multiply {
private:
    int factor;
    
public:
    Multiply(int f) : factor(f) {}
    
    int operator()(int x) const {
        return x * factor;
    }
};

int main() {
    vector<int> numbers = {1, 2, 3, 4, 5};
    
    // 使用函数对象
    Multiply multiplyBy3(3);
    
    for (int num : numbers) {
        cout << multiplyBy3(num) << " ";  // 3 6 9 12 15
    }
    cout << endl;
    
    // 与算法结合
    vector<int> result(5);
    transform(numbers.begin(), numbers.end(), result.begin(), Multiply(2));
    
    for (int num : result) cout << num << " ";  // 2 4 6 8 10
    cout << endl;
    
    return 0;
}
```

### STL内置函数对象

```cpp
#include <functional>
#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int main() {
    vector<int> numbers = {5, 2, 8, 1, 9};
    
    // 算术函数对象
    plus<int> add;
    minus<int> subtract;
    multiplies<int> multiply;
    
    cout << add(3, 4) << endl;      // 7
    cout << subtract(10, 3) << endl; // 7
    cout << multiply(5, 6) << endl; // 30
    
    // 比较函数对象
    sort(numbers.begin(), numbers.end(), greater<int>());  // 降序
    
    // 逻辑函数对象
    logical_and<bool> andOp;
    logical_or<bool> orOp;
    
    cout << andOp(true, false) << endl;  // 0
    cout << orOp(true, false) << endl;   // 1
    
    return 0;
}
```

---

## 实际应用示例

### 示例1：学生成绩管理系统

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <map>
#include <string>
using namespace std;

struct Student {
    string name;
    int score;
    
    Student(string n, int s) : name(n), score(s) {}
};

int main() {
    vector<Student> students = {
        {"Alice", 85},
        {"Bob", 92},
        {"Charlie", 78},
        {"David", 95},
        {"Eve", 88}
    };
    
    // 1. 找出最高分
    auto topStudent = max_element(students.begin(), students.end(),
        [](const Student& a, const Student& b) {
            return a.score < b.score;
        });
    cout << "Top student: " << topStudent->name 
         << " (" << topStudent->score << ")" << endl;
    
    // 2. 按分数排序
    sort(students.begin(), students.end(),
        [](const Student& a, const Student& b) {
            return a.score > b.score;
        });
    
    cout << "\nRanking:" << endl;
    for (const auto& student : students) {
        cout << student.name << ": " << student.score << endl;
    }
    
    // 3. 计算平均分
    int total = accumulate(students.begin(), students.end(), 0,
        [](int sum, const Student& s) {
            return sum + s.score;
        });
    double average = static_cast<double>(total) / students.size();
    cout << "\nAverage score: " << average << endl;
    
    // 4. 统计及格人数（60分以上）
    int passCount = count_if(students.begin(), students.end(),
        [](const Student& s) {
            return s.score >= 60;
        });
    cout << "Pass rate: " << passCount << "/" << students.size() << endl;
    
    return 0;
}
```

### 示例2：单词频率统计

```cpp
#include <iostream>
#include <map>
#include <string>
#include <sstream>
#include <algorithm>
using namespace std;

int main() {
    string text = "the quick brown fox jumps over the lazy dog the fox";
    
    // 1. 分割单词并统计
    map<string, int> wordCount;
    istringstream iss(text);
    string word;
    
    while (iss >> word) {
        wordCount[word]++;
    }
    
    // 2. 显示结果
    cout << "Word frequencies:" << endl;
    for (const auto& pair : wordCount) {
        cout << pair.first << ": " << pair.second << endl;
    }
    
    // 3. 找出最常见的单词
    auto mostCommon = max_element(wordCount.begin(), wordCount.end(),
        [](const auto& a, const auto& b) {
            return a.second < b.second;
        });
    
    cout << "\nMost common word: " << mostCommon->first 
         << " (" << mostCommon->second << " times)" << endl;
    
    return 0;
}
```

### 示例3：图书管理系统

```cpp
#include <iostream>
#include <vector>
#include <set>
#include <map>
#include <string>
#include <algorithm>
using namespace std;

struct Book {
    int id;
    string title;
    string author;
    int year;
    
    bool operator<(const Book& other) const {
        return id < other.id;
    }
};

class Library {
private:
    set<Book> books;
    map<string, vector<int>> authorIndex;  // 作者 -> 书籍ID列表
    
public:
    void addBook(const Book& book) {
        books.insert(book);
        authorIndex[book.author].push_back(book.id);
    }
    
    void findByAuthor(const string& author) {
        if (authorIndex.count(author) == 0) {
            cout << "No books by " << author << endl;
            return;
        }
        
        cout << "Books by " << author << ":" << endl;
        for (int id : authorIndex[author]) {
            auto it = find_if(books.begin(), books.end(),
                [id](const Book& b) { return b.id == id; });
            if (it != books.end()) {
                cout << "  - " << it->title << " (" << it->year << ")" << endl;
            }
        }
    }
    
    void listAllBooks() {
        cout << "All books:" << endl;
        for (const auto& book : books) {
            cout << book.id << ". " << book.title 
                 << " by " << book.author 
                 << " (" << book.year << ")" << endl;
        }
    }
};

int main() {
    Library library;
    
    library.addBook({1, "1984", "George Orwell", 1949});
    library.addBook({2, "Animal Farm", "George Orwell", 1945});
    library.addBook({3, "To Kill a Mockingbird", "Harper Lee", 1960});
    library.addBook({4, "The Great Gatsby", "F. Scott Fitzgerald", 1925});
    
    library.listAllBooks();
    cout << endl;
    library.findByAuthor("George Orwell");
    
    return 0;
}
```

---

## 性能对比

### 容器性能特性

| 操作 | vector | deque | list | set/map | unordered_set/map |
|------|--------|-------|------|---------|-------------------|
| 随机访问 | O(1) | O(1) | O(n) | O(log n) | - |
| 头部插入 | O(n) | O(1) | O(1) | O(log n) | O(1) |
| 尾部插入 | O(1) | O(1) | O(1) | O(log n) | O(1) |
| 中间插入 | O(n) | O(n) | O(1) | O(log n) | - |
| 查找 | O(n) | O(n) | O(n) | O(log n) | O(1) |
| 内存连续 | ✅ | ❌ | ❌ | ❌ | ❌ |

### 选择指南

```cpp
// ✅ 需要随机访问 → vector
vector<int> data;
cout << data[100];  // 快速访问

// ✅ 频繁在两端操作 → deque
deque<int> queue;
queue.push_front(1);
queue.push_back(2);

// ✅ 频繁在中间插入/删除 → list
list<int> myList;
myList.insert(it, 42);  // O(1)

// ✅ 需要自动排序和唯一性 → set
set<int> uniqueSorted;

// ✅ 需要键值对，快速查找 → map 或 unordered_map
map<string, int> ages;          // 有序
unordered_map<string, int> ages2; // 更快
```

---

## 最佳实践

### 1. 使用范围for循环

```cpp
// ✅ 推荐：范围for循环
vector<int> numbers = {1, 2, 3, 4, 5};
for (const auto& num : numbers) {
    cout << num << " ";
}

// ❌ 不推荐：传统for循环（除非需要索引）
for (size_t i = 0; i < numbers.size(); i++) {
    cout << numbers[i] << " ";
}
```

### 2. 使用auto简化代码

```cpp
// ✅ 推荐
auto it = numbers.begin();
auto result = find(numbers.begin(), numbers.end(), 5);

// ❌ 冗长
vector<int>::iterator it = numbers.begin();
```

### 3. 预分配容量

```cpp
// ✅ 性能更好
vector<int> numbers;
numbers.reserve(1000);  // 预分配空间
for (int i = 0; i < 1000; i++) {
    numbers.push_back(i);
}

// ❌ 可能多次重新分配
vector<int> numbers2;
for (int i = 0; i < 1000; i++) {
    numbers2.push_back(i);
}
```

### 4. 使用emplace代替push

```cpp
struct Person {
    string name;
    int age;
    Person(string n, int a) : name(n), age(a) {}
};

vector<Person> people;

// ✅ 更高效：原地构造
people.emplace_back("Alice", 25);

// ❌ 效率较低：先构造再复制/移动
people.push_back(Person("Bob", 30));
```

### 5. 使用const引用避免拷贝

```cpp
vector<string> names = {"Alice", "Bob", "Charlie"};

// ✅ 不拷贝
for (const auto& name : names) {
    cout << name << endl;
}

// ❌ 每次拷贝string
for (auto name : names) {
    cout << name << endl;
}
```

### 6. 选择合适的容器

```cpp
// ✅ 需要快速查找 → unordered_set
unordered_set<int> seen;
if (seen.count(value) == 0) {
    seen.insert(value);
}

// ❌ 不需要排序却用了set
set<int> seen;  // 浪费了排序开销
```

---

## 总结

### STL核心概念

1. **容器** - 存储数据
2. **迭代器** - 遍历数据
3. **算法** - 处理数据
4. **函数对象** - 自定义操作

### 快速参考

```cpp
// 最常用的容器
#include <vector>      // 动态数组
#include <list>        // 链表
#include <deque>       // 双端队列
#include <set>         // 集合
#include <map>         // 映射
#include <unordered_map> // 哈希映射
#include <stack>       // 栈
#include <queue>       // 队列

// 最常用的算法
#include <algorithm>   // 排序、查找等
#include <numeric>     // 数值算法

// 常用操作
vector<int> v = {1, 2, 3};
sort(v.begin(), v.end());           // 排序
auto it = find(v.begin(), v.end(), 2); // 查找
int sum = accumulate(v.begin(), v.end(), 0); // 求和
```

### 学习建议

1. **先掌握常用容器** - vector, map, set
2. **理解迭代器** - 所有容器操作的基础
3. **学习常用算法** - sort, find, accumulate
4. **多练习** - 通过实际项目巩固
5. **关注性能** - 选择合适的容器和算法

STL是C++最强大的特性之一，熟练掌握STL能大大提高编程效率！