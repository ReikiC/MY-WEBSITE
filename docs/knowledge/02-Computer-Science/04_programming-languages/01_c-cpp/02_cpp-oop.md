# C++ 面向对象编程

C++在C语言基础上增加了面向对象编程支持，提供了更强大的抽象能力和代码组织方式。

## 面向对象核心概念

### 🏗️ **类与对象设计**

#### **类的基本结构**
```cpp
class BankAccount {
private:
    std::string account_number;
    double balance;
    static int total_accounts;  // 静态成员变量

public:
    // 构造函数
    BankAccount(const std::string& acc_num, double initial_balance = 0.0)
        : account_number(acc_num), balance(initial_balance) {
        total_accounts++;
    }
    
    // 拷贝构造函数
    BankAccount(const BankAccount& other) 
        : account_number(other.account_number), balance(other.balance) {
        total_accounts++;
    }
    
    // 赋值运算符
    BankAccount& operator=(const BankAccount& other) {
        if (this != &other) {
            account_number = other.account_number;
            balance = other.balance;
        }
        return *this;
    }
    
    // 析构函数
    ~BankAccount() {
        total_accounts--;
    }
    
    // 成员函数
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    bool withdraw(double amount) {
        if (amount > 0 && balance >= amount) {
            balance -= amount;
            return true;
        }
        return false;
    }
    
    double getBalance() const { return balance; }
    
    // 静态成员函数
    static int getTotalAccounts() { return total_accounts; }
    
    // 友元函数
    friend std::ostream& operator<<(std::ostream& os, const BankAccount& acc);
};

// 静态成员定义
int BankAccount::total_accounts = 0;

// 友元函数实现
std::ostream& operator<<(std::ostream& os, const BankAccount& acc) {
    os << "Account: " << acc.account_number << ", Balance: $" << acc.balance;
    return os;
}
```

### 🔄 **继承与多态**

#### **继承层次设计**
```cpp
// 基类 - 抽象图形类
class Shape {
protected:
    std::string name;
    
public:
    Shape(const std::string& n) : name(n) {}
    virtual ~Shape() = default;  // 虚析构函数
    
    // 纯虚函数 - 抽象接口
    virtual double area() const = 0;
    virtual double perimeter() const = 0;
    virtual void draw() const = 0;
    
    // 虚函数 - 可重写的默认实现
    virtual void print() const {
        std::cout << "Shape: " << name << ", Area: " << area() << std::endl;
    }
    
    // 非虚函数 - 不可重写
    std::string getName() const { return name; }
};

// 派生类 - 矩形
class Rectangle : public Shape {
private:
    double width, height;
    
public:
    Rectangle(double w, double h) : Shape("Rectangle"), width(w), height(h) {}
    
    double area() const override {
        return width * height;
    }
    
    double perimeter() const override {
        return 2 * (width + height);
    }
    
    void draw() const override {
        std::cout << "Drawing a rectangle " << width << "x" << height << std::endl;
    }
};

// 派生类 - 圆形
class Circle : public Shape {
private:
    double radius;
    static constexpr double PI = 3.14159265359;
    
public:
    Circle(double r) : Shape("Circle"), radius(r) {}
    
    double area() const override {
        return PI * radius * radius;
    }
    
    double perimeter() const override {
        return 2 * PI * radius;
    }
    
    void draw() const override {
        std::cout << "Drawing a circle with radius " << radius << std::endl;
    }
};
```

#### **多态的实际应用**
```cpp
// 多态容器
class ShapeManager {
private:
    std::vector<std::unique_ptr<Shape>> shapes;
    
public:
    void addShape(std::unique_ptr<Shape> shape) {
        shapes.push_back(std::move(shape));
    }
    
    void drawAll() const {
        for (const auto& shape : shapes) {
            shape->draw();  // 多态调用
        }
    }
    
    double totalArea() const {
        double total = 0.0;
        for (const auto& shape : shapes) {
            total += shape->area();  // 多态调用
        }
        return total;
    }
    
    template<typename T>
    std::vector<T*> getShapesOfType() const {
        std::vector<T*> result;
        for (const auto& shape : shapes) {
            if (auto* typed_shape = dynamic_cast<T*>(shape.get())) {
                result.push_back(typed_shape);
            }
        }
        return result;
    }
};

// 使用示例
void demo_polymorphism() {
    ShapeManager manager;
    
    manager.addShape(std::make_unique<Rectangle>(5.0, 3.0));
    manager.addShape(std::make_unique<Circle>(2.0));
    manager.addShape(std::make_unique<Rectangle>(4.0, 4.0));
    
    std::cout << "Drawing all shapes:" << std::endl;
    manager.drawAll();
    
    std::cout << "Total area: " << manager.totalArea() << std::endl;
    
    // 获取特定类型的图形
    auto rectangles = manager.getShapesOfType<Rectangle>();
    std::cout << "Found " << rectangles.size() << " rectangles" << std::endl;
}
```

### 🔒 **封装与访问控制**

#### **访问级别控制**
```cpp
class AccessDemo {
private:
    int private_member;      // 只有类内部可访问
    
protected:
    int protected_member;    // 类内部和派生类可访问
    
public:
    int public_member;       // 任何地方都可访问
    
    // 友元类可以访问私有成员
    friend class FriendClass;
    
    // 友元函数可以访问私有成员
    friend void friend_function(const AccessDemo& obj);
    
public:
    AccessDemo(int priv, int prot, int pub) 
        : private_member(priv), protected_member(prot), public_member(pub) {}
    
    // 公共接口提供对私有成员的控制访问
    int getPrivateMember() const { return private_member; }
    void setPrivateMember(int value) {
        if (value >= 0) {  // 添加验证逻辑
            private_member = value;
        }
    }
};

// 继承中的访问控制
class DerivedDemo : public AccessDemo {
public:
    DerivedDemo(int priv, int prot, int pub) : AccessDemo(priv, prot, pub) {}
    
    void testAccess() {
        // private_member = 10;    // 错误：无法访问私有成员
        protected_member = 20;     // 正确：可以访问保护成员
        public_member = 30;        // 正确：可以访问公共成员
    }
};
```

## 高级面向对象特性

### 🎯 **运算符重载**

#### **算术运算符重载**
```cpp
class Complex {
private:
    double real, imag;
    
public:
    Complex(double r = 0.0, double i = 0.0) : real(r), imag(i) {}
    
    // 成员函数形式的运算符重载
    Complex operator+(const Complex& other) const {
        return Complex(real + other.real, imag + other.imag);
    }
    
    Complex& operator+=(const Complex& other) {
        real += other.real;
        imag += other.imag;
        return *this;
    }
    
    // 前置递增
    Complex& operator++() {
        ++real;
        return *this;
    }
    
    // 后置递增
    Complex operator++(int) {
        Complex temp(*this);
        ++real;
        return temp;
    }
    
    // 比较运算符
    bool operator==(const Complex& other) const {
        return (real == other.real) && (imag == other.imag);
    }
    
    bool operator!=(const Complex& other) const {
        return !(*this == other);
    }
    
    // 类型转换运算符
    operator double() const {
        return std::sqrt(real * real + imag * imag);  // 模长
    }
    
    // 下标运算符
    double& operator[](int index) {
        return (index == 0) ? real : imag;
    }
    
    const double& operator[](int index) const {
        return (index == 0) ? real : imag;
    }
    
    // 友元函数形式的运算符重载
    friend Complex operator*(const Complex& a, const Complex& b);
    friend std::ostream& operator<<(std::ostream& os, const Complex& c);
    friend std::istream& operator>>(std::istream& is, Complex& c);
};

// 友元运算符实现
Complex operator*(const Complex& a, const Complex& b) {
    return Complex(a.real * b.real - a.imag * b.imag,
                   a.real * b.imag + a.imag * b.real);
}

std::ostream& operator<<(std::ostream& os, const Complex& c) {
    os << "(" << c.real;
    if (c.imag >= 0) os << "+";
    os << c.imag << "i)";
    return os;
}

std::istream& operator>>(std::istream& is, Complex& c) {
    is >> c.real >> c.imag;
    return is;
}
```

### 🎨 **设计模式实现**

#### **单例模式**
```cpp
class Singleton {
private:
    static std::unique_ptr<Singleton> instance;
    static std::once_flag initialized;
    
    // 私有构造函数
    Singleton() = default;
    
public:
    // 删除拷贝构造和赋值
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;
    
    static Singleton& getInstance() {
        std::call_once(initialized, []() {
            instance = std::unique_ptr<Singleton>(new Singleton());
        });
        return *instance;
    }
    
    void doSomething() {
        std::cout << "Singleton method called" << std::endl;
    }
};

// 静态成员定义
std::unique_ptr<Singleton> Singleton::instance = nullptr;
std::once_flag Singleton::initialized;
```

#### **工厂模式**
```cpp
// 抽象产品
class Animal {
public:
    virtual ~Animal() = default;
    virtual void makeSound() const = 0;
    virtual std::string getType() const = 0;
};

// 具体产品
class Dog : public Animal {
public:
    void makeSound() const override {
        std::cout << "Woof!" << std::endl;
    }
    
    std::string getType() const override {
        return "Dog";
    }
};

class Cat : public Animal {
public:
    void makeSound() const override {
        std::cout << "Meow!" << std::endl;
    }
    
    std::string getType() const override {
        return "Cat";
    }
};

// 工厂类
class AnimalFactory {
public:
    enum AnimalType { DOG, CAT };
    
    static std::unique_ptr<Animal> createAnimal(AnimalType type) {
        switch (type) {
            case DOG:
                return std::make_unique<Dog>();
            case CAT:
                return std::make_unique<Cat>();
            default:
                return nullptr;
        }
    }
    
    // 注册式工厂（更灵活）
    using CreatorFunc = std::function<std::unique_ptr<Animal>()>;
    static std::map<std::string, CreatorFunc> creators;
    
    template<typename T>
    static void registerCreator(const std::string& type) {
        creators[type] = []() { return std::make_unique<T>(); };
    }
    
    static std::unique_ptr<Animal> create(const std::string& type) {
        auto it = creators.find(type);
        if (it != creators.end()) {
            return it->second();
        }
        return nullptr;
    }
};

// 静态成员定义和注册
std::map<std::string, AnimalFactory::CreatorFunc> AnimalFactory::creators;

void register_animals() {
    AnimalFactory::registerCreator<Dog>("dog");
    AnimalFactory::registerCreator<Cat>("cat");
}
```

### 🔄 **RAII与智能指针**

#### **资源管理最佳实践**
```cpp
// RAII资源管理类
class FileManager {
private:
    std::FILE* file;
    std::string filename;
    
public:
    explicit FileManager(const std::string& fname, const char* mode = "r") 
        : filename(fname) {
        file = std::fopen(fname.c_str(), mode);
        if (!file) {
            throw std::runtime_error("Cannot open file: " + fname);
        }
    }
    
    ~FileManager() {
        if (file) {
            std::fclose(file);
        }
    }
    
    // 删除拷贝，允许移动
    FileManager(const FileManager&) = delete;
    FileManager& operator=(const FileManager&) = delete;
    
    FileManager(FileManager&& other) noexcept 
        : file(other.file), filename(std::move(other.filename)) {
        other.file = nullptr;
    }
    
    FileManager& operator=(FileManager&& other) noexcept {
        if (this != &other) {
            if (file) std::fclose(file);
            file = other.file;
            filename = std::move(other.filename);
            other.file = nullptr;
        }
        return *this;
    }
    
    std::FILE* get() const { return file; }
    
    bool isOpen() const { return file != nullptr; }
};

// 智能指针使用示例
class ResourceUser {
private:
    std::shared_ptr<int> shared_resource;
    std::unique_ptr<double[]> array_resource;
    std::weak_ptr<int> weak_reference;
    
public:
    ResourceUser(int size) {
        // shared_ptr：共享所有权
        shared_resource = std::make_shared<int>(42);
        
        // unique_ptr：独占所有权
        array_resource = std::make_unique<double[]>(size);
        
        // weak_ptr：不影响引用计数的观察者
        weak_reference = shared_resource;
    }
    
    void useResources() {
        // 检查weak_ptr是否有效
        if (auto locked = weak_reference.lock()) {
            std::cout << "Shared resource: " << *locked << std::endl;
        } else {
            std::cout << "Resource has been destroyed" << std::endl;
        }
        
        // 使用数组
        for (int i = 0; i < 10; ++i) {
            array_resource[i] = i * 1.5;
        }
    }
    
    std::shared_ptr<int> getSharedResource() {
        return shared_resource;  // 增加引用计数
    }
};
```

## 异常处理

### 🛡️ **异常安全编程**
```cpp
// 异常层次结构
class MyException : public std::exception {
private:
    std::string message;
    
public:
    explicit MyException(const std::string& msg) : message(msg) {}
    
    const char* what() const noexcept override {
        return message.c_str();
    }
};

class InvalidArgumentException : public MyException {
public:
    explicit InvalidArgumentException(const std::string& arg) 
        : MyException("Invalid argument: " + arg) {}
};

// 异常安全的类设计
class ExceptionSafeVector {
private:
    double* data;
    size_t size;
    size_t capacity;
    
public:
    explicit ExceptionSafeVector(size_t initial_capacity = 10) 
        : data(nullptr), size(0), capacity(initial_capacity) {
        data = new double[capacity];  // 可能抛出std::bad_alloc
    }
    
    ~ExceptionSafeVector() {
        delete[] data;
    }
    
    // 异常安全的拷贝构造函数
    ExceptionSafeVector(const ExceptionSafeVector& other) 
        : data(nullptr), size(other.size), capacity(other.capacity) {
        try {
            data = new double[capacity];
            std::copy(other.data, other.data + size, data);
        } catch (...) {
            delete[] data;
            throw;
        }
    }
    
    // 强异常安全的赋值运算符（copy-and-swap）
    ExceptionSafeVector& operator=(const ExceptionSafeVector& other) {
        if (this != &other) {
            ExceptionSafeVector temp(other);  // 可能抛出异常
            swap(temp);  // 不抛出异常的交换
        }
        return *this;
    }
    
    void push_back(double value) {
        if (size >= capacity) {
            resize();  // 可能抛出异常
        }
        data[size++] = value;  // 不抛出异常
    }
    
private:
    void swap(ExceptionSafeVector& other) noexcept {
        std::swap(data, other.data);
        std::swap(size, other.size);
        std::swap(capacity, other.capacity);
    }
    
    void resize() {
        size_t new_capacity = capacity * 2;
        double* new_data = new double[new_capacity];  // 可能抛出
        
        try {
            std::copy(data, data + size, new_data);
        } catch (...) {
            delete[] new_data;
            throw;
        }
        
        delete[] data;
        data = new_data;
        capacity = new_capacity;
    }
};
```

---
*面向对象编程：构建可维护、可扩展的软件系统*