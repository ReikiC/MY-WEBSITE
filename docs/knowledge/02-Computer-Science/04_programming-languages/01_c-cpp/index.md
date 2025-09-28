---
sidebar_position: 0
---

# C/C++ 编程语言

C/C++是系统编程和嵌入式开发的核心语言，具有高效性和强大的底层控制能力。

## 语言特点

### 🎯 **C语言特性**
- **过程化编程** - 结构化程序设计
- **底层访问** - 直接操作内存和硬件
- **高效执行** - 接近汇编语言的性能
- **可移植性** - 跨平台编译和运行

### 🚀 **C++特性**
- **面向对象** - 类、继承、多态、封装
- **模板编程** - 泛型编程支持
- **标准库** - STL容器、算法、迭代器
- **现代特性** - C++11/14/17/20新特性

## 核心概念

### 📚 **基础语法**
```c
// C语言基础结构
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}

// 数据类型
int integer = 42;
float decimal = 3.14f;
char character = 'A';
char string[] = "Hello";
```

### 🔗 **指针和内存管理**
```c
// 指针操作
int value = 10;
int *ptr = &value;    // 指向value的指针
int result = *ptr;    // 解引用获取值

// 动态内存分配
int *array = malloc(sizeof(int) * 10);
if (array != NULL) {
    // 使用数组
    for(int i = 0; i < 10; i++) {
        array[i] = i;
    }
    free(array);  // 释放内存
}
```

### 🏗️ **结构体和联合体**
```c
// 结构体定义
typedef struct {
    int x;
    int y;
} Point;

// 联合体定义
typedef union {
    int intValue;
    float floatValue;
    char bytes[4];
} DataUnion;

// 使用示例
Point p1 = {10, 20};
DataUnion data;
data.intValue = 0x12345678;
```

## C++面向对象编程

### 🎯 **类和对象**
```cpp
class Rectangle {
private:
    double width, height;

public:
    // 构造函数
    Rectangle(double w, double h) : width(w), height(h) {}
    
    // 析构函数
    ~Rectangle() {}
    
    // 成员函数
    double area() const {
        return width * height;
    }
    
    // 静态成员函数
    static Rectangle createSquare(double side) {
        return Rectangle(side, side);
    }
};
```

### 🔄 **继承和多态**
```cpp
// 基类
class Shape {
public:
    virtual double area() const = 0;  // 纯虚函数
    virtual ~Shape() = default;       // 虚析构函数
};

// 派生类
class Circle : public Shape {
private:
    double radius;

public:
    Circle(double r) : radius(r) {}
    
    double area() const override {
        return 3.14159 * radius * radius;
    }
};

// 多态使用
std::unique_ptr<Shape> shape = std::make_unique<Circle>(5.0);
double area = shape->area();  // 调用Circle::area()
```

## 现代C++特性

### ✨ **C++11/14/17/20新特性**
```cpp
// 自动类型推导
auto value = 42;        // int
auto lambda = [](int x) { return x * 2; };

// 范围for循环
std::vector<int> numbers = {1, 2, 3, 4, 5};
for (const auto& num : numbers) {
    std::cout << num << " ";
}

// 智能指针
std::shared_ptr<int> ptr1 = std::make_shared<int>(42);
std::unique_ptr<int> ptr2 = std::make_unique<int>(100);

// 移动语义
std::string str1 = "Hello";
std::string str2 = std::move(str1);  // 移动而不是拷贝

// lambda表达式
auto add = [](int a, int b) -> int {
    return a + b;
};
```

## 内存管理最佳实践

### 🔒 **RAII原则**
```cpp
// Resource Acquisition Is Initialization
class FileHandler {
private:
    FILE* file;

public:
    FileHandler(const char* filename) {
        file = fopen(filename, "r");
        if (!file) {
            throw std::runtime_error("Cannot open file");
        }
    }
    
    ~FileHandler() {
        if (file) {
            fclose(file);
        }
    }
    
    // 禁止拷贝
    FileHandler(const FileHandler&) = delete;
    FileHandler& operator=(const FileHandler&) = delete;
};
```

### 🚀 **现代内存管理**
```cpp
// 避免裸指针，使用智能指针
class ResourceManager {
private:
    std::vector<std::unique_ptr<Resource>> resources;

public:
    void addResource(std::unique_ptr<Resource> resource) {
        resources.push_back(std::move(resource));
    }
    
    // 自动管理生命周期，无需手动delete
};
```

## 性能优化技巧

### ⚡ **编译器优化**
```cpp
// 内联函数
inline int fastAdd(int a, int b) {
    return a + b;
}

// 编译器提示
[[likely]]   // C++20: 提示分支可能性
if (condition) {
    // 经常执行的代码
}

// 常量表达式
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}
```

### 🔧 **代码优化**
```cpp
// 避免不必要的拷贝
void processVector(const std::vector<int>& vec) {  // 引用传递
    for (size_t i = 0; i < vec.size(); ++i) {     // 缓存size()
        // 处理vec[i]
    }
}

// 移动语义优化
std::vector<std::string> createStrings() {
    std::vector<std::string> result;
    result.reserve(1000);  // 预分配容量
    
    for (int i = 0; i < 1000; ++i) {
        result.emplace_back("String " + std::to_string(i));
    }
    
    return result;  // 自动移动返回
}
```

## 应用领域

### 🎮 **系统编程**
- **操作系统内核** - Linux, Windows内核开发
- **设备驱动程序** - 硬件驱动开发
- **嵌入式系统** - 微控制器编程
- **实时系统** - 高性能实时应用

### 🚀 **应用软件**
- **游戏引擎** - Unreal Engine, 自定义引擎
- **图形渲染** - OpenGL, DirectX应用
- **高性能计算** - 科学计算、数值分析
- **网络服务器** - 高并发服务器开发

## 学习路径

### 🌱 **初级阶段**
1. **C语言基础** - 语法、指针、数组、结构体
2. **内存管理** - malloc/free、指针运算
3. **文件操作** - 文件读写、标准库使用
4. **调试技能** - GDB调试、内存检查工具

### 🌿 **中级阶段**
1. **C++面向对象** - 类、继承、多态
2. **STL容器** - vector, map, set等使用
3. **异常处理** - try/catch机制
4. **模板编程** - 函数模板、类模板

### 🌳 **高级阶段**
1. **现代C++特性** - C++11及以后新特性
2. **设计模式** - 常用设计模式实现
3. **性能优化** - 编译器优化、代码调优
4. **并发编程** - 多线程、异步编程

---
*C/C++：系统编程的基石，高性能应用的首选*