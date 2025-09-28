# C++ Template 完全指南

## 📚 目录

1. [模板基础概念](#模板基础概念)
2. [函数模板](#函数模板)
3. [类模板](#类模板)
4. [模板参数](#模板参数)
5. [模板特化](#模板特化)
6. [模板实例化](#模板实例化)
7. [高级模板技术](#高级模板技术)
8. [现代C++模板特性](#现代C++模板特性)
9. [模板元编程](#模板元编程)
10. [实际应用示例](#实际应用示例)
11. [最佳实践](#最佳实践)
12. [常见错误](#常见错误)

---

## 模板基础概念

### 什么是模板？

模板（Template）是C++中的一种泛型编程机制，允许我们编写类型无关的代码。模板在编译时根据实际使用的类型生成具体的代码，这个过程称为**模板实例化**。

### 为什么使用模板？

```cpp
// 没有模板时，我们需要为每种类型写重复的代码
int max_int(int a, int b) {
    return a > b ? a : b;
}

double max_double(double a, double b) {
    return a > b ? a : b;
}

string max_string(string a, string b) {
    return a > b ? a : b;
}

// 使用模板，一份代码适用于所有类型
template<typename T>
T max_template(T a, T b) {
    return a > b ? a : b;
}
```

### 模板的优势

1. **代码复用** - 一份代码适用于多种类型
2. **类型安全** - 编译时类型检查
3. **性能优化** - 编译时展开，运行时无额外开销
4. **灵活性** - 支持泛型编程

---

## 函数模板

### 基本语法

```cpp
template<typename T>
返回类型 函数名(参数列表) {
    // 函数体
}

// 或者使用 class 关键字（效果相同）
template<class T>
返回类型 函数名(参数列表) {
    // 函数体
}
```

### 简单示例

```cpp
#include <iostream>
#include <string>
using namespace std;

// 基本函数模板
template<typename T>
T add(T a, T b) {
    return a + b;
}

// 多参数模板
template<typename T, typename U>
auto multiply(T a, U b) -> decltype(a * b) {
    return a * b;
}

// 使用示例
int main() {
    cout << add(5, 3) << endl;           // int 版本
    cout << add(5.5, 3.2) << endl;      // double 版本
    cout << add(string("Hello"), string(" World")) << endl;  // string 版本
    
    cout << multiply(3, 4.5) << endl;   // int * double
    return 0;
}
```

### 函数模板特化

```cpp
// 通用模板
template<typename T>
bool isEqual(T a, T b) {
    return a == b;
}

// 针对 const char* 的特化
template<>
bool isEqual<const char*>(const char* a, const char* b) {
    return strcmp(a, b) == 0;
}

// 使用示例
int main() {
    cout << isEqual(5, 5) << endl;              // true
    cout << isEqual("hello", "hello") << endl;  // true (使用特化版本)
    return 0;
}
```

### 函数模板重载

```cpp
// 基本模板
template<typename T>
void print(T value) {
    cout << "Template: " << value << endl;
}

// 重载模板
template<typename T>
void print(T* ptr) {
    cout << "Pointer template: " << *ptr << endl;
}

// 非模板函数重载
void print(int value) {
    cout << "Non-template int: " << value << endl;
}
```

---

## 类模板

### 基本语法

```cpp
template<typename T>
class ClassName {
private:
    T member;
public:
    ClassName(T value) : member(value) {}
    T getValue() const { return member; }
};
```

### 完整的类模板示例

```cpp
#include <iostream>
#include <vector>
#include <stdexcept>

template<typename T>
class Stack {
private:
    std::vector<T> elements;

public:
    // 入栈
    void push(const T& element) {
        elements.push_back(element);
    }
    
    // 出栈
    void pop() {
        if (elements.empty()) {
            throw std::runtime_error("Stack is empty");
        }
        elements.pop_back();
    }
    
    // 获取栈顶元素
    T& top() {
        if (elements.empty()) {
            throw std::runtime_error("Stack is empty");
        }
        return elements.back();
    }
    
    const T& top() const {
        if (elements.empty()) {
            throw std::runtime_error("Stack is empty");
        }
        return elements.back();
    }
    
    // 检查是否为空
    bool empty() const {
        return elements.empty();
    }
    
    // 获取大小
    size_t size() const {
        return elements.size();
    }
};

// 使用示例
int main() {
    Stack<int> intStack;
    intStack.push(10);
    intStack.push(20);
    cout << intStack.top() << endl;  // 20
    
    Stack<string> stringStack;
    stringStack.push("Hello");
    stringStack.push("World");
    cout << stringStack.top() << endl;  // World
    
    return 0;
}
```

### 类模板的成员函数定义

```cpp
template<typename T>
class MyClass {
private:
    T data;
    
public:
    MyClass(T value);
    void setValue(T value);
    T getValue() const;
    
    // 模板成员函数
    template<typename U>
    void convert(U value);
};

// 在类外定义成员函数
template<typename T>
MyClass<T>::MyClass(T value) : data(value) {}

template<typename T>
void MyClass<T>::setValue(T value) {
    data = value;
}

template<typename T>
T MyClass<T>::getValue() const {
    return data;
}

// 模板成员函数定义
template<typename T>
template<typename U>
void MyClass<T>::convert(U value) {
    data = static_cast<T>(value);
}
```

---

## 模板参数

### 类型参数

```cpp
// 单个类型参数
template<typename T>
class Container { /* ... */ };

// 多个类型参数
template<typename T, typename U, typename V>
class Triple {
    T first;
    U second;
    V third;
};
```

### 非类型参数

```cpp
// 整数非类型参数
template<typename T, int Size>
class Array {
private:
    T data[Size];
    
public:
    constexpr int size() const { return Size; }
    T& operator[](int index) { return data[index]; }
    const T& operator[](int index) const { return data[index]; }
};

// 使用示例
Array<int, 10> arr;  // 创建大小为10的int数组
```

### 模板模板参数

```cpp
// 模板模板参数
template<typename T, template<typename> class Container>
class Adapter {
private:
    Container<T> container;
    
public:
    void add(const T& item) {
        container.push_back(item);
    }
};

// 使用示例
Adapter<int, std::vector> adapter;
```

### 默认模板参数

```cpp
// 默认类型参数
template<typename T = int, int Size = 10>
class DefaultArray {
private:
    T data[Size];
public:
    // ...
};

// 使用示例
DefaultArray<> arr1;           // T=int, Size=10
DefaultArray<double> arr2;     // T=double, Size=10
DefaultArray<char, 20> arr3;   // T=char, Size=20
```

---

## 模板特化

### 全特化（Full Specialization）

```cpp
// 主模板
template<typename T>
class Printer {
public:
    void print(const T& value) {
        std::cout << "General: " << value << std::endl;
    }
};

// 针对 bool 的全特化
template<>
class Printer<bool> {
public:
    void print(const bool& value) {
        std::cout << "Bool: " << (value ? "true" : "false") << std::endl;
    }
};

// 针对 char* 的全特化
template<>
class Printer<char*> {
public:
    void print(char* const& value) {
        std::cout << "C-String: " << value << std::endl;
    }
};
```

### 偏特化（Partial Specialization）

```cpp
// 主模板
template<typename T, typename U>
class Pair {
public:
    void info() {
        std::cout << "General pair" << std::endl;
    }
};

// 第二个参数为 int 的偏特化
template<typename T>
class Pair<T, int> {
public:
    void info() {
        std::cout << "Second parameter is int" << std::endl;
    }
};

// 两个参数相同的偏特化
template<typename T>
class Pair<T, T> {
public:
    void info() {
        std::cout << "Both parameters are the same" << std::endl;
    }
};

// 指针类型的偏特化
template<typename T, typename U>
class Pair<T*, U*> {
public:
    void info() {
        std::cout << "Both parameters are pointers" << std::endl;
    }
};
```

---

## 模板实例化

### 隐式实例化

```cpp
template<typename T>
T add(T a, T b) {
    return a + b;
}

int main() {
    // 隐式实例化 add<int>
    int result1 = add(5, 3);
    
    // 隐式实例化 add<double>
    double result2 = add(5.5, 3.2);
    
    return 0;
}
```

### 显式实例化

```cpp
// 声明
template<typename T>
T multiply(T a, T b) {
    return a * b;
}

// 显式实例化声明
extern template int multiply<int>(int, int);

// 显式实例化定义（通常在 .cpp 文件中）
template int multiply<int>(int, int);
template double multiply<double>(double, double);
```

### 显式特化实例化

```cpp
template<typename T>
void func() {
    std::cout << "General template\n";
}

// 显式调用时指定类型
int main() {
    func<int>();     // 显式指定 T = int
    func<double>();  // 显式指定 T = double
    return 0;
}
```

---

## 高级模板技术

### SFINAE (Substitution Failure Is Not An Error)

```cpp
#include <type_traits>

// 只有当 T 是整数类型时才启用
template<typename T>
typename std::enable_if<std::is_integral<T>::value, T>::type
processInteger(T value) {
    return value * 2;
}

// 只有当 T 是浮点类型时才启用
template<typename T>
typename std::enable_if<std::is_floating_point<T>::value, T>::type
processFloat(T value) {
    return value / 2.0;
}

// C++17 的 if constexpr
template<typename T>
auto process(T value) {
    if constexpr (std::is_integral_v<T>) {
        return value * 2;
    } else if constexpr (std::is_floating_point_v<T>) {
        return value / 2.0;
    } else {
        return value;
    }
}
```

### 变参模板（Variadic Templates）

```cpp
// 递归展开变参模板
template<typename T>
void print(T&& t) {
    std::cout << t << std::endl;
}

template<typename T, typename... Args>
void print(T&& t, Args&&... args) {
    std::cout << t << " ";
    print(args...);
}

// C++17 折叠表达式
template<typename... Args>
void printFold(Args&&... args) {
    ((std::cout << args << " "), ...);
    std::cout << std::endl;
}

// 使用示例
int main() {
    print(1, 2.5, "hello", 'c');
    printFold(1, 2.5, "hello", 'c');
    return 0;
}
```

### 完美转发

```cpp
#include <utility>

template<typename Func, typename... Args>
auto wrapper(Func&& func, Args&&... args) 
    -> decltype(func(std::forward<Args>(args)...)) {
    
    std::cout << "Calling function with " << sizeof...(args) << " arguments\n";
    return func(std::forward<Args>(args)...);
}

// 使用示例
void testFunc(int& x) {
    x *= 2;
}

int main() {
    int value = 5;
    wrapper(testFunc, value);
    std::cout << value << std::endl;  // 10
    return 0;
}
```

---

## 现代C++模板特性

### C++14: 变量模板

```cpp
template<typename T>
constexpr T pi = T(3.1415926535897932385);

template<typename T>
constexpr T e = T(2.7182818284590452354);

// 使用示例
int main() {
    auto pi_f = pi<float>;
    auto pi_d = pi<double>;
    auto e_f = e<float>;
    
    std::cout << "Pi (float): " << pi_f << std::endl;
    std::cout << "Pi (double): " << pi_d << std::endl;
    std::cout << "E (float): " << e_f << std::endl;
    
    return 0;
}
```

### C++17: 类模板参数推导

```cpp
template<typename T>
class Container {
    T data;
public:
    Container(T value) : data(value) {}
    T get() const { return data; }
};

int main() {
    // C++17 之前需要显式指定类型
    Container<int> c1(42);
    
    // C++17 可以自动推导
    Container c2(42);        // 推导为 Container<int>
    Container c3(3.14);      // 推导为 Container<double>
    
    return 0;
}
```

### C++20: 概念（Concepts）

```cpp
#include <concepts>

// 定义概念
template<typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;

template<typename T>
concept Addable = requires(T a, T b) {
    a + b;
};

// 使用概念约束模板
template<Numeric T>
T add(T a, T b) {
    return a + b;
}

template<typename T>
requires Addable<T>
T combine(T a, T b) {
    return a + b;
}

// 简化的语法
auto multiply(Numeric auto a, Numeric auto b) {
    return a * b;
}
```

---

## 模板元编程

### 编译时计算

```cpp
// 编译时阶乘计算
template<int N>
struct Factorial {
    static constexpr int value = N * Factorial<N-1>::value;
};

template<>
struct Factorial<0> {
    static constexpr int value = 1;
};

// C++14 constexpr 函数
constexpr int factorial(int n) {
    return (n <= 1) ? 1 : n * factorial(n - 1);
}

// 使用示例
int main() {
    constexpr int fact5_meta = Factorial<5>::value;  // 120
    constexpr int fact5_func = factorial(5);         // 120
    
    static_assert(fact5_meta == 120);
    static_assert(fact5_func == 120);
    
    return 0;
}
```

### 类型萃取（Type Traits）

```cpp
#include <type_traits>

template<typename T>
void analyzeType() {
    std::cout << "Type analysis:\n";
    std::cout << "Is integral: " << std::is_integral_v<T> << "\n";
    std::cout << "Is floating point: " << std::is_floating_point_v<T> << "\n";
    std::cout << "Is pointer: " << std::is_pointer_v<T> << "\n";
    std::cout << "Is const: " << std::is_const_v<T> << "\n";
    std::cout << "Size: " << sizeof(T) << " bytes\n\n";
}

// 自定义类型萃取
template<typename T>
struct remove_all_pointers {
    using type = T;
};

template<typename T>
struct remove_all_pointers<T*> {
    using type = typename remove_all_pointers<T>::type;
};

template<typename T>
using remove_all_pointers_t = typename remove_all_pointers<T>::type;
```

### 模板递归和列表处理

```cpp
// 编译时列表处理
template<int... Ns>
struct IntList {};

template<int N, int... Ns>
struct Sum<IntList<N, Ns...>> {
    static constexpr int value = N + Sum<IntList<Ns...>>::value;
};

template<>
struct Sum<IntList<>> {
    static constexpr int value = 0;
};

// 使用示例
using MyList = IntList<1, 2, 3, 4, 5>;
constexpr int total = Sum<MyList>::value;  // 15
```

---

## 实际应用示例

### 智能指针实现

```cpp
template<typename T>
class UniquePtr {
private:
    T* ptr;
    
public:
    // 构造函数
    explicit UniquePtr(T* p = nullptr) : ptr(p) {}
    
    // 移动构造函数
    UniquePtr(UniquePtr&& other) noexcept : ptr(other.ptr) {
        other.ptr = nullptr;
    }
    
    // 移动赋值操作符
    UniquePtr& operator=(UniquePtr&& other) noexcept {
        if (this != &other) {
            delete ptr;
            ptr = other.ptr;
            other.ptr = nullptr;
        }
        return *this;
    }
    
    // 禁用拷贝
    UniquePtr(const UniquePtr&) = delete;
    UniquePtr& operator=(const UniquePtr&) = delete;
    
    // 析构函数
    ~UniquePtr() {
        delete ptr;
    }
    
    // 访问操作符
    T& operator*() const { return *ptr; }
    T* operator->() const { return ptr; }
    
    // 获取原始指针
    T* get() const { return ptr; }
    
    // 释放所有权
    T* release() {
        T* temp = ptr;
        ptr = nullptr;
        return temp;
    }
    
    // 重置指针
    void reset(T* p = nullptr) {
        delete ptr;
        ptr = p;
    }
    
    // 布尔转换
    explicit operator bool() const {
        return ptr != nullptr;
    }
};

// 工厂函数
template<typename T, typename... Args>
UniquePtr<T> makeUnique(Args&&... args) {
    return UniquePtr<T>(new T(std::forward<Args>(args)...));
}
```

### 通用容器适配器

```cpp
template<typename Container>
class ContainerAdapter {
private:
    Container container;
    
public:
    using value_type = typename Container::value_type;
    using iterator = typename Container::iterator;
    using const_iterator = typename Container::const_iterator;
    
    // 转发构造函数
    template<typename... Args>
    ContainerAdapter(Args&&... args) : container(std::forward<Args>(args)...) {}
    
    // 基本操作
    void add(const value_type& item) {
        if constexpr (requires { container.push_back(item); }) {
            container.push_back(item);
        } else if constexpr (requires { container.insert(item); }) {
            container.insert(item);
        }
    }
    
    size_t size() const { return container.size(); }
    bool empty() const { return container.empty(); }
    
    // 迭代器支持
    iterator begin() { return container.begin(); }
    iterator end() { return container.end(); }
    const_iterator begin() const { return container.begin(); }
    const_iterator end() const { return container.end(); }
    
    // 访问底层容器
    Container& getContainer() { return container; }
    const Container& getContainer() const { return container; }
};
```

### 函数对象包装器

```cpp
template<typename Signature>
class Function;

template<typename R, typename... Args>
class Function<R(Args...)> {
private:
    class FunctionBase {
    public:
        virtual ~FunctionBase() = default;
        virtual R call(Args... args) = 0;
        virtual std::unique_ptr<FunctionBase> clone() = 0;
    };
    
    template<typename F>
    class FunctionImpl : public FunctionBase {
        F func;
    public:
        FunctionImpl(F f) : func(std::move(f)) {}
        
        R call(Args... args) override {
            return func(args...);
        }
        
        std::unique_ptr<FunctionBase> clone() override {
            return std::make_unique<FunctionImpl>(func);
        }
    };
    
    std::unique_ptr<FunctionBase> impl;
    
public:
    Function() = default;
    
    template<typename F>
    Function(F&& f) : impl(std::make_unique<FunctionImpl<std::decay_t<F>>>(std::forward<F>(f))) {}
    
    Function(const Function& other) : impl(other.impl ? other.impl->clone() : nullptr) {}
    
    Function& operator=(const Function& other) {
        if (this != &other) {
            impl = other.impl ? other.impl->clone() : nullptr;
        }
        return *this;
    }
    
    Function(Function&&) = default;
    Function& operator=(Function&&) = default;
    
    R operator()(Args... args) {
        if (!impl) throw std::runtime_error("Function is empty");
        return impl->call(args...);
    }
    
    explicit operator bool() const { return static_cast<bool>(impl); }
};
```

---

## 最佳实践

### 1. 模板设计原则

```cpp
// ✅ 好的做法：使用typename而不是class（除非需要模板模板参数）
template<typename T>
class GoodExample {};

// ✅ 好的做法：提供清晰的约束
template<typename T>
requires std::is_arithmetic_v<T>
T calculate(T value) { return value * 2; }

// ✅ 好的做法：使用SFINAE或concepts进行类型约束
template<typename T>
std::enable_if_t<std::is_integral_v<T>, T>
processInteger(T value) { return value; }
```

### 2. 错误处理和调试

```cpp
// ✅ 提供有意义的错误信息
template<typename T>
class SafeContainer {
    static_assert(std::is_copy_constructible_v<T>, 
                  "T must be copy constructible");
    static_assert(!std::is_same_v<T, void>, 
                  "T cannot be void");
    // ...
};

// ✅ 使用概念提供更好的错误信息
template<typename T>
concept Sortable = requires(T a, T b) {
    { a < b } -> std::convertible_to<bool>;
};

template<Sortable T>
void sort(std::vector<T>& vec) {
    // 排序实现
}
```

### 3. 性能优化

```cpp
// ✅ 使用完美转发
template<typename T>
void wrapper(T&& value) {
    process(std::forward<T>(value));
}

// ✅ 避免不必要的模板实例化
template<typename T>
class Optimized {
    // 只有在需要时才实例化昂贵的操作
    void expensiveOperation() {
        if constexpr (requires { T{}.someMethod(); }) {
            // 只有T有someMethod时才编译这部分
        }
    }
};
```

### 4. 代码组织

```cpp
// 头文件：声明
// MyTemplate.h
template<typename T>
class MyTemplate {
public:
    void method();
};

// 如果需要分离实现，使用包含模型
#include "MyTemplate.tpp"

// MyTemplate.tpp
template<typename T>
void MyTemplate<T>::method() {
    // 实现
}
```

---

## 常见错误

### 1. 模板编译错误

```cpp
// ❌ 错误：忘记typename关键字
template<typename T>
class Bad {
    T::iterator it;  // 错误！应该是 typename T::iterator it;
};

// ✅ 正确
template<typename T>
class Good {
    typename T::iterator it;
};
```

### 2. 特化相关错误

```cpp
// ❌ 错误：在命名空间内特化
namespace MyNamespace {
    template<>
    void func<int>() {}  // 错误！
}

// ✅ 正确：在全局命名空间特化
template<>
void MyNamespace::func<int>() {}
```

### 3. 依赖名称查找

```cpp
template<typename T>
class Base {
public:
    void baseMethod() {}
};

template<typename T>
class Derived : public Base<T> {
public:
    void method() {
        // ❌ 错误：依赖名称查找问题
        baseMethod();
        
        // ✅ 正确的方式
        this->baseMethod();
        // 或者
        Base<T>::baseMethod();
    }
};
```

### 4. 模板实例化时机

```cpp
// ❌ 问题：可能导致循环依赖
template<typename T>
class Problem {
    static T value;
};

template<typename T>
T Problem<T>::value = T{};  // 可能过早实例化

// ✅ 更好的方式
template<typename T>
class Better {
public:
    static T& getValue() {
        static T value{};
        return value;
    }
};
```

---

## 总结

C++模板是一个强大而复杂的特性，它提供了：

1. **泛型编程能力** - 编写类型无关的代码
2. **编译时计算** - 在编译期间进行复杂计算
3. **零开销抽象** - 在不损失性能的前提下提供抽象
4. **类型安全** - 编译时类型检查

掌握模板需要：
- 理解模板的基本概念和语法
- 熟悉特化、实例化等高级特性
- 了解现代C++的模板新特性
- 遵循最佳实践，避免常见陷阱

模板是C++中最具表达力的特性之一，值得深入学习和掌握。随着C++标准的发展，模板系统也在不断完善，变得更加易用和强大。