# Index.html 对比工具模板规范

生成 `index.html` 时严格遵循此规范。

## 设计原则

1. **空间全给 cases** — 工具栏极窄（40-48px），剩余空间全部给 iframe
2. **全屏沉浸** — `html, body { height: 100%; overflow: hidden }`
3. **即时切换** — tab 点击和键盘操作零延迟
4. **最少 UI** — 不需要描述、说明文字、卡片列表，只要 tab + iframe

## 布局模式

### 单面板模式（1 个 cases 文件 或 同组件单风格）

```
┌─ toolbar ─────────────────────────────────┐
│ Logo  │ [Tab1] [Tab2] [Tab3]              │
├───────────────────────────────────────────┤
│                                           │
│            iframe (100%)                  │
│                                           │
└───────────────────────────────────────────┘
```

### 分屏对比模式（同组件多风格）

```
┌─ toolbar ──────────────────────────────────────────────┐
│ Logo  │ [Tab1] [Tab2] [Tab3]    ← STYLE_A  STYLE_B →  │
├────────────────────────┬───────────────────────────────┤
│                        │                               │
│   iframe (style A)     │     iframe (style B)          │
│                        │                               │
└────────────────────────┴───────────────────────────────┘
```

## 键盘快捷键（必须实现）

| 快捷键 | 功能 |
|--------|------|
| `1` - `9` | 切换到第 N 个组件 tab |
| `←` `→` | 上/下一个组件 |
| `F` | 全屏显示左侧面板 |
| `G` | 全屏显示右侧面板 |
| `Esc` | 恢复分屏 |

## 底部快捷键提示条

固定在底部，半透明，显示可用快捷键。高度 ≤ 32px。

```html
<div class="hint">
  <span><kbd>1</kbd>-<kbd>N</kbd> 切换组件</span>
  <span><kbd>←</kbd><kbd>→</kbd> 上/下一个</span>
  <span><kbd>F</kbd> 全屏左侧</span>
  <span><kbd>G</kbd> 全屏右侧</span>
  <span><kbd>Esc</kbd> 恢复并排</span>
</div>
```

## 自动生成逻辑

扫描 cases 目录中所有 `*-cases.html` 文件，按以下规则解析：

```
文件名格式: {component}[-{style}]-cases.html

例如:
  app-header-cases.html          → component: app-header,   style: default
  app-header-daisy-cases.html    → component: app-header,   style: daisy
  program-card-cases.html        → component: program-card,  style: default
  program-card-original-cases.html → component: program-card, style: original
```

### 分组规则

```python
components = {}
for file in cases_files:
    component, style = parse_filename(file)
    components.setdefault(component, []).append((style, file))

# 判断模式
has_multi_style = any(len(styles) > 1 for styles in components.values())
```

### Tab 生成

- 每个 component 一个 tab
- Tab 文字 = component 名（kebab-case → Title Case）
- 第一个 tab 默认 active

### 风格标签生成（分屏模式）

- 仅在 `has_multi_style` 时显示
- 左侧标签 = 第一个风格名（紫色背景）
- 右侧标签 = 第二个风格名（粉色背景）
- 如果某个组件只有一个风格 → 切换到该 tab 时隐藏分屏，显示单面板

## 样式规范

```css
:root {
  --bg: #0e0e1a;
  --surface: #1a1a2e;
  --border: #2e2e50;
  --text: #e0e0f0;
  --muted: #8888aa;
  --primary: #6c5ce7;
  --accent: #fd79a8;
}

/* 工具栏 */
.toolbar {
  height: 44px;        /* 极窄 */
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
}

/* Tab */
.tab {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.78rem;
  cursor: pointer;
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
}
.tab.active {
  background: var(--primary);
  color: #fff;
}

/* iframe 区域 */
.compare-area {
  flex: 1;
  display: grid;
  min-height: 0;
}

.compare-area iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* 分屏分隔线 */
.compare-area.split {
  grid-template-columns: 1fr 1fr;
}
.compare-area.split .pane-left {
  border-right: 2px solid var(--primary);
}
```

## 完整 HTML 骨架

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{Project Name} — Design Cases</title>
<style>
  /* 上述样式 */
</style>
</head>
<body>

<div class="toolbar">
  <span class="logo">{Project} Design</span>
  <div class="sep"></div>
  <div class="tabs">
    <!-- 动态生成 -->
  </div>
  <div class="style-labels">
    <!-- 分屏时显示 -->
  </div>
</div>

<div class="compare-area" id="compare">
  <div class="pane-left"><iframe id="frame-left"></iframe></div>
  <div class="pane-right"><iframe id="frame-right"></iframe></div>
</div>

<div class="hint"><!-- 快捷键 --></div>

<script>
  // 组件和文件映射（自动生成）
  const components = {
    'component-name': {
      styles: [
        { name: 'original', file: 'component-original-cases.html' },
        { name: 'daisy',    file: 'component-daisy-cases.html' }
      ]
    },
    // ...
  };

  // tab 切换、键盘快捷键、全屏切换逻辑
</script>

</body>
</html>
```
