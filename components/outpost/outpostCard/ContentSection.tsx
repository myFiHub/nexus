interface ContentSectionProps {
  name: string;
  subject: string;
}

export function ContentSection({ name, subject }: ContentSectionProps) {
  return (
    <>
      <h3 className="text-xl font-bold mb-2 text-primary line-clamp-1">
        {name}
      </h3>
      <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm leading-relaxed">
        {subject}
      </p>
    </>
  );
}
