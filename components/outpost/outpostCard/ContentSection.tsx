import OutpostLink from "app/components/AppLink/outpostLink";

interface ContentSectionProps {
  name: string;
  subject: string;
  uuid: string;
}

export function ContentSection({ name, subject, uuid }: ContentSectionProps) {
  return (
    <>
      <OutpostLink
        underline={false}
        id={uuid}
        className="w-full h-full p-0 m-0"
      >
        <h3 className="text-xl font-bold mb-2 text-primary line-clamp-1">
          {name}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm leading-relaxed">
          {subject}
        </p>
      </OutpostLink>
    </>
  );
}
