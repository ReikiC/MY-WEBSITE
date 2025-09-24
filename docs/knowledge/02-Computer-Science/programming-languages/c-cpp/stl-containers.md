---
sidebar_position: 4
---

# STL 标准模板库

STL（Standard Template Library）是C++标准库的核心组成部分，提供了高效的数据结构和算法实现。

## STL架构

### 🏗️ **STL六大组件**

#### **1. 容器（Containers）**
存储数据的模板类

#### **2. 迭代器（Iterators）** 
访问容器元素的通用接口

#### **3. 算法（Algorithms）**
操作容器的函数模板

#### **4. 函数对象（Function Objects）**
可调用的类对象

#### **5. 适配器（Adapters）**
修改接口的组件

#### **6. 分配器（Allocators）**
内存管理组件

```cpp
// STL组件协同工作示例
#include <vector>
#include <algorithm>
#include <functional>
#include <iostream>

void stl_demo() {
    std::vector<int> vec = {5, 2, 8, 1, 9};  // 容器
    
    // 使用迭代器和算法
    auto it = std::find(vec.begin(), vec.end(), 8);
    if (it != vec.end()) {
        std::cout << "Found 8 at position: " 
                  << std::distance(vec.begin(), it) << std::endl;
    }
    
    // 使用函数对象进行排序
    std::sort(vec.begin(), vec.end(), std::greater<int>());
    
    // 使用算法打印
    std::for_each(vec.begin(), vec.end(), 
                  [](int n) { std::cout << n << " "; });
}
```

## 容器详解

### 📦 **序列容器**

#### **vector - 动态数组**
```cpp
#include <vector>

void vector_demo() {
    // 构造方式
    std::vector<int> v1;                    // 空容器
    std::vector<int> v2(10);               // 10个默认值
    std::vector<int> v3(10, 42);           // 10个42
    std::vector<int> v4{1, 2, 3, 4, 5};    // 初始化列表
    std::vector<int> v5(v4.begin(), v4.end()); // 迭代器范围
    
    // 容量管理
    v1.reserve(100);        // 预分配容量
    v1.resize(50);          // 改变大小
    v1.shrink_to_fit();     // 释放多余容量
    
    // 元素访问
    int first = v4[0];              // 下标访问（不检查边界）
    int second = v4.at(1);          // 安全访问（检查边界）
    int& front_ref = v4.front();    // 第一个元素引用
    int& back_ref = v4.back();      // 最后一个元素引用
    int* data_ptr = v4.data();      // 底层数组指针
    
    // 修改操作
    v1.push_back(100);              // 尾部添加
    v1.pop_back();                  // 尾部删除
    v1.insert(v1.begin(), 200);     // 插入元素
    v1.erase(v1.begin());           // 删除元素
    v1.clear();                     // 清空容器
    
    // 性能特点
    // 随机访问: O(1)
    // 尾部插入/删除: 摊销O(1)
    // 中间插入/删除: O(n)
}
```

#### **deque - 双端队列**
```cpp
#include <deque>

void deque_demo() {
    std::deque<int> dq;
    
    // 双端操作
    dq.push_front(1);    // 头部插入
    dq.push_back(2);     // 尾部插入
    dq.pop_front();      // 头部删除
    dq.pop_back();       // 尾部删除
    
    // 随机访问（类似vector）
    dq[0] = 100;
    
    // 性能特点
    // 随机访问: O(1)
    // 两端插入/删除: O(1)
    // 中间插入/删除: O(n)
}
```

#### **list - 双向链表**
```cpp
#include <list>

void list_demo() {
    std::list<int> lst{3, 1, 4, 1, 5};
    
    // 链表特有操作
    lst.sort();                    // 排序
    lst.unique();                  // 去重
    lst.reverse();                 // 反转
    
    std::list<int> other{2, 6};
    lst.merge(other);              // 合并有序链表
    
    // 高效的插入删除
    auto it = std::find(lst.begin(), lst.end(), 4);
    lst.insert(it, 99);            // O(1)插入
    lst.erase(it);                 // O(1)删除
    
    // 性能特点
    // 随机访问: 不支持
    // 任意位置插入/删除: O(1)
    // 查找: O(n)
}
```

### 🗂️ **关联容器**

#### **set/multiset - 集合**
```cpp
#include <set>

void set_demo() {
    // set: 唯一键值，自动排序
    std::set<int> s{3, 1, 4, 1, 5, 9};  // {1, 3, 4, 5, 9}
    
    // 插入和查找
    auto [it, inserted] = s.insert(2);   // C++17结构化绑定
    if (inserted) {
        std::cout << "Inserted " << *it << std::endl;
    }
    
    // 查找操作
    if (s.find(4) != s.end()) {
        std::cout << "Found 4" << std::endl;
    }
    
    // 范围查找
    auto lower = s.lower_bound(3);       // >= 3的第一个元素
    auto upper = s.upper_bound(5);       // > 5的第一个元素
    auto range = s.equal_range(4);       // [4,4]的范围
    
    // multiset: 允许重复键值
    std::multiset<int> ms{1, 1, 2, 2, 3};
    std::cout << "Count of 1: " << ms.count(1) << std::endl;  // 输出2
    
    // 自定义比较器
    auto cmp = [](int a, int b) { return a > b; };  // 降序
    std::set<int, decltype(cmp)> desc_set(cmp);
    
    // 性能特点（基于红黑树）
    // 插入/删除/查找: O(log n)
    // 有序遍历: O(n)
}
```

#### **map/multimap - 键值对映射**
```cpp
#include <map>
#include <string>

void map_demo() {
    // map: 唯一键，自动按键排序
    std::map<std::string, int> word_count;
    
    // 插入方式
    word_count["hello"] = 1;                    // 下标运算符
    word_count.insert({"world", 1});            // insert
    word_count.emplace("c++", 2);               // 原地构造
    
    // 查找和访问
    if (auto it = word_count.find("hello"); it != word_count.end()) {
        std::cout << it->first << ": " << it->second << std::endl;
    }
    
    // 安全访问（不创建新元素）
    if (word_count.count("missing") > 0) {
        std::cout << "Found missing" << std::endl;
    }
    
    // 遍历
    for (const auto& [key, value] : word_count) {  // C++17
        std::cout << key << " appears " << value << " times\n";
    }
    
    // multimap示例
    std::multimap<int, std::string> grade_names;
    grade_names.emplace(90, "Alice");
    grade_names.emplace(85, "Bob");
    grade_names.emplace(90, "Charlie");  // 相同键值
    
    // 查找同一键值的所有元素
    auto range = grade_names.equal_range(90);
    for (auto it = range.first; it != range.second; ++it) {
        std::cout << it->second << " got " << it->first << std::endl;
    }
}
```

### 🔗 **无序关联容器（C++11）**

#### **unordered_set/unordered_map - 哈希表**
```cpp
#include <unordered_set>
#include <unordered_map>

// 自定义哈希函数
struct Person {
    std::string name;
    int age;
    
    bool operator==(const Person& other) const {
        return name == other.name && age == other.age;
    }
};

struct PersonHash {
    std::size_t operator()(const Person& p) const {
        return std::hash<std::string>{}(p.name) ^ 
               (std::hash<int>{}(p.age) << 1);
    }
};

void unordered_containers_demo() {
    // unordered_set
    std::unordered_set<int> us{1, 2, 3, 4, 5};
    
    // 平均O(1)操作
    us.insert(6);
    if (us.find(3) != us.end()) {
        std::cout << "Found 3" << std::endl;
    }
    
    // unordered_map
    std::unordered_map<std::string, int> cache;
    cache["key1"] = 100;
    cache["key2"] = 200;
    
    // 自定义类型作为键
    std::unordered_set<Person, PersonHash> person_set;
    person_set.insert({"Alice", 30});
    person_set.insert({"Bob", 25});
    
    // 哈希表统计信息
    std::cout << "Bucket count: " << cache.bucket_count() << std::endl;
    std::cout << "Load factor: " << cache.load_factor() << std::endl;
    std::cout << "Max load factor: " << cache.max_load_factor() << std::endl;
    
    // 性能特点
    // 平均情况插入/删除/查找: O(1)
    // 最坏情况: O(n)
}
```

### 🔄 **容器适配器**

#### **stack/queue/priority_queue**
```cpp
#include <stack>
#include <queue>

void adapter_demo() {
    // stack - 栈（LIFO）
    std::stack<int> stk;
    stk.push(1);
    stk.push(2);
    stk.push(3);
    
    while (!stk.empty()) {
        std::cout << stk.top() << " ";  // 3 2 1
        stk.pop();
    }
    
    // queue - 队列（FIFO）
    std::queue<int> que;
    que.push(1);
    que.push(2);
    que.push(3);
    
    while (!que.empty()) {
        std::cout << que.front() << " ";  // 1 2 3
        que.pop();
    }
    
    // priority_queue - 优先队列（默认大顶堆）
    std::priority_queue<int> pq;
    pq.push(3);
    pq.push(1);
    pq.push(4);
    pq.push(2);
    
    while (!pq.empty()) {
        std::cout << pq.top() << " ";  // 4 3 2 1
        pq.pop();
    }
    
    // 小顶堆
    std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;
    min_pq.push(3);
    min_pq.push(1);
    min_pq.push(4);
    
    while (!min_pq.empty()) {
        std::cout << min_pq.top() << " ";  // 1 3 4
        min_pq.pop();
    }
}
```

## 迭代器

### 🔍 **迭代器分类**

#### **迭代器类型层次**
```cpp
#include <iterator>
#include <vector>
#include <list>
#include <forward_list>

void iterator_demo() {
    // 输入迭代器（Input Iterator）
    // 只读，单向移动
    std::istream_iterator<int> input_it(std::cin);
    
    // 输出迭代器（Output Iterator）
    // 只写，单向移动
    std::ostream_iterator<int> output_it(std::cout, " ");
    
    // 前向迭代器（Forward Iterator）
    std::forward_list<int> flist{1, 2, 3};
    for (auto it = flist.begin(); it != flist.end(); ++it) {
        std::cout << *it << " ";
    }
    
    // 双向迭代器（Bidirectional Iterator）
    std::list<int> lst{1, 2, 3, 4};
    for (auto it = lst.rbegin(); it != lst.rend(); ++it) {
        std::cout << *it << " ";  // 反向遍历: 4 3 2 1
    }
    
    // 随机访问迭代器（Random Access Iterator）
    std::vector<int> vec{1, 2, 3, 4, 5};
    auto it = vec.begin();
    it += 3;              // 随机跳转
    std::cout << *it << std::endl;  // 输出4
    
    auto distance = vec.end() - vec.begin();  // 距离计算
    std::cout << "Vector size: " << distance << std::endl;
}
```

#### **迭代器适配器**
```cpp
void iterator_adapter_demo() {
    std::vector<int> vec{1, 2, 3, 4, 5};
    
    // 反向迭代器
    std::reverse_iterator<std::vector<int>::iterator> rit(vec.end());
    for (; rit != std::reverse_iterator<std::vector<int>::iterator>(vec.begin()); ++rit) {
        std::cout << *rit << " ";  // 5 4 3 2 1
    }
    
    // 插入迭代器
    std::vector<int> dest;
    
    // back_inserter：尾部插入
    std::copy(vec.begin(), vec.end(), std::back_inserter(dest));
    
    // front_inserter：头部插入（需要支持push_front的容器）
    std::deque<int> deq;
    std::copy(vec.begin(), vec.end(), std::front_inserter(deq));
    
    // inserter：指定位置插入
    std::vector<int> target{10, 20};
    std::copy(vec.begin(), vec.end(), 
              std::inserter(target, target.begin() + 1));
    
    // 流迭代器
    std::vector<int> numbers{1, 2, 3, 4, 5};
    std::copy(numbers.begin(), numbers.end(),
              std::ostream_iterator<int>(std::cout, " "));
}
```

## 算法

### 🔄 **非修改性算法**

#### **查找算法**
```cpp
#include <algorithm>

void search_algorithms() {
    std::vector<int> vec{1, 3, 5, 7, 9, 11, 13};
    
    // find系列
    auto it1 = std::find(vec.begin(), vec.end(), 7);
    auto it2 = std::find_if(vec.begin(), vec.end(), 
                           [](int n) { return n > 10; });
    auto it3 = std::find_if_not(vec.begin(), vec.end(),
                               [](int n) { return n < 10; });
    
    // 二分查找（要求有序）
    bool found = std::binary_search(vec.begin(), vec.end(), 7);
    auto lower = std::lower_bound(vec.begin(), vec.end(), 7);
    auto upper = std::upper_bound(vec.begin(), vec.end(), 7);
    
    // 计数
    std::vector<int> nums{1, 2, 2, 3, 2, 4, 2};
    int count = std::count(nums.begin(), nums.end(), 2);  // 4
    int count_if = std::count_if(nums.begin(), nums.end(),
                                [](int n) { return n > 2; });  // 2
    
    // 序列搜索
    std::vector<int> haystack{1, 2, 3, 4, 5, 6, 7};
    std::vector<int> needle{3, 4, 5};
    auto search_it = std::search(haystack.begin(), haystack.end(),
                                needle.begin(), needle.end());
    
    // 相邻查找
    std::vector<int> adjacent_test{1, 2, 2, 3, 4, 4, 5};
    auto adj_it = std::adjacent_find(adjacent_test.begin(), 
                                    adjacent_test.end());
}
```

### ✏️ **修改性算法**

#### **复制和移动**
```cpp
void copy_move_algorithms() {
    std::vector<int> source{1, 2, 3, 4, 5};
    std::vector<int> dest(5);
    
    // 复制
    std::copy(source.begin(), source.end(), dest.begin());
    
    // 条件复制
    std::vector<int> evens;
    std::copy_if(source.begin(), source.end(), 
                std::back_inserter(evens),
                [](int n) { return n % 2 == 0; });
    
    // 复制n个元素
    std::copy_n(source.begin(), 3, dest.begin());
    
    // 反向复制
    std::reverse_copy(source.begin(), source.end(),
                     std::back_inserter(dest));
    
    // 移动（C++11）
    std::vector<std::string> strings{"hello", "world"};
    std::vector<std::string> moved;
    std::move(strings.begin(), strings.end(),
              std::back_inserter(moved));
}
```

#### **转换算法**
```cpp
void transform_algorithms() {
    std::vector<int> numbers{1, 2, 3, 4, 5};
    std::vector<int> squares;
    
    // 单一输入转换
    std::transform(numbers.begin(), numbers.end(),
                  std::back_inserter(squares),
                  [](int n) { return n * n; });
    
    // 双输入转换
    std::vector<int> other{10, 20, 30, 40, 50};
    std::vector<int> sums;
    std::transform(numbers.begin(), numbers.end(),
                  other.begin(),
                  std::back_inserter(sums),
                  [](int a, int b) { return a + b; });
    
    // 原地转换
    std::transform(numbers.begin(), numbers.end(), numbers.begin(),
                  [](int n) { return n * 2; });
}
```

### 🔀 **排序和相关算法**

#### **排序算法**
```cpp
void sorting_algorithms() {
    std::vector<int> vec{5, 2, 8, 1, 9, 3};
    
    // 完全排序
    std::sort(vec.begin(), vec.end());  // 升序
    std::sort(vec.begin(), vec.end(), std::greater<int>());  // 降序
    
    // 稳定排序
    std::stable_sort(vec.begin(), vec.end());
    
    // 部分排序
    std::vector<int> data{9, 8, 7, 6, 5, 4, 3, 2, 1};
    std::partial_sort(data.begin(), data.begin() + 3, data.end());
    // 前3个元素已排序：{1, 2, 3, ...}
    
    // nth_element：找到第n小的元素
    std::vector<int> nums{5, 1, 9, 3, 7, 2, 8};
    std::nth_element(nums.begin(), nums.begin() + 3, nums.end());
    // nums[3]现在是第4小的元素，左边都比它小，右边都比它大
    
    // 自定义比较器
    struct Person { std::string name; int age; };
    std::vector<Person> people{{"Alice", 30}, {"Bob", 25}, {"Charlie", 35}};
    
    std::sort(people.begin(), people.end(),
             [](const Person& a, const Person& b) {
                 return a.age < b.age;
             });
}
```

## 函数对象与Lambda

### 🎯 **函数对象（仿函数）**

#### **标准函数对象**
```cpp
#include <functional>

void function_objects_demo() {
    std::vector<int> vec{1, 2, 3, 4, 5};
    
    // 算术函数对象
    std::transform(vec.begin(), vec.end(), vec.begin(),
                  std::negate<int>());  // 取负
    
    // 比较函数对象
    std::sort(vec.begin(), vec.end(), std::greater<int>());
    
    // 逻辑函数对象
    std::vector<bool> bools{true, false, true, false};
    std::transform(bools.begin(), bools.end(), bools.begin(),
                  std::logical_not<bool>());
    
    // 函数适配器
    auto is_even = [](int n) { return n % 2 == 0; };
    auto is_odd = std::not_fn(is_even);  // C++17
    
    // bind适配器
    auto multiply_by_2 = std::bind(std::multiplies<int>(), 
                                  std::placeholders::_1, 2);
    std::transform(vec.begin(), vec.end(), vec.begin(), multiply_by_2);
}
```

#### **自定义函数对象**
```cpp
class Accumulator {
private:
    int sum = 0;
    
public:
    int operator()(int value) {
        sum += value;
        return sum;
    }
    
    int getSum() const { return sum; }
};

// 带状态的函数对象
class Counter {
private:
    mutable int count = 0;
    
public:
    bool operator()(int) const {
        return ++count > 3;  // 前3个返回false，之后返回true
    }
    
    int getCount() const { return count; }
};

void custom_function_objects() {
    std::vector<int> numbers{1, 2, 3, 4, 5};
    
    // 累加器使用
    Accumulator acc;
    std::for_each(numbers.begin(), numbers.end(), std::ref(acc));
    std::cout << "Sum: " << acc.getSum() << std::endl;
    
    // 计数器使用
    Counter counter;
    auto it = std::find_if(numbers.begin(), numbers.end(), 
                          std::ref(counter));
    std::cout << "Counter called " << counter.getCount() << " times" << std::endl;
}
```

### 🚀 **Lambda表达式（C++11及后续）**

#### **Lambda语法和特性**
```cpp
void lambda_expressions() {
    std::vector<int> vec{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // 基本lambda
    auto is_even = [](int n) { return n % 2 == 0; };
    
    // 捕获外部变量
    int threshold = 5;
    
    // 值捕获
    auto greater_than_threshold = [threshold](int n) { 
        return n > threshold; 
    };
    
    // 引用捕获
    int count = 0;
    std::for_each(vec.begin(), vec.end(), 
                 [&count](int n) { if (n > 5) ++count; });
    
    // 混合捕获（C++14）
    auto lambda = [threshold, &count](int n) mutable {
        if (n > threshold) ++count;
        return n * 2;
    };
    
    // 泛型lambda（C++14）
    auto generic_printer = [](const auto& item) {
        std::cout << item << " ";
    };
    
    // 初始化捕获（C++14）
    auto unique_ptr_lambda = [ptr = std::make_unique<int>(42)](int n) {
        return *ptr + n;
    };
    
    // constexpr lambda（C++17）
    constexpr auto factorial = [](int n) constexpr {
        return n <= 1 ? 1 : n * factorial(n - 1);
    };
    
    // 结构化绑定与lambda（C++17）
    std::vector<std::pair<int, std::string>> pairs{
        {1, "one"}, {2, "two"}, {3, "three"}
    };
    
    std::for_each(pairs.begin(), pairs.end(),
                 [](const auto& [num, str]) {
                     std::cout << num << ": " << str << std::endl;
                 });
}
```

## STL使用最佳实践

### 📋 **容器选择指南**

```cpp
// 容器选择决策树
void container_selection_guide() {
    // 需要随机访问？
    // Yes -> vector (通常首选) 或 deque (需要两端操作)
    // No -> 需要排序？
    //       Yes -> set/map (唯一键) 或 multiset/multimap (重复键)
    //       No -> 需要快速查找？
    //             Yes -> unordered_set/unordered_map
    //             No -> list (频繁中间插入删除)
    
    // 示例场景
    
    // 1. 动态数组，需要随机访问
    std::vector<int> scores;  // ✅ 首选
    
    // 2. 双端队列
    std::deque<Task> task_queue;  // ✅ 支持两端高效操作
    
    // 3. 唯一元素集合，需要排序
    std::set<std::string> unique_words;  // ✅ 自动排序去重
    
    // 4. 键值映射，快速查找
    std::unordered_map<int, User> user_cache;  // ✅ O(1)平均查找
    
    // 5. 频繁中间插入删除
    std::list<LogEntry> log_entries;  // ✅ O(1)插入删除
}
```

### 🚀 **性能优化技巧**

```cpp
void performance_tips() {
    // 1. 预分配容量
    std::vector<int> vec;
    vec.reserve(1000);  // 避免频繁重新分配
    
    // 2. 使用emplace而非insert
    std::vector<std::string> strings;
    strings.emplace_back("hello");  // 原地构造，避免拷贝
    strings.push_back(std::string("world"));  // 创建临时对象后拷贝
    
    // 3. 移动语义
    std::vector<std::unique_ptr<int>> ptrs;
    ptrs.push_back(std::make_unique<int>(42));  // 自动移动
    
    // 4. 算法选择
    std::vector<int> data{5, 2, 8, 1, 9};
    
    // 只需要前k个最小元素
    std::partial_sort(data.begin(), data.begin() + 3, data.end());
    
    // 只需要第k小元素
    std::nth_element(data.begin(), data.begin() + 2, data.end());
    
    // 5. 迭代器vs下标
    std::list<int> lst{1, 2, 3, 4, 5};
    // ✅ 使用迭代器
    for (auto it = lst.begin(); it != lst.end(); ++it) {
        // 处理*it
    }
    // ❌ 不要对list使用下标访问
    
    // 6. 范围for循环
    for (const auto& item : vec) {  // ✅ 简洁高效
        // 处理item
    }
}
```

---
*STL：C++程序员的强大武器库*