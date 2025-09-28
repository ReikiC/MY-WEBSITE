# C# vs C/C++ 关键概念对比

## 内存管理

### C/C++
```cpp
// 手动内存管理
char* buffer = new char[1024];
delete[] buffer;

// 栈对象
MyClass obj;
```

### C#
```csharp
// 垃圾回收自动管理
byte[] buffer = new byte[1024];
// 无需手动释放

// 引用类型（堆）
MyClass obj = new MyClass();

// 值类型（栈）
int value = 10;
```

## 指针 vs 引用

### C/C++
```cpp
void ProcessData(char* data, int* length) {
    *length = strlen(data);
}

int len;
ProcessData(buffer, &len);
```

### C#
```csharp
// ref/out 参数
void ProcessData(byte[] data, out int length) {
    length = data.Length;
}

int len;
ProcessData(buffer, out len);
```

## 类定义

### C/C++
```cpp
// .h 文件
class MyClass {
private:
    int value;
public:
    MyClass(int v);
    ~MyClass();
    void DoSomething();
};

// .cpp 文件
MyClass::MyClass(int v) : value(v) {}
MyClass::~MyClass() {}
void MyClass::DoSomething() { ... }
```

### C#
```csharp
// 一个文件搞定
public class MyClass {
    private int value;
    
    public MyClass(int v) {
        value = v;
    }
    
    // 析构函数变成终结器（很少用）
    ~MyClass() {
        // 清理非托管资源
    }
    
    public void DoSomething() {
        // 实现
    }
}
```

## 接口

### C/C++
```cpp
// 抽象基类
class IPacketHandler {
public:
    virtual void Handle() = 0;
    virtual ~IPacketHandler() = default;
};
```

### C#
```csharp
// 接口（更简洁）
public interface IPacketHandler {
    void Handle();
}

// 实现
public class MyHandler : IPacketHandler {
    public void Handle() {
        // 实现
    }
}
```

## 泛型

### C/C++
```cpp
template<typename T>
class ObjectPool {
private:
    std::stack<T*> pool;
public:
    T* Pop() { ... }
    void Push(T* item) { ... }
};
```

### C#
```csharp
public class ObjectPool<T> where T : class {
    private Stack<T> pool;
    
    public T Pop() { ... }
    public void Push(T item) { ... }
}
```

## 异步编程

### C/C++
```cpp
// 回调函数
void ProcessCallback(char* data, int length, void* userdata) {
    // 处理结果
}

// 或者 std::future
std::future<int> result = std::async(std::launch::async, [](){
    return ProcessData();
});
```

### C#
```csharp
// async/await (类似 JavaScript 的 Promise)
public async Task<int> ProcessDataAsync() {
    return await SomeAsyncOperation();
}

// 使用
int result = await ProcessDataAsync();
```

## 异常处理

### C/C++
```cpp
try {
    DoSomething();
} catch (const std::exception& e) {
    std::cout << e.what() << std::endl;
}
```

### C#
```csharp
try {
    DoSomething();
} catch (Exception e) {
    Console.WriteLine(e.Message);
}
```

## 命名空间

### C++
```cpp
namespace Networker {
    namespace Common {
        class PacketContext { ... };
    }
}

using Networker::Common::PacketContext;
```

### C#
```csharp
namespace Networker.Common {
    public class PacketContext { ... }
}

using Networker.Common;
```

## 属性 (Properties)

### C++
```cpp
class MyClass {
private:
    int value;
public:
    int GetValue() const { return value; }
    void SetValue(int v) { value = v; }
};
```

### C#
```csharp
public class MyClass {
    private int value;
    
    // 属性语法糖
    public int Value {
        get { return value; }
        set { this.value = value; }
    }
    
    // 自动属性
    public string Name { get; set; }
}
```

## 委托 (类似函数指针)

### C++
```cpp
typedef void (*EventHandler)(int data);
EventHandler handler = MyFunction;
handler(42);
```

### C#
```csharp
public delegate void EventHandler(int data);
EventHandler handler = MyMethod;
handler(42);

// 或者使用 Action/Func
Action<int> action = MyMethod;
Func<int, string> func = ConvertToString;
```

## 关键差异总结

1. **内存管理**: C# 有垃圾回收，无需手动释放内存
2. **类型安全**: C# 更严格的类型检查
3. **异常处理**: C# 必须处理或声明异常
4. **反射**: C# 运行时可以检查类型信息
5. **属性**: C# 的 getter/setter 语法糖
6. **async/await**: C# 内置异步编程支持
7. **LINQ**: C# 内置查询语法
8. **依赖注入**: .NET 框架级别的 DI 支持