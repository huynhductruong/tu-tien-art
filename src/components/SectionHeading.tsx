import { ReactNode } from "react";

export const SectionHeading = ({
  eyebrow,
  cn: chinese,
  title,
  description,
}: {
  eyebrow?: string;
  cn?: string;
  title: string;
  description?: ReactNode;
}) => (
  <div className="text-center max-w-2xl mx-auto mb-12 animate-rise">
    {eyebrow && (
      <div className="text-xs tracking-[0.4em] text-primary font-display uppercase mb-3">
        {eyebrow}
      </div>
    )}
    {chinese && (
      <div className="font-script text-5xl md:text-6xl text-jade-aura mb-2">{chinese}</div>
    )}
    <h2 className="font-display text-3xl md:text-4xl text-primary-deep mb-4">{title}</h2>
    {description && <p className="text-muted-foreground leading-relaxed">{description}</p>}
    <div className="divider-cloud mt-6 max-w-xs mx-auto" />
  </div>
);
