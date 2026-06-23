interface Props {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export default function AdminCard({ children, className = "", title }: Props) {
  return (
    <div
      className={`rounded-sm border border-beige/20 bg-offwhite p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] ${className}`}
    >
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-base font-medium tracking-tight text-charcoal">
            {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
}
