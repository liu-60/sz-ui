# SZ UI

SZ UI 是一个轻量 React + TypeScript 组件库示例，使用 webpack 打包，ESLint 做代码规范，基于 milligram 提供基础样式。当前组件库包含 `Modal` 弹框和 `Message` 消息框。

## 安装

```bash
npm install @liuling/sz-ui react react-dom
```

在应用入口引入样式：

```ts
import '@liuling/sz-ui/dist/style.css';
```

## 使用

```tsx
import { useState } from 'react';
import { Modal } from '@liuling/sz-ui';
import '@liuling/sz-ui/dist/style.css';

export function Demo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Modal
        open={open}
        title="发布确认"
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <p>确认发布当前版本？</p>
      </Modal>
    </>
  );
}
```

## Modal 参数

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `open` | `boolean` | - | 控制弹窗显示状态 |
| `title` | `ReactNode` | - | 弹窗标题 |
| `children` | `ReactNode` | - | 弹窗内容 |
| `footer` | `ReactNode \| null` | 默认按钮 | 自定义底部，传入 `null` 隐藏 |
| `okText` | `ReactNode` | `确定` | 确认按钮文案 |
| `cancelText` | `ReactNode` | `取消` | 取消按钮文案 |
| `onOk` | `() => void \| Promise<void>` | - | 点击确认触发，返回 Promise 时显示加载态 |
| `onCancel` | `() => void` | - | 点击取消、关闭、遮罩或 Esc 触发 |
| `afterOpenChange` | `(open: boolean) => void` | - | 显示状态变化后触发 |
| `confirmLoading` | `boolean` | `false` | 确认按钮加载态 |
| `maskClosable` | `boolean` | `true` | 点击遮罩是否关闭 |
| `keyboard` | `boolean` | `true` | 是否允许 Esc 关闭 |
| `centered` | `boolean` | `false` | 是否垂直居中 |
| `destroyOnClose` | `boolean` | `false` | 关闭后是否销毁子元素 |
| `width` | `number \| string` | `520` | 弹窗宽度，数字按 px 处理 |
| `getContainer` | `HTMLElement \| () => HTMLElement \| false` | `document.body` | 指定 portal 容器 |

## Message 使用

```tsx
import { Message } from '@liuling/sz-ui';
import '@liuling/sz-ui/dist/style.css';

export function Notice() {
  return (
    <Message type="success" title="操作成功">
      当前配置已保存，可以继续下一步。
    </Message>
  );
}
```

## Message 参数

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | `info` | 消息语义类型 |
| `title` | `ReactNode` | - | 消息标题 |
| `children` | `ReactNode` | - | 消息正文内容 |
| `closable` | `boolean` | `false` | 是否展示关闭按钮 |
| `onClose` | `() => void` | - | 点击关闭按钮时触发 |
| `className` | `string` | - | 自定义类名 |

## 方法说明

`Modal` 是受控组件，不内置全局静态方法。推荐用业务层状态控制 `open`，并通过 `onOk`、`onCancel` 串联流程。若需要 `Modal.confirm` 风格能力，可以在应用层基于该组件封装 promise helper。

## 本地开发

```bash
npm install
npm run dev
npm run build
```

## 版本管理与 npm 发布

项目遵循 SemVer：

- `patch`：bug 修复、文档修正、内部优化。
- `minor`：向后兼容的新能力或新组件。
- `major`：破坏性 API 或行为调整。

发布前更新 `CHANGELOG.md`，运行 `npm run build`，确认 `dist` 与 `dist-docs` 构建成功，然后执行：

```bash
npm run release:patch
npm run release:minor
npm run release:major
```

## Vercel 部署

Vercel 配置在 `vercel.json` 中：

- Build Command: `npm run build:docs`
- Output Directory: `dist-docs`

将仓库导入 Vercel 后即可用文档站方式展示安装方式、使用方式、参数说明、方法说明和演示。
