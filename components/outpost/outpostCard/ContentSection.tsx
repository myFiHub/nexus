import OutpostLink from "app/components/AppLink/outpostLink";

interface ContentSectionProps {
  name: string;
  subject: string;
  uuid: string;
}

export function ContentSection({ name, subject, uuid }: ContentSectionProps) {
  return (
    <OutpostLink underline={false} id={uuid} className="w-full h-full p-0 m-0">
      <div className="space-y-2 min-h-[3.5rem]">
        <h3 className="text-xl font-bold text-foreground leading-tight line-clamp-1 hover:text-primary transition-colors duration-200">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-1 min-h-[1.25rem]">
          {subject}
        </p>
      </div>
    </OutpostLink>
  );
}
