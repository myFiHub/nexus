import { Tag } from "lucide-react";

interface TagsProps {
  tags: string[];
}

export function Tags({ tags }: TagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-semibold">Tags</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
