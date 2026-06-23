import Link from "next/link";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function AdminButton({
  children,
  onClick,
  href,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[4px] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] transition-all focus:outline-none focus:ring-2 focus:ring-gold/30";

  const variants = {
    primary:
      "bg-gold text-offwhite hover:bg-gold/90 hover:shadow-sm",
    secondary:
      "border border-charcoal/15 text-charcoal hover:border-gold/40 hover:text-gold",
    ghost: "text-taupe hover:text-charcoal",
    danger: "bg-charcoal/5 text-red-600 hover:bg-red-50",
  };

  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {children}
    </button>
  );
}
