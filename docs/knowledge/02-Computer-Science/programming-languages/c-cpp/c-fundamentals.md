---
sidebar_position: 2
---

# C语言基础与进阶

C语言作为系统编程的基石，其简洁而强大的特性使其在嵌入式和系统开发中不可替代。

## 核心语法深入

### 🎯 **数据类型与存储**

#### **基本数据类型**
```c
// 整型变量大小（依赖于平台）
printf("char: %zu bytes\n", sizeof(char));        // 1字节
printf("short: %zu bytes\n", sizeof(short));      // 2字节  
printf("int: %zu bytes\n", sizeof(int));          // 4字节
printf("long: %zu bytes\n", sizeof(long));        // 4/8字节
printf("long long: %zu bytes\n", sizeof(long long)); // 8字节

// 浮点型精度
float f = 3.14159265359f;     // 单精度，约7位有效数字
double d = 3.14159265359;     // 双精度，约15位有效数字
long double ld = 3.14159265359L; // 扩展精度
```

#### **类型修饰符**
```c
// 存储类说明符
static int static_var = 0;        // 静态存储期
extern int global_var;            // 外部链接
register int fast_var;            // 建议存放在寄存器
auto int local_var = 10;          // 自动存储期（默认）

// 类型限定符
const int readonly = 100;         // 只读
volatile int hardware_reg;        // 易变的（防止编译器优化）
restrict char* ptr;               // 受限指针（C99）
```

### 🔗 **指针高级用法**

#### **多级指针**
```c
int value = 42;
int *ptr1 = &value;               // 一级指针
int **ptr2 = &ptr1;               // 二级指针
int ***ptr3 = &ptr2;              // 三级指针

// 访问值
printf("value = %d\n", ***ptr3);  // 通过三级指针访问

// 指针数组 vs 数组指针
int *ptr_array[10];               // 指针数组：10个int*指针的数组
int (*array_ptr)[10];             // 数组指针：指向10个int数组的指针
```

#### **函数指针**
```c
// 函数指针定义
int add(int a, int b) { return a + b; }
int multiply(int a, int b) { return a * b; }

int (*operation)(int, int);       // 函数指针声明

// 函数指针使用
operation = add;
int result1 = operation(5, 3);    // 调用add函数

operation = multiply;
int result2 = operation(5, 3);    // 调用multiply函数

// 函数指针数组
int (*operations[])(int, int) = {add, multiply};
int result3 = operations[0](10, 5); // 调用add
```

### 🏗️ **结构体与联合体深入**

#### **结构体内存布局**
```c
// 内存对齐示例
struct Example1 {
    char a;      // 1字节
    int b;       // 4字节，但可能从地址4开始
    char c;      // 1字节
}; // 实际大小可能是12字节（而不是6字节）

// 使用#pragma pack控制对齐
#pragma pack(1)
struct Packed {
    char a;
    int b;
    char c;
}; // 实际大小：6字节
#pragma pack()

// 计算结构体偏移
#include <stddef.h>
printf("Offset of b: %zu\n", offsetof(struct Example1, b));
```

#### **位域（Bit Fields）**
```c
// 位域定义（节省内存）
struct StatusRegister {
    unsigned int flag1 : 1;       // 1位
    unsigned int flag2 : 1;       // 1位
    unsigned int counter : 6;     // 6位
    unsigned int mode : 2;        // 2位
    unsigned int reserved : 6;    // 6位保留
}; // 总共16位，2字节

// 位域使用
struct StatusRegister reg = {0};
reg.flag1 = 1;
reg.counter = 63;
reg.mode = 2;
```

## 内存管理详解

### 💾 **动态内存分配**

#### **malloc系列函数**
```c
#include <stdlib.h>

// 基本分配
int *arr = malloc(sizeof(int) * 10);
if (arr == NULL) {
    fprintf(stderr, "Memory allocation failed\n");
    exit(1);
}

// calloc：分配并初始化为0
int *zero_arr = calloc(10, sizeof(int));

// realloc：重新分配大小
arr = realloc(arr, sizeof(int) * 20);
if (arr == NULL) {
    // 处理分配失败
}

// 释放内存
free(arr);
free(zero_arr);
arr = NULL;  // 防止悬空指针
zero_arr = NULL;
```

#### **内存错误检测**
```c
// 常见内存错误
void memory_errors_demo() {
    int *ptr = malloc(sizeof(int) * 10);
    
    // 1. 内存泄漏
    // free(ptr);  // 忘记释放
    
    // 2. 重复释放
    free(ptr);
    // free(ptr);  // 错误：重复释放
    
    // 3. 访问已释放内存
    ptr = malloc(sizeof(int));
    free(ptr);
    // *ptr = 42;  // 错误：访问已释放内存
    
    // 4. 缓冲区溢出
    char buffer[10];
    // strcpy(buffer, "This string is too long");  // 溢出
}
```

### 🔒 **内存池技术**
```c
// 简单内存池实现
typedef struct MemoryPool {
    void *memory;
    size_t total_size;
    size_t used_size;
    size_t block_size;
} MemoryPool;

MemoryPool* create_pool(size_t pool_size, size_t block_size) {
    MemoryPool *pool = malloc(sizeof(MemoryPool));
    if (!pool) return NULL;
    
    pool->memory = malloc(pool_size);
    if (!pool->memory) {
        free(pool);
        return NULL;
    }
    
    pool->total_size = pool_size;
    pool->used_size = 0;
    pool->block_size = block_size;
    return pool;
}

void* pool_alloc(MemoryPool *pool) {
    if (pool->used_size + pool->block_size > pool->total_size) {
        return NULL;  // 池已满
    }
    
    void *ptr = (char*)pool->memory + pool->used_size;
    pool->used_size += pool->block_size;
    return ptr;
}
```

## 高级特性

### 📋 **宏与预处理器**

#### **宏定义技巧**
```c
// 多行宏定义
#define SWAP(a, b) do { \
    typeof(a) temp = (a); \
    (a) = (b); \
    (b) = temp; \
} while(0)

// 可变参数宏
#define DEBUG_PRINT(fmt, ...) \
    fprintf(stderr, "[DEBUG] " fmt "\n", ##__VA_ARGS__)

// 字符串化和连接
#define STRINGIFY(x) #x
#define CONCAT(a, b) a##b

// 使用示例
DEBUG_PRINT("Value: %d", 42);
printf("%s\n", STRINGIFY(Hello World));  // 输出: Hello World
int CONCAT(var, 1) = 10;  // 等价于: int var1 = 10;
```

#### **条件编译**
```c
// 调试版本控制
#ifdef DEBUG
    #define DBG_MSG(msg) printf("DEBUG: %s\n", msg)
#else
    #define DBG_MSG(msg)
#endif

// 平台相关代码
#ifdef _WIN32
    #include <windows.h>
    #define SLEEP(ms) Sleep(ms)
#elif defined(__linux__)
    #include <unistd.h>
    #define SLEEP(ms) usleep((ms) * 1000)
#endif

// 编译时断言（C11）
_Static_assert(sizeof(int) == 4, "int must be 4 bytes");
```

### 🔄 **变长数组（VLA）**
```c
// C99变长数组
void matrix_multiply(int n, int m, int k, 
                    int a[n][m], int b[m][k], int result[n][k]) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < k; j++) {
            result[i][j] = 0;
            for (int l = 0; l < m; l++) {
                result[i][j] += a[i][l] * b[l][j];
            }
        }
    }
}

// 动态分配的VLA
void process_array(int size) {
    int array[size];  // VLA在栈上分配
    
    // 初始化和使用
    for (int i = 0; i < size; i++) {
        array[i] = i * i;
    }
} // array自动释放
```

## 性能优化

### ⚡ **编译器优化**
```c
// 内联函数（C99）
static inline int max(int a, int b) {
    return (a > b) ? a : b;
}

// 分支预测提示（GCC）
#define likely(x)   __builtin_expect(!!(x), 1)
#define unlikely(x) __builtin_expect(!!(x), 0)

if (likely(condition)) {
    // 经常执行的分支
} else {
    // 很少执行的分支
}

// 循环展开
void optimized_copy(int *dest, const int *src, int count) {
    int i;
    // 循环展开4倍
    for (i = 0; i < count - 3; i += 4) {
        dest[i] = src[i];
        dest[i+1] = src[i+1];
        dest[i+2] = src[i+2];
        dest[i+3] = src[i+3];
    }
    
    // 处理剩余元素
    for (; i < count; i++) {
        dest[i] = src[i];
    }
}
```

### 🔧 **数据结构优化**
```c
// 缓存友好的数据结构
typedef struct {
    // 将经常一起访问的数据放在一起
    int x, y, z;        // 12字节，一个缓存行
    int padding;        // 对齐到16字节
} Point3D;

// 数组vs链表性能比较
void array_vs_list_performance() {
    const int N = 1000000;
    
    // 数组：缓存友好，顺序访问快
    int *array = malloc(sizeof(int) * N);
    clock_t start = clock();
    for (int i = 0; i < N; i++) {
        array[i] = i;  // 顺序写入，缓存命中率高
    }
    clock_t end = clock();
    printf("Array time: %f\n", (double)(end - start) / CLOCKS_PER_SEC);
    
    free(array);
}
```

## 调试与测试

### 🐛 **调试技巧**
```c
// 断言使用
#include <assert.h>

void safe_divide(int a, int b, int *result) {
    assert(b != 0);  // 运行时检查
    assert(result != NULL);
    
    *result = a / b;
}

// 自定义断言宏
#ifdef DEBUG
#define ASSERT(cond, msg) do { \
    if (!(cond)) { \
        fprintf(stderr, "Assertion failed: %s at %s:%d\n", \
                msg, __FILE__, __LINE__); \
        abort(); \
    } \
} while(0)
#else
#define ASSERT(cond, msg)
#endif
```

### 🧪 **单元测试框架**
```c
// 简单的测试框架
#define TEST(name) void test_##name()
#define ASSERT_EQ(expected, actual) do { \
    if ((expected) != (actual)) { \
        printf("FAIL: %s - Expected %d, got %d\n", \
               #name, expected, actual); \
        return; \
    } \
    printf("PASS: %s\n", #name); \
} while(0)

// 测试用例
TEST(addition) {
    ASSERT_EQ(5, add(2, 3));
    ASSERT_EQ(0, add(-1, 1));
}

// 测试运行器
int main() {
    test_addition();
    return 0;
}
```

---
*掌握C语言的精髓，为系统编程奠定坚实基础*