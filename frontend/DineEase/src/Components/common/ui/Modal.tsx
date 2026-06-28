import { Button } from "./Button";

/**
 * Centered modal dialog. Use `ConfirmModal` for the common two-button confirm
 * pattern (replaces the duplicated ConfirmationModal in AppAppBar & SidePanel).
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ink/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl border border-brand-cream-dark bg-white p-6 shadow-card-hover ${className ?? ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="mb-3 text-xl font-bold text-brand-maroon">{title}</h3>}
        {children}
      </div>
    </div>
  );
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      {message && <p className="text-brand-ink-soft">{message}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
