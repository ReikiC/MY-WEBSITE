# 命名空间 namespace

## 🚀 C++ 中的 namespace（命名空间）

`namespace` 在C++中是一个**代码组织工具**，就像给代码划分"领域"，避免名字冲突。

### 🎯 基本语法

```cpp
namespace 命名空间名 {
    // 声明和定义
}
```

### 📝 基础示例

```cpp
#include <iostream>

// 定义一个命名空间
namespace MathUtils {
    int add(int a, int b) {
        return a + b;
    }
    
    int multiply(int a, int b) {
        return a * b;
    }
    
    const double PI = 3.14159;
}

// 另一个命名空间
namespace StringUtils {
    void print(const std::string& message) {
        std::cout << message << std::endl;
    }
    
    int length(const std::string& str) {
        return str.size();
    }
}

int main() {
    // 使用作用域解析运算符 ::
    int result = MathUtils::add(5, 3);
    std::cout << "5 + 3 = " << result << std::endl;
    
    StringUtils::print("Hello, Namespace!");
    
    return 0;
}
```

### 🔧 访问namespace中的内容

#### 1. **作用域解析运算符 `::`**
```cpp
namespace Graphics {
    class Point {
    public:
        int x, y;
        Point(int x, int y) : x(x), y(y) {}
    };
    
    void drawLine() {
        std::cout << "Drawing a line..." << std::endl;
    }
}

int main() {
    Graphics::Point p1(10, 20);        // 使用 :: 访问
    Graphics::drawLine();              // 使用 :: 访问函数
    
    return 0;
}
```

#### 2. **using 声明**
```cpp
#include <iostream>
using std::cout;      // 只导入cout
using std::endl;      // 只导入endl

namespace Game {
    class Player {
    public:
        std::string name;
        int health;
        
        Player(std::string n) : name(n), health(100) {}
        void attack() {
            cout << name << " attacks!" << endl;  // 可以直接用cout和endl
        }
    };
}

int main() {
    using Game::Player;   // 导入Player类
    
    Player warrior("Conan");
    warrior.attack();
    
    return 0;
}
```

#### 3. **using namespace 指令**
```cpp
#include <iostream>
using namespace std;    // 导入整个std命名空间

namespace GameEngine {
    class Sprite {
    public:
        void render() {
            cout << "Rendering sprite..." << endl;  // 直接使用cout
        }
    };
    
    void initialize() {
        cout << "Game engine initialized!" << endl;
    }
}

int main() {
    using namespace GameEngine;  // 导入整个GameEngine命名空间
    
    Sprite player;
    player.render();
    initialize();
    
    return 0;
}
```

### 🌟 标准库命名空间 `std`

C++标准库的所有内容都在 `std` 命名空间中：

```cpp
#include <iostream>
#include <vector>
#include <string>

int main() {
    // 方式1: 完整路径
    std::cout << "Hello World!" << std::endl;
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    std::string message = "C++ Programming";
    
    // 方式2: using声明
    using std::cout;
    using std::vector;
    
    cout << message << std::endl;
    vector<double> scores = {95.5, 87.2, 92.8};
    
    // 方式3: using namespace (不推荐在头文件中使用)
    using namespace std;
    cout << "This is easier to write" << endl;
    
    return 0;
}
```

### 🏗️ 嵌套命名空间

```cpp
namespace Company {
    namespace Graphics {
        namespace 2D {
            class Circle {
            public:
                double radius;
                Circle(double r) : radius(r) {}
                
                double area() {
                    return 3.14159 * radius * radius;
                }
            };
        }
        
        namespace 3D {
            class Sphere {
            public:
                double radius;
                Sphere(double r) : radius(r) {}
                
                double volume() {
                    return (4.0/3.0) * 3.14159 * radius * radius * radius;
                }
            };
        }
    }
}

int main() {
    // 访问嵌套命名空间
    Company::Graphics::2D::Circle circle(5.0);
    Company::Graphics::3D::Sphere sphere(3.0);
    
    std::cout << "Circle area: " << circle.area() << std::endl;
    std::cout << "Sphere volume: " << sphere.volume() << std::endl;
    
    // 使用别名简化
    namespace CG2D = Company::Graphics::2D;
    namespace CG3D = Company::Graphics::3D;
    
    CG2D::Circle smallCircle(2.0);
    CG3D::Sphere smallSphere(1.0);
    
    return 0;
}
```

### 💡 C++17 嵌套命名空间语法糖

```cpp
// 传统写法
namespace A {
    namespace B {
        namespace C {
            void func() {
                std::cout << "Function in A::B::C" << std::endl;
            }
        }
    }
}

// C++17 简化写法
namespace A::B::C {
    void func2() {
        std::cout << "Function2 in A::B::C" << std::endl;
    }
}

int main() {
    A::B::C::func();
    A::B::C::func2();
    return 0;
}
```

### 🚫 避免命名冲突的实例

```cpp
// 两个库都有同名函数
namespace AudioLib {
    void play() {
        std::cout << "Playing audio..." << std::endl;
    }
}

namespace VideoLib {
    void play() {
        std::cout << "Playing video..." << std::endl;
    }
}

// 用户代码
void play() {
    std::cout << "Playing user content..." << std::endl;
}

int main() {
    play();                // 调用全局的play函数
    AudioLib::play();      // 调用音频库的play函数
    VideoLib::play();      // 调用视频库的play函数
    
    return 0;
}
```


### 🎯 命名空间别名

当命名空间名太长时，可以使用别名：

```cpp
namespace VeryLongCompanyName {
    namespace GraphicsRenderingEngine {
        namespace AdvancedShaderSystem {
            void compileShader() {
                std::cout << "Compiling advanced shader..." << std::endl;
            }
        }
    }
}

int main() {
    // 使用别名简化
    namespace Shaders = VeryLongCompanyName::GraphicsRenderingEngine::AdvancedShaderSystem;
    
    Shaders::compileShader();  // 简洁多了！
    
    return 0;
}
```

### 🚨 匿名命名空间（C++特有）

匿名命名空间让内容只在当前文件内可见，类似于 `static`：

```cpp
// File: math_utils.cpp
#include <iostream>

namespace {  // 匿名命名空间
    // 这些函数只在当前文件内可见
    double calculateTax(double amount) {
        return amount * 0.15;
    }
    
    const double SECRET_CONSTANT = 42.0;
}

namespace MathUtils {
    double calculateTotal(double baseAmount) {
        // 可以使用匿名命名空间中的函数
        return baseAmount + calculateTax(baseAmount);
    }
    
    void printSecret() {
        std::cout << "Secret: " << SECRET_CONSTANT << std::endl;
    }
}
```

### ⚖️ C# vs C++ namespace 对比

| 特性 | C++ | C# |
|------|-----|-----|
| **语法** | `namespace Name { }` | `namespace Name { }` |
| **访问** | `::` 作用域解析 | `.` 点号访问 |
| **导入** | `using namespace` | `using` |
| **嵌套** | 支持，C++17有简化语法 | 支持 |
| **匿名** | 支持匿名命名空间 | 不支持 |
| **文件关系** | 可跨多个文件 | 通常与文件夹结构对应 |

```cpp
// C++
namespace Math {
    int add(int a, int b);
}
int result = Math::add(1, 2);  // 使用 ::

// 对比 C#
namespace Math {
    public static int Add(int a, int b);
}
int result = Math.Add(1, 2);   // 使用 .
```

### 📋 最佳实践

#### ✅ 推荐做法：

```cpp
// 1. 在源文件中使用 using namespace
// main.cpp
#include <iostream>
using namespace std;  // 在.cpp文件中OK

// 2. 在头文件中避免 using namespace
// myheader.h
namespace MyLib {
    void function();
}
// 不要在头文件中写 using namespace std;

// 3. 使用具体的 using 声明
using std::cout;
using std::endl;
// 而不是 using namespace std;

// 4. 给长命名空间起别名
namespace UI = UserInterface::Controls::Advanced;
```

#### ❌ 避免的做法：

```cpp
// 1. 在头文件中 using namespace
// bad_header.h
using namespace std;  // ❌ 会污染包含此头文件的所有文件

// 2. 全局命名空间中定义太多东西
void globalFunction();  // ❌ 容易冲突
int globalVariable;     // ❌ 容易冲突

// 3. 命名空间名太短或太泛泛
namespace Util { }      // ❌ 太通用
namespace A { }         // ❌ 没有意义
```

### 🎯 总结

C++的namespace是一个强大的工具：

1. **🏠 组织代码** - 将相关功能分组
2. **🚫 避免冲突** - 防止名字冲突
3. **📚 标准库** - `std` 包含所有标准功能
4. **🔧 灵活访问** - `::`, `using`, `using namespace`
5. **🎪 嵌套支持** - 可以多层嵌套
6. **👻 匿名命名空间** - 文件级别的私有性

namespace让C++代码更加模块化、更易维护，是现代C++编程的重要组成部分！