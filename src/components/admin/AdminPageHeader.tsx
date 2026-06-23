interface Props {
  title: string;
  description?: string;
}

export default function AdminPageHeader({ title, description }: Props) {
  return (
    <div className="mb-6">
      <h1 className="font-heading text-2xl font-light tracking-tight text-charcoal md:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm leading-relaxed text-taupe">{description}</p>
      )}
    </div>
  );
}
