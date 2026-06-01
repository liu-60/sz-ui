import { type ReactNode } from 'react';

export type MessageType = 'info' | 'success' | 'warning' | 'error';

export interface MessageProps {
  type?: MessageType;
  title?: ReactNode;
  children?: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

const iconMap: Record<MessageType, string> = {
  info: 'i',
  success: '✓',
  warning: '!',
  error: '×'
};

export function Message({ type = 'info', title, children, closable = false, onClose, className }: MessageProps) {
  return (
    <div className={['sz-message', `sz-message-${type}`, className ?? ''].filter(Boolean).join(' ')} role="status">
      <span className="sz-message-icon" aria-hidden="true">
        {iconMap[type]}
      </span>
      <div className="sz-message-content">
        {title ? <strong>{title}</strong> : null}
        {children ? <div>{children}</div> : null}
      </div>
      {closable ? (
        <button type="button" className="sz-message-close" aria-label="关闭消息" onClick={onClose}>
          ×
        </button>
      ) : null}
    </div>
  );
}
