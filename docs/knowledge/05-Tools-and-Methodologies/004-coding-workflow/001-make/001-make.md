
## Makefile 项目规范解析

### 📋 **Makefile 基础结构**

```makefile
target: dependencies
	command
```

- `target` - 目标任务名（执行 `make target`）
- `dependencies` - 依赖的其他 target
- `command` - 执行的命令（必须用 Tab 缩进）

---

### 🎯 **项目规范化的关键部分**

#### **1. 声明规范目标 (`.PHONY`)**

```makefile
.PHONY: all format lint test tests test_watch integration_tests docker_tests help extended_tests
```

**作用**：告诉 Make 这些是"虚拟目标"，不是实际文件
- 防止冲突（如存在 `format` 文件不会影响 `make format`）
- 确保每次都执行，不被缓存

---

#### **2. 默认目标**

```makefile
all: help
```

当你运行 `make` 时，默认执行 `help` 目标，显示可用命令

---

### 🧪 **测试规范**

#### **定义测试路径**

```makefile
TEST_FILE ?= tests/unit_tests/
```

- `?=` - "如果未定义，则设置为这个值"
- 允许外部覆盖：`make test TEST_FILE=tests/integration_tests/`

#### **三种测试方式**

```makefile
# 1. 基础测试
test:
	uv run pytest $(TEST_FILE)

# 2. 监视模式（自动重新运行）
test_watch:
	uv run ptw --snapshot-update --now . -- -vv tests/unit_tests

# 3. 性能分析
test_profile:
	uv run pytest -vv tests/unit_tests/ --profile-svg

# 4. 扩展测试
extended_tests:
	uv run pytest --only-extended $(TEST_FILE)
```

---

### 🎨 **代码质量规范**

#### **变量定义：哪些文件需要检查**

```makefile
PYTHON_FILES=src/                          # 默认只检查 src/ 目录

lint format: PYTHON_FILES=.                # lint/format 时检查所有文件
lint_diff format_diff: PYTHON_FILES=$(shell git diff --name-only --diff-filter=d main | grep -E '\.py$$|\.ipynb$$')
                                           # 只检查 git diff 的文件
lint_package: PYTHON_FILES=src             # 只检查包代码
lint_tests: PYTHON_FILES=tests             # 只检查测试代码
lint_tests: MYPY_CACHE=.mypy_cache_test    # 使用独立缓存
```

**策略**：
- **开发时** (`lint_diff`) - 只检查改动的代码（快速反馈）
- **提交前** (`lint`) - 检查整个项目
- **包质量** (`lint_package`) - 重点检查源代码

#### **格式化**

```makefile
format format_diff:
	uv run ruff format $(PYTHON_FILES)
	uv run ruff check --select I --fix $(PYTHON_FILES)
```

执行两步：
1. **ruff format** - 自动修复代码格式
2. **ruff check --fix** - 自动修复导入顺序

#### **Linting**

```makefile
lint lint_diff lint_package lint_tests:
	uv run ruff check .                    # 检查代码质量
	[ "$(PYTHON_FILES)" = "" ] || uv run ruff format $(PYTHON_FILES) --diff
	[ "$(PYTHON_FILES)" = "" ] || uv run ruff check --select I $(PYTHON_FILES)
	[ "$(PYTHON_FILES)" = "" ] || uv run mypy --strict $(PYTHON_FILES)
	[ "$(PYTHON_FILES)" = "" ] || mkdir -p $(MYPY_CACHE) && uv run mypy --strict $(PYTHON_FILES) --cache-dir $(MYPY_CACHE)
```

**4 层检查**：
1. **ruff check** - 代码风格和错误检查
2. **ruff format --diff** - 显示格式问题
3. **ruff check -I** - 检查导入格式
4. **mypy --strict** - 类型检查

**`[ "$(PYTHON_FILES)" = "" ] ||`** - 如果 PYTHON_FILES 为空，跳过此步骤

---

#### **拼写检查**

```makefile
spell_check:
	codespell --toml pyproject.toml

spell_fix:
	codespell --toml pyproject.toml -w
```

- `--toml` - 使用 pyproject.toml 中的配置
- `-w` - write，自动修复拼写错误

---

### 📊 **完整流程示意**

```
make lint          ← 完整检查
├─ ruff check .              (所有文件代码质量)
├─ ruff format --diff        (所有文件格式)
├─ ruff check -I             (所有文件导入)
└─ mypy --strict             (所有文件类型检查)

make lint_diff     ← 增量检查（快速）
├─ ruff check .
└─ mypy --strict $(git diff files)  (只检查改动部分)

make format        ← 自动修复
├─ ruff format src/
└─ ruff check -I --fix src/

make test          ← 单元测试
└─ pytest tests/unit_tests/

make test_watch    ← 持续测试
└─ ptw (监视文件变化自动运行)
```

---

### 🔧 **实际使用场景**

| 场景 | 命令 | 作用 |
|------|------|------|
| 开发中修改了代码 | `make lint_diff` | 快速检查改动部分 |
| 提交前检查 | `make lint` | 全面检查整个项目 |
| 自动修复格式 | `make format` | 自动修复代码风格 |
| 开发和测试 | `make test_watch` | 代码变化时自动运行测试 |
| 检查拼写 | `make spell_check` | 检查文档拼写 |
| 查看可用命令 | `make help` | 显示所有可用命令 |

---

### 💡 **设计思想**

这个 Makefile 规定了：

#### **1. 开发流程规范**
```
写代码 → 本地测试 (make test_watch)
    ↓
提交前检查 (make lint, make format)
    ↓
所有测试通过 (make test)
    ↓
提交代码
```

#### **2. 代码质量保证**
- 强制所有代码通过 ruff + mypy 检查
- 导入自动排序（isort）
- 类型注解强制检查（mypy --strict）

#### **3. 灵活的检查策略**
- 开发时：快速增量检查 (`lint_diff`)
- 提交时：全面检查 (`lint`)
- 特定部分：专项检查 (`lint_package`, `lint_tests`)

#### **4. 自动化**
- 自动格式化 (`make format`)
- 自动修复导入 (`ruff check -I --fix`)
- 自动修复拼写 (`make spell_fix`)

---

### 📝 **实际执行示例**

```bash
# 1. 查看可用命令
$ make help
----
format                       - run code formatters
lint                         - run linters
test                         - run unit tests
...

# 2. 开发时检查改动的文件（快速）
$ make lint_diff
✓ Passed ruff check
✓ Passed mypy check on modified files

# 3. 自动修复代码风格
$ make format
Formatted 5 files
Fixed 3 import issues

# 4. 运行测试并监视文件
$ make test_watch
Tests passed ✓
Waiting for file changes...

# 5. 提交前全量检查
$ make lint
✓ All checks passed
```

这就是**用 Makefile 规范项目**的方式 - 通过统一的命令接口，强制执行一套完整的代码质量和测试流程！