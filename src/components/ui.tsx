import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, X, AudioLines, ArrowRight } from "lucide-react";
export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      to="/"
      className={`brand ${inverse ? "inverse" : ""}`}
      aria-label="VERVO, inicio"
    >
      <AudioLines size={31} strokeWidth={2} />
      <span>
        vervo<span className="brand-period">.</span>
      </span>
    </Link>
  );
}
export function ArrowLink({
  to,
  children,
  className = "",
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link to={to} className={`arrow-link ${className}`}>
      {children}
      <ArrowUpRight size={20} />
    </Link>
  );
}
export function EmptyState({
  title,
  description,
  action,
  to,
}: {
  title: string;
  description: string;
  action?: string;
  to?: string;
}) {
  return (
    <div className="empty-state">
      <AudioLines size={36} strokeWidth={1} />
      <h2>{title}</h2>
      <p>{description}</p>
      {action && to && (
        <Link className="button" to={to}>
          {action}
          <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}
export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    else if (!open && node.open) node.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="dialog"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-label={title}
    >
      <div className="dialog-inner">
        <button
          className="icon-button dialog-close"
          type="button"
          onClick={onClose}
          aria-label="Cerrar diálogo"
        >
          <X size={22} />
        </button>
        <h2>{title}</h2>
        {children}
      </div>
    </dialog>
  );
}
export function PageHeading({
  title,
  children,
  aside,
}: {
  title: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="page-heading">
      <div>
        <h1 tabIndex={-1}>{title}</h1>
        {children && <p>{children}</p>}
      </div>
      {aside}
    </header>
  );
}
export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" }).format(
    new Date(date),
  );
