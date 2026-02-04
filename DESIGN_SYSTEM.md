# 设计系统主文件

> **逻辑：** 构建特定页面时，请首先检查 `design-system/pages/[page-name].md`。
> 如果该文件存在，其规则将**覆盖**此主文件。
> 如果不存在，请严格遵循以下规则。

---

**项目:** 商业全智能 (CZBank Commercial Intelligence)
**生成时间:** 2026-02-04 09:17:42
**类别:** 金融仪表盘

---

## 全局规则

### 调色板

| 角色                     | 十六进制    | CSS 变量               |
| ------------------------ | ----------- | ---------------------- |
| 主色 (Primary)           | `#0F172A` | `--color-primary`    |
| 次色 (Secondary)         | `#334155` | `--color-secondary`  |
| 强调/行动色 (CTA/Accent) | `#0369A1` | `--color-cta`        |
| 背景色 (Background)      | `#F8FAFC` | `--color-background` |
| 文本色 (Text)            | `#020617` | `--color-text`       |

**颜色说明:** 高对比度海军蓝 + 蓝色

### 排版 (Typography)

- **标题字体:** IBM Plex Sans
- **正文字体:** IBM Plex Sans
- **基调:** 金融、值得信赖、专业、企业级、银行、严肃
- **Google Fonts:** [IBM Plex Sans + IBM Plex Sans](https://fonts.google.com/share?selection.family=IBM+Plex+Sans:wght@300;400;500;600;700)

**CSS 引入:**

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
```

### 间距变量 (Spacing Variables)

| 标记 (Token)    | 值                    | 用法               |
| --------------- | --------------------- | ------------------ |
| `--space-xs`  | `4px` / `0.25rem` | 紧凑间隙           |
| `--space-sm`  | `8px` / `0.5rem`  | 图标间隙，行内间距 |
| `--space-md`  | `16px` / `1rem`   | 标准内边距         |
| `--space-lg`  | `24px` / `1.5rem` | 区块内边距         |
| `--space-xl`  | `32px` / `2rem`   | 大间隙             |
| `--space-2xl` | `48px` / `3rem`   | 区块外边距         |
| `--space-3xl` | `64px` / `4rem`   | 首屏 (Hero) 内边距 |

### 阴影深度 (Shadow Depths)

| 级别            | 值                               | 用法               |
| --------------- | -------------------------------- | ------------------ |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)`   | 微弱浮起           |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)`    | 卡片，按钮         |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)`  | 模态框，下拉菜单   |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | 首屏图片，精选卡片 |

---

## 组件规范 (Component Specs)

### 按钮 (Buttons)

```css
/* 主按钮 */
.btn-primary {
  background: #0369A1;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* 次要按钮 */
.btn-secondary {
  background: transparent;
  color: #0F172A;
  border: 2px solid #0F172A;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### 卡片 (Cards)

```css
.card {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### 输入框 (Inputs)

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #0F172A;
  outline: none;
  box-shadow: 0 0 0 3px #0F172A20;
}
```

### 模态框 (Modals)

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## 风格指南 (Style Guidelines)

**风格:** 深色模式 (OLED Dark Mode)

**关键词:** 深色主题, 低光环境, 高对比度, 深邃黑, 午夜蓝, 护眼, OLED, 夜间模式, 节能

**适用场景:** 夜间模式应用, 编程平台, 娱乐应用, 防止视疲劳, OLED 设备, 低光环境

**关键效果:** 极简发光 (text-shadow: 0 0 10px), 深浅过渡, 低白光发射, 高可读性, 可见焦点

### 页面模式 (Page Pattern)

**模式名称:** 水平滚动旅程 (Horizontal Scroll Journey)

- **转化策略:** 沉浸式产品探索。高参与度。保持导航可见。

  - **Bento 网格展示:** 1. 首屏 (Hero), 2. Bento 网格 (核心功能), 3. 详情卡片, 4. 技术规格, 5. CTA。浮动操作按钮或网格底部。卡片背景: #F5F5F7 或磨砂玻璃。图标: 鲜艳品牌色。文本: 深色。悬停卡片缩放 (1.02), 卡片内视频, 倾斜效果, 交错显示, 可扫描的价值主张。高信息密度而不杂乱。移动端堆叠。
  - **交互式 3D 配置器:** 1. 首屏 (配置器), 2. 功能高亮 (同步), 3. 价格/规格, 4. 购买。配置器 UI 内嵌 + 底部固定栏。中性摄影棚背景。产品: 逼真材质。UI: 极简覆盖层。实时渲染, 材质切换动画, 相机旋转/缩放, 光线反射。增加拥有感。360度视图降低退货率。直接添加到购物车。
  - **AI 驱动动态着陆页:** 1. 提示词/输入首屏, 2. 生成结果预览, 3. 工作原理, 4. 价值主张。输入框 (首屏) + '试一试' 按钮。适应用户输入。深色模式营造计算感。霓虹点缀。打字机文字效果, 闪烁生成加载器, 变形布局。即时价值演示。“展示，而非讲述”。低摩擦启动。
- **CTA 位置:** 浮动固定 CTA 或水平轨道末端
- **区块顺序:** 1. 简介 (垂直), 2. 旅程 (水平轨道), 3. 详情展示, 4. 垂直页脚

---

## 反模式 (禁止使用)

- ❌ 默认浅色模式 (Light mode default)
- ❌ 渲染缓慢 (Slow rendering)

### 额外禁止的模式

- ❌ **使用 Emoji 作为图标** — 请使用 SVG 图标 (Heroicons, Lucide, Simple Icons)
- ❌ **缺少 cursor:pointer** — 所有可点击元素必须有 cursor:pointer
- ❌ **布局偏移的悬停效果** — 避免使用会改变布局的缩放变换
- ❌ **低对比度文本** — 保持至少 4.5:1 的对比度
- ❌ **瞬间状态变化** — 始终使用过渡效果 (150-300ms)
- ❌ **不可见的焦点状态** — 焦点状态必须对键盘导航可见

---

## 交付前检查清单 (Pre-Delivery Checklist)

在交付任何 UI 代码之前，请验证：

- [ ] 不使用 Emoji 作为图标 (使用 SVG 代替)
- [ ] 所有图标来自一致的图标集 (Heroicons/Lucide)
- [ ] 所有可点击元素都有 `cursor:pointer`
- [ ] 悬停状态具有平滑过渡 (150-300ms)
- [ ] 浅色模式：文本对比度至少 4.5:1
- [ ] 焦点状态对键盘导航可见
- [ ] 尊重 `prefers-reduced-motion` 设置
- [ ] 响应式适配: 375px, 768px, 1024px, 1440px
- [ ] 没有内容被固定导航栏遮挡
- [ ] 移动端无水平滚动
