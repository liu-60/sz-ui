import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';

export type ModalSize = number | string;

export interface ModalProps {
  open: boolean;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode | null;
  okText?: ReactNode;
  cancelText?: ReactNode;
  okButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  cancelButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  afterOpenChange?: (open: boolean) => void;
  confirmLoading?: boolean;
  closable?: boolean;
  closeIcon?: ReactNode;
  mask?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  destroyOnClose?: boolean;
  width?: ModalSize;
  zIndex?: number;
  className?: string;
  style?: CSSProperties;
  bodyClassName?: string;
  bodyStyle?: CSSProperties;
  getContainer?: HTMLElement | (() => HTMLElement) | false;
  'aria-label'?: string;
}

const lockedBodyOverflow: string[] = [];

function lockBodyScroll(): void {
  if (typeof document === 'undefined') {
    return;
  }

  lockedBodyOverflow.push(document.body.style.overflow);
  document.body.style.overflow = 'hidden';
}

function unlockBodyScroll(): void {
  if (typeof document === 'undefined' || lockedBodyOverflow.length === 0) {
    return;
  }

  const previousOverflow = lockedBodyOverflow.pop();
  document.body.style.overflow = previousOverflow ?? '';
}

function resolveContainer(getContainer: ModalProps['getContainer']): HTMLElement | null {
  if (typeof document === 'undefined' || getContainer === false) {
    return null;
  }

  if (typeof getContainer === 'function') {
    return getContainer();
  }

  return getContainer ?? document.body;
}

function formatWidth(width: ModalSize | undefined): string | undefined {
  if (typeof width === 'number') {
    return `${width}px`;
  }

  return width;
}

export function Modal({
  open,
  title,
  children,
  footer,
  okText = '确定',
  cancelText = '取消',
  okButtonProps,
  cancelButtonProps,
  onOk,
  onCancel,
  afterOpenChange,
  confirmLoading = false,
  closable = true,
  closeIcon,
  mask = true,
  maskClosable = true,
  keyboard = true,
  centered = false,
  destroyOnClose = false,
  width = 520,
  zIndex = 1000,
  className,
  style,
  bodyClassName,
  bodyStyle,
  getContainer,
  'aria-label': ariaLabel
}: ModalProps) {
  const titleId = useId();
  const [internalLoading, setInternalLoading] = useState(false);
  const hasOpenedRef = useRef(open);
  const container = resolveContainer(getContainer);
  const loading = confirmLoading || internalLoading;

  hasOpenedRef.current = hasOpenedRef.current || open;

  useEffect(() => {
    if (!open) {
      return;
    }

    lockBodyScroll();
    return unlockBodyScroll;
  }, [open]);

  useEffect(() => {
    if (!open || !keyboard) {
      return;
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keyboard, onCancel, open]);

  useEffect(() => {
    afterOpenChange?.(open);
  }, [afterOpenChange, open]);

  const handleOk = useCallback(async () => {
    if (!onOk || loading) {
      return;
    }

    const result = onOk();
    if (result instanceof Promise) {
      try {
        setInternalLoading(true);
        await result;
      } finally {
        setInternalLoading(false);
      }
    }
  }, [loading, onOk]);

  const handleCancel = useCallback(() => {
    if (!loading) {
      onCancel?.();
    }
  }, [loading, onCancel]);

  const handleMaskClick = useCallback(
    () => {
      if (maskClosable) {
        handleCancel();
      }
    },
    [handleCancel, maskClosable]
  );

  const handleDialogKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  const modalStyle = useMemo<CSSProperties>(
    () => ({
      '--sz-modal-width': formatWidth(width),
      ...style
    }) as CSSProperties,
    [style, width]
  );

  const defaultFooter = (
    <>
      <button type="button" className="button-outline" onClick={handleCancel} disabled={loading} {...cancelButtonProps}>
        {cancelText}
      </button>
      <button
        type="button"
        className="sz-modal-ok"
        onClick={handleOk}
        disabled={loading}
        aria-busy={loading}
        {...okButtonProps}
      >
        {loading ? '处理中...' : okText}
      </button>
    </>
  );

  if (!open && (destroyOnClose || !hasOpenedRef.current)) {
    return null;
  }

  const dialog = (
    <div
      className={[
        'sz-modal-root',
        open ? 'sz-modal-open' : '',
        centered ? 'sz-modal-centered' : '',
        className ?? ''
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ zIndex }}
      aria-hidden={!open}
    >
      {mask ? <div className="sz-modal-mask" aria-hidden="true" onMouseDown={handleMaskClick} /> : null}
      <div
        className="sz-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        style={modalStyle}
        onKeyDown={handleDialogKeyDown}
      >
        {(title || closable) && (
          <div className="sz-modal-header">
            {title ? (
              <h2 className="sz-modal-title" id={titleId}>
                {title}
              </h2>
            ) : (
              <span className="sz-modal-title" />
            )}
            {closable ? (
              <button type="button" className="sz-modal-close" aria-label="关闭弹窗" onClick={handleCancel} disabled={loading}>
                {closeIcon ?? '×'}
              </button>
            ) : null}
          </div>
        )}
        <div className={['sz-modal-body', bodyClassName ?? ''].filter(Boolean).join(' ')} style={bodyStyle}>
          {children}
        </div>
        {footer !== null ? <div className="sz-modal-footer">{footer ?? defaultFooter}</div> : null}
      </div>
    </div>
  );

  return container ? createPortal(dialog, container) : dialog;
}
