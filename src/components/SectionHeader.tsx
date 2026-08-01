export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">{eyebrow}</p> : null}
      <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-3xl text-sm leading-7 text-brand/80 sm:text-base">{description}</p> : null}
    </div>
  );
}
