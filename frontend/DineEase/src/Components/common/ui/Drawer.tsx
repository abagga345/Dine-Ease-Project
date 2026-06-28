import { X } from "lucide-react";

/** Right-side slide-over panel used for the mobile nav and the cart. */
export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm animate-slide-in-right flex-col bg-brand-cream shadow-card-hover">
        <header className="flex items-center justify-between border-b border-brand-cream-dark px-5 py-4">
          <h3 className="text-lg font-bold text-brand-maroon">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-brand-ink-soft transition hover:bg-brand-maroon/10 hover:text-brand-maroon"
          >
            <X size={22} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-brand-cream-dark px-5 py-4">{footer}</div>}
      </aside>
    </div>
  );
}
