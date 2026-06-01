import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Message } from '../src/components/Message';
import { Modal } from '../src/components/Modal';
import '../src/styles.css';
import './styles.css';

const modalPropsRows = [
  ['open', 'boolean', '-', '控制弹窗显示状态。'],
  ['title', 'ReactNode', '-', '弹窗标题。'],
  ['children', 'ReactNode', '-', '弹窗主体内容。'],
  ['footer', 'ReactNode | null', '默认按钮', '自定义底部区域，传入 null 可隐藏。'],
  ['onOk', '() => void | Promise<void>', '-', '点击确认按钮时触发；返回 Promise 时按钮进入加载态。'],
  ['onCancel', '() => void', '-', '点击取消、关闭图标、遮罩或 Esc 时触发。'],
  ['confirmLoading', 'boolean', 'false', '外部控制确认按钮加载态。'],
  ['maskClosable', 'boolean', 'true', '点击遮罩是否关闭。'],
  ['keyboard', 'boolean', 'true', '是否允许 Esc 关闭。'],
  ['centered', 'boolean', 'false', '弹窗是否垂直居中。'],
  ['destroyOnClose', 'boolean', 'false', '关闭后是否销毁子元素。'],
  ['width', 'number | string', '520', '弹窗宽度，数字按 px 处理。']
];

const messagePropsRows = [
  ['type', "'info' | 'success' | 'warning' | 'error'", 'info', '消息语义类型。'],
  ['title', 'ReactNode', '-', '消息标题。'],
  ['children', 'ReactNode', '-', '消息正文内容。'],
  ['closable', 'boolean', 'false', '是否展示关闭按钮。'],
  ['onClose', '() => void', '-', '点击关闭按钮时触发。'],
  ['className', 'string', '-', '自定义类名。']
];

function PropsTable({ rows }: { rows: string[][] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>参数</th>
            <th>类型</th>
            <th>默认值</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, type, defaultValue, description]) => (
            <tr key={name}>
              <td>
                <code>{name}</code>
              </td>
              <td>{type}</td>
              <td>{defaultValue}</td>
              <td>{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [asyncOpen, setAsyncOpen] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(true);

  return (
    <main className="doc-shell">
      <aside className="doc-nav" aria-label="文档导航">
        <div className="brand-row">
          <div className="brand-mark">SZ</div>
          <strong>SZ UI</strong>
        </div>
        <a href="#overview">项目介绍</a>
        <a href="#install">安装</a>
        <a href="#components">组件总览</a>
        <a href="#modal">Modal</a>
        <a href="#message">Message</a>
        <a href="#release">版本发布</a>
      </aside>

      <section className="doc-content">
        <section id="overview" className="intro-band">
          <div className="intro-copy-wrap">
            <p className="eyebrow">React · TypeScript · Webpack · Milligram</p>
            <h1>SZ UI</h1>
            <p className="intro-copy">
              面向中后台和轻量业务系统的 React 组件库。当前包含 Modal 弹框和 Message 消息框，保持 API
              简洁、样式克制、构建产物小，适合通过 npm 分发并用 Vercel 承载文档。
            </p>
            <div className="intro-actions">
              <button type="button" onClick={() => setBasicOpen(true)}>
                预览 Modal
              </button>
              <a className="button button-outline" href="#message">
                查看 Message
              </a>
            </div>
          </div>
          <div className="hero-panel" aria-hidden="true">
            <div className="hero-modal-preview">
              <span />
              <b />
              <i />
              <em />
            </div>
            <div className="hero-message-preview">
              <span>i</span>
              <b />
              <i />
            </div>
          </div>
        </section>

        <section id="install" className="doc-section">
          <div className="section-heading">
            <p className="section-kicker">Getting Started</p>
            <h2>安装与使用</h2>
          </div>
          <div className="split-grid">
            <div>
              <h3>安装包</h3>
              <pre>
                <code>{`npm install @liuling/sz-ui react react-dom`}</code>
              </pre>
            </div>
            <div>
              <h3>引入样式</h3>
              <pre>
                <code>{`import '@liuling/sz-ui/dist/style.css';`}</code>
              </pre>
            </div>
          </div>
        </section>

        <section id="components" className="doc-section">
          <div className="section-heading">
            <p className="section-kicker">Components</p>
            <h2>组件总览</h2>
          </div>
          <div className="component-grid">
            <article className="component-card">
              <div>
                <p className="component-tag">Feedback</p>
                <h3>Modal 弹框</h3>
                <p>适合确认、表单、流程阻断场景，支持异步确认、遮罩关闭、Esc 关闭和自定义底部。</p>
              </div>
              <button type="button" onClick={() => setBasicOpen(true)}>
                打开演示
              </button>
            </article>
            <article className="component-card">
              <div>
                <p className="component-tag">Notice</p>
                <h3>Message 消息框</h3>
                <p>用于展示轻量状态反馈，支持 info、success、warning、error 四种语义样式。</p>
              </div>
              <a className="button button-outline" href="#message">
                查看文档
              </a>
            </article>
          </div>
        </section>

        <section id="modal" className="doc-section component-doc">
          <div className="section-heading">
            <p className="section-kicker">Component</p>
            <h2>Modal 弹框</h2>
          </div>
          <div className="split-grid">
            <div className="demo-panel">
              <h3>基础与异步确认</h3>
              <p>返回 Promise 时确认按钮会进入加载态，适合保存、发布、删除等需要等待接口返回的流程。</p>
              <div className="button-row">
                <button type="button" onClick={() => setBasicOpen(true)}>
                  基础弹框
                </button>
                <button type="button" className="button-outline" onClick={() => setAsyncOpen(true)}>
                  异步确认
                </button>
              </div>
            </div>
            <pre>
              <code>{`import { Modal } from '@liuling/sz-ui';

<Modal
  open={open}
  title="发布确认"
  onOk={() => setOpen(false)}
  onCancel={() => setOpen(false)}
>
  <p>确认发布当前版本？</p>
</Modal>`}</code>
            </pre>
          </div>
          <h3>参数说明</h3>
          <PropsTable rows={modalPropsRows} />
        </section>

        <section id="message" className="doc-section component-doc">
          <div className="section-heading">
            <p className="section-kicker">Component</p>
            <h2>Message 消息框</h2>
          </div>
          <div className="split-grid">
            <div className="message-stack">
              <Message type="info" title="信息提示">
                用于普通说明和辅助反馈。
              </Message>
              <Message type="success" title="操作成功">
                当前配置已保存，可以继续下一步。
              </Message>
              <Message type="warning" title="需要注意">
                发布前请确认版本号和变更日志。
              </Message>
              {noticeVisible ? (
                <Message type="error" title="发布失败" closable onClose={() => setNoticeVisible(false)}>
                  npm 登录过期，请重新认证后再试。
                </Message>
              ) : null}
            </div>
            <pre>
              <code>{`import { Message } from '@liuling/sz-ui';

<Message type="success" title="操作成功">
  当前配置已保存，可以继续下一步。
</Message>

<Message type="error" title="发布失败" closable>
  npm 登录过期，请重新认证后再试。
</Message>`}</code>
            </pre>
          </div>
          <h3>参数说明</h3>
          <PropsTable rows={messagePropsRows} />
        </section>

        <section id="release" className="doc-section">
          <div className="section-heading">
            <p className="section-kicker">Release</p>
            <h2>版本管理与发布</h2>
          </div>
          <ol>
            <li>遵循 SemVer：修复问题升 patch，兼容新增能力升 minor，破坏性变更升 major。</li>
            <li>每次发布前更新 CHANGELOG，并运行 npm run build 验证类型、规范、组件库和文档构建。</li>
            <li>npm 公网发布使用 npm publish --access public。</li>
            <li>Vercel 使用 npm run build:docs 构建静态文档，输出目录为 dist-docs。</li>
          </ol>
        </section>
      </section>

      <Modal open={basicOpen} title="基础弹窗" centered onOk={() => setBasicOpen(false)} onCancel={() => setBasicOpen(false)}>
        <p>SZ UI Modal 使用 milligram 的基础按钮和排版风格，并补充了弹窗布局、遮罩和动效。</p>
      </Modal>

      <Modal
        open={asyncOpen}
        title="异步确认"
        onOk={() =>
          new Promise<void>((resolve) => {
            window.setTimeout(() => {
              setAsyncOpen(false);
              resolve();
            }, 900);
          })
        }
        onCancel={() => setAsyncOpen(false)}
      >
        <p>点击确定后会模拟一次异步提交，按钮在 Promise 完成前保持禁用和加载态。</p>
      </Modal>
    </main>
  );
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
