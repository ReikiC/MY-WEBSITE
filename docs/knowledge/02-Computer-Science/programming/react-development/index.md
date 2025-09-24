---
sidebar_position: 3
---

# React 开发

React 是目前最受欢迎的前端框架之一，用于构建用户界面。

## 核心概念

### 组件
```jsx
// 函数式组件
function Welcome({ name }) {
    return <h1>欢迎, {name}!</h1>;
}

// 类组件（较少使用）
class Welcome extends React.Component {
    render() {
        return <h1>欢迎, {this.props.name}!</h1>;
    }
}
```

### Hooks
```jsx
import { useState, useEffect } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        document.title = `计数: ${count}`;
    }, [count]);
    
    return (
        <div>
            <p>当前计数: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                增加
            </button>
        </div>
    );
}
```

## 状态管理

### Context API
用于跨组件共享状态，避免 prop drilling。

### Redux/Zustand
适用于复杂应用的状态管理解决方案。

## 最佳实践

1. **组件拆分** - 保持组件小而专一
2. **Hooks 使用** - 优先使用函数式组件和 Hooks
3. **性能优化** - 使用 React.memo, useMemo, useCallback