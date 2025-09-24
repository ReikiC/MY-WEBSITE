---
sidebar_position: 5
---

# 现代C++特性 (C++11/14/17/20)

现代C++通过引入新特性大幅提升了语言的表达能力、安全性和性能，使C++编程更加高效和优雅。

## C++11 革命性变化

### 🚀 **自动类型推导**

#### **auto关键字**
```cpp
// C++11之前
std::map<std::string, std::vector<int>>::iterator it = mymap.begin();

// C++11之后
auto it = mymap.begin();  // 编译器自动推导类型

void auto_examples() {
    // 基本类型推导
    auto i = 42;           // int
    auto f = 3.14f;        // float
    auto d = 3.14;         // double
    auto s = "hello";      // const char*
    
    // 复杂类型推导
    std::vector<int> vec{1, 2, 3};
    auto iter = vec.begin();              // std::vector<int>::iterator
    auto lambda = [](int x) { return x * 2; };  // lambda类型
    
    // 函数返回值推导
    auto result = std::make_pair(42, "answer");  // std::pair<int, const char*>
    
    // 模板中的auto
    template<typename T>
    auto add(T a, T b) -> decltype(a + b) {  // C++11 trailing return type
        return a + b;
    }
}
```

#### **decltype关键字**
```cpp
void decltype_examples() {
    int x = 10;
    double y = 3.14;
    
    // decltype推导表达式类型
    decltype(x) a = 20;        // int a = 20;
    decltype(y) b = 2.71;      // double b = 2.71;
    decltype(x + y) c = x + y; // double c = x + y;
    
    // 用于模板编程
    template<typename T, typename U>
    auto multiply(T t, U u) -> decltype(t * u) {
        return t * u;
    }
    
    // decltype(auto) - C++14
    // auto result = multiply(x, y);         // 推导为值类型
    // decltype(auto) result2 = multiply(x, y);  // 保持引用特性
}
```

### 🎯 **范围for循环**
```cpp
void range_for_examples() {
    std::vector<int> numbers{1, 2, 3, 4, 5};
    
    // 传统for循环
    for (size_t i = 0; i < numbers.size(); ++i) {
        std::cout << numbers[i] << " ";
    }
    
    // 范围for循环
    for (const auto& num : numbers) {  // 只读访问
        std::cout << num << " ";
    }
    
    // 修改元素
    for (auto& num : numbers) {
        num *= 2;
    }
    
    // 自定义类型支持范围for
    class NumberRange {
    private:
        int start, end;
        
    public:
        NumberRange(int s, int e) : start(s), end(e) {}
        
        class Iterator {
        private:
            int current;
        public:
            Iterator(int c) : current(c) {}
            int operator*() const { return current; }
            Iterator& operator++() { ++current; return *this; }
            bool operator!=(const Iterator& other) const {
                return current != other.current;
            }
        };
        
        Iterator begin() const { return Iterator(start); }
        Iterator end() const { return Iterator(end); }
    };
    
    // 使用自定义范围
    NumberRange range(1, 6);
    for (int n : range) {  // 输出: 1 2 3 4 5
        std::cout << n << " ";
    }
}
```

### 🧩 **lambda表达式**
```cpp
void lambda_detailed() {
    // lambda语法: [捕获](参数) -> 返回类型 { 函数体 }
    
    // 1. 基本lambda
    auto simple = []() { return 42; };
    
    // 2. 带参数的lambda
    auto add = [](int a, int b) { return a + b; };
    
    // 3. 指定返回类型
    auto divide = [](double a, double b) -> double {
        return b != 0 ? a / b : 0.0;
    };
    
    // 4. 捕获外部变量
    int x = 10, y = 20;
    
    // 值捕获
    auto lambda1 = [x, y]() { return x + y; };  // 拷贝x和y
    
    // 引用捕获
    auto lambda2 = [&x, &y]() { x++; y++; };    // 引用x和y
    
    // 混合捕获
    auto lambda3 = [x, &y](int z) { return x + y + z; };
    
    // 全部值捕获
    auto lambda4 = [=]() { return x * y; };     // 拷贝所有外部变量
    
    // 全部引用捕获
    auto lambda5 = [&]() { x = 0; y = 0; };     // 引用所有外部变量
    
    // mutable lambda
    auto lambda6 = [x](int n) mutable { return x += n; };
    
    // lambda作为函数参数
    std::vector<int> vec{1, 2, 3, 4, 5};
    
    // 使用lambda进行变换
    std::transform(vec.begin(), vec.end(), vec.begin(),
                  [](int n) { return n * n; });
    
    // 使用lambda进行过滤
    auto count = std::count_if(vec.begin(), vec.end(),
                              [](int n) { return n > 10; });
}
```

### 🎁 **初始化列表**
```cpp
#include <initializer_list>

class MyVector {
private:
    std::vector<int> data;
    
public:
    // 支持初始化列表构造
    MyVector(std::initializer_list<int> list) : data(list) {}
    
    // 支持初始化列表赋值
    MyVector& operator=(std::initializer_list<int> list) {
        data = list;
        return *this;
    }
    
    void print() const {
        for (int n : data) std::cout << n << " ";
        std::cout << std::endl;
    }
};

void initializer_list_examples() {
    // 统一初始化语法
    int x{42};                    // 直接初始化
    std::vector<int> vec{1, 2, 3, 4, 5};  // 容器初始化
    std::map<int, std::string> map{{1, "one"}, {2, "two"}};  // 映射初始化
    
    // 自定义类型使用
    MyVector mv{10, 20, 30, 40};
    mv.print();
    
    mv = {100, 200, 300};  // 初始化列表赋值
    mv.print();
    
    // 防止窄化转换
    // int narrow{3.14};  // 编译错误：不允许窄化转换
    int correct{3};       // OK
}
```

## C++14 增强特性

### 🔧 **泛型Lambda**
```cpp
void generic_lambda() {
    // 泛型lambda（模板参数推导）
    auto generic_add = [](auto a, auto b) {
        return a + b;
    };
    
    // 可以处理不同类型
    auto int_result = generic_add(5, 10);           // int + int
    auto double_result = generic_add(3.14, 2.86);   // double + double
    auto string_result = generic_add(std::string("Hello"), std::string(" World"));
    
    // 完美转发lambda
    auto perfect_forward = [](auto&& args...) {
        return some_function(std::forward<decltype(args)>(args)...);
    };
}
```

### 🎯 **变量模板**
```cpp
// 变量模板定义
template<typename T>
constexpr T pi = T(3.1415926535897932385);

// 特化
template<>
constexpr const char* pi<const char*> = "3.14159";

void variable_templates() {
    // 使用不同类型的pi
    float pi_f = pi<float>;
    double pi_d = pi<double>;
    long double pi_ld = pi<long double>;
    
    std::cout << "Pi as string: " << pi<const char*> << std::endl;
    
    // 标准库变量模板示例
    static_assert(std::is_integral_v<int>);  // 等价于 std::is_integral<int>::value
    static_assert(std::is_same_v<int, int>);
}
```

## C++17 重大改进

### 📦 **结构化绑定**
```cpp
void structured_bindings() {
    // std::pair解构
    std::pair<int, std::string> p{42, "answer"};
    auto [number, text] = p;  // C++17结构化绑定
    
    // std::tuple解构
    std::tuple<int, double, std::string> t{1, 3.14, "hello"};
    auto [i, d, s] = t;
    
    // 数组解构
    int arr[3] = {1, 2, 3};
    auto [a, b, c] = arr;
    
    // 自定义类型结构化绑定
    struct Point { int x, y; };
    Point pt{10, 20};
    auto [px, py] = pt;
    
    // 在容器中的应用
    std::map<int, std::string> map{{1, "one"}, {2, "two"}};
    for (const auto& [key, value] : map) {
        std::cout << key << " -> " << value << std::endl;
    }
    
    // 函数返回多值
    auto divide_with_remainder = [](int a, int b) -> std::pair<int, int> {
        return {a / b, a % b};
    };
    
    auto [quotient, remainder] = divide_with_remainder(17, 5);
}
```

### 🎯 **if constexpr**
```cpp
template<typename T>
void process_type() {
    if constexpr (std::is_integral_v<T>) {
        std::cout << "Processing integer type" << std::endl;
        // 只有T是整数类型时，这段代码才会被编译
    } else if constexpr (std::is_floating_point_v<T>) {
        std::cout << "Processing floating point type" << std::endl;
        // 只有T是浮点类型时，这段代码才会被编译
    } else {
        std::cout << "Processing other type" << std::endl;
    }
}

// 编译时分支，避免模板特化
template<typename Container>
auto get_size(const Container& c) {
    if constexpr (std::is_same_v<Container, std::string>) {
        return c.length();  // 字符串使用length()
    } else {
        return c.size();    // 其他容器使用size()
    }
}
```

### 📁 **std::optional**
```cpp
#include <optional>

std::optional<int> safe_divide(int a, int b) {
    if (b != 0) {
        return a / b;
    }
    return std::nullopt;  // 表示无值
}

std::optional<std::string> find_user_name(int id) {
    static std::map<int, std::string> users{{1, "Alice"}, {2, "Bob"}};
    auto it = users.find(id);
    if (it != users.end()) {
        return it->second;
    }
    return std::nullopt;
}

void optional_examples() {
    // 基本使用
    auto result = safe_divide(10, 3);
    if (result.has_value()) {
        std::cout << "Result: " << result.value() << std::endl;
    }
    
    // 简化检查
    if (result) {  // 隐式转换为bool
        std::cout << "Result: " << *result << std::endl;  // 解引用获取值
    }
    
    // 提供默认值
    auto name = find_user_name(999);
    std::cout << "Name: " << name.value_or("Unknown") << std::endl;
    
    // 链式操作（C++23 monadic operations预览）
    auto user_id = 1;
    find_user_name(user_id)
        .and_then([](const std::string& name) -> std::optional<int> {
            return name.length();
        })
        .or_else([]() -> std::optional<int> {
            return 0;
        });
}
```

## C++20 现代化飞跃

### 🎨 **概念 (Concepts)**
```cpp
#include <concepts>

// 定义概念
template<typename T>
concept Addable = requires(T a, T b) {
    a + b;  // 要求类型T支持加法操作
};

template<typename T>
concept Printable = requires(T t) {
    std::cout << t;  // 要求类型T可以输出到流
};

// 使用概念约束模板
template<Addable T>
T add(T a, T b) {
    return a + b;
}

// 复合概念
template<typename T>
concept Number = std::integral<T> || std::floating_point<T>;

template<Number T>
T multiply(T a, T b) {
    return a * b;
}

// 概念的requires子句
template<typename T>
requires Addable<T> && Printable<T>
void process_and_print(T value) {
    auto result = add(value, value);
    std::cout << result << std::endl;
}

void concepts_demo() {
    // 这些调用会通过概念检查
    add(5, 10);        // int满足Addable
    add(3.14, 2.86);   // double满足Addable
    
    multiply(42, 2);   // int满足Number
    
    // add("hello", "world");  // 编译错误：字符串字面量不满足Addable
}
```

### 🔧 **Ranges库**
```cpp
#include <ranges>
#include <algorithm>

void ranges_examples() {
    std::vector<int> numbers{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // 传统STL算法
    std::vector<int> evens;
    std::copy_if(numbers.begin(), numbers.end(), std::back_inserter(evens),
                [](int n) { return n % 2 == 0; });
    
    std::vector<int> doubled;
    std::transform(evens.begin(), evens.end(), std::back_inserter(doubled),
                  [](int n) { return n * 2; });
    
    // Ranges库 - 管道式操作
    namespace views = std::views;
    auto result = numbers
                 | views::filter([](int n) { return n % 2 == 0; })
                 | views::transform([](int n) { return n * 2; })
                 | views::take(3);  // 只取前3个元素
    
    // 延迟求值 - 只有在迭代时才计算
    for (int n : result) {
        std::cout << n << " ";  // 输出: 4 8 12
    }
    
    // 其他有用的视图
    auto squares = views::iota(1, 6)  // 生成1,2,3,4,5
                  | views::transform([](int n) { return n * n; });
    
    auto first_three = numbers | views::take(3);
    auto skip_first_two = numbers | views::drop(2);
    auto reverse_view = numbers | views::reverse;
}
```

### ⚡ **协程 (Coroutines)**
```cpp
#include <coroutine>
#include <iostream>

// 简单的生成器协程
struct Generator {
    struct promise_type {
        int current_value;
        
        Generator get_return_object() {
            return Generator{std::coroutine_handle<promise_type>::from_promise(*this)};
        }
        
        std::suspend_always initial_suspend() { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }
        void unhandled_exception() {}
        
        std::suspend_always yield_value(int value) {
            current_value = value;
            return {};
        }
        
        void return_void() {}
    };
    
    std::coroutine_handle<promise_type> h;
    
    explicit Generator(std::coroutine_handle<promise_type> handle) : h(handle) {}
    
    ~Generator() { 
        if (h) h.destroy(); 
    }
    
    // 移动构造和赋值
    Generator(Generator&& other) noexcept : h(other.h) { other.h = {}; }
    Generator& operator=(Generator&& other) noexcept {
        if (this != &other) {
            if (h) h.destroy();
            h = other.h;
            other.h = {};
        }
        return *this;
    }
    
    // 禁止拷贝
    Generator(const Generator&) = delete;
    Generator& operator=(const Generator&) = delete;
    
    bool next() {
        h.resume();
        return !h.done();
    }
    
    int value() const {
        return h.promise().current_value;
    }
};

// 协程函数
Generator fibonacci() {
    int a = 0, b = 1;
    while (true) {
        co_yield a;
        auto tmp = a;
        a = b;
        b = tmp + b;
    }
}

void coroutine_demo() {
    auto fib = fibonacci();
    
    // 生成前10个斐波那契数
    for (int i = 0; i < 10; ++i) {
        if (fib.next()) {
            std::cout << fib.value() << " ";
        }
    }
    // 输出: 0 1 1 2 3 5 8 13 21 34
}
```

### 🎯 **模块 (Modules) - 预览**
```cpp
// math_module.cppm (模块接口文件)
export module math_utils;

export namespace math {
    int add(int a, int b) {
        return a + b;
    }
    
    int multiply(int a, int b) {
        return a * b;
    }
}

// main.cpp (使用模块)
import math_utils;
import std.iostream;

int main() {
    std::cout << math::add(5, 3) << std::endl;
    std::cout << math::multiply(4, 7) << std::endl;
    return 0;
}
```

## 现代C++最佳实践

### 📋 **编码规范**
```cpp
// RAII和智能指针
class ModernResource {
private:
    std::unique_ptr<int[]> data;
    size_t size;
    
public:
    explicit ModernResource(size_t n) 
        : data(std::make_unique<int[]>(n)), size(n) {}
    
    // 使用默认的移动语义
    ModernResource(ModernResource&&) = default;
    ModernResource& operator=(ModernResource&&) = default;
    
    // 禁止拷贝（如果不需要）
    ModernResource(const ModernResource&) = delete;
    ModernResource& operator=(const ModernResource&) = delete;
    
    // 范围访问
    auto begin() { return data.get(); }
    auto end() { return data.get() + size; }
    auto begin() const { return data.get(); }
    auto end() const { return data.get() + size; }
};

// 使用强类型和enum class
enum class Color : uint8_t {
    Red = 0xFF0000,
    Green = 0x00FF00,
    Blue = 0x0000FF
};

// 使用constexpr进行编译时计算
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

// 在编译时计算
constexpr auto fact10 = factorial(10);
```

### 🚀 **性能优化**
```cpp
// 移动语义优化
std::vector<std::string> create_strings() {
    std::vector<std::string> result;
    result.reserve(1000);
    
    for (int i = 0; i < 1000; ++i) {
        result.emplace_back("String " + std::to_string(i));  // 原地构造
    }
    
    return result;  // 自动移动返回
}

// 完美转发
template<typename... Args>
auto make_shared_wrapper(Args&&... args) {
    return std::make_shared<SomeClass>(std::forward<Args>(args)...);
}

// 避免不必要的拷贝
void process_data(const std::vector<int>& data) {  // const引用
    for (const auto& item : data) {  // const引用避免拷贝
        // 处理item
    }
}
```

---
*现代C++：更安全、更高效、更优雅的编程体验*