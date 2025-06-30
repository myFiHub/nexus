import { OutpostModel } from "app/services/api/types";
import { Tag } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../Tooltip";

export function Tags({ outpost }: { outpost: OutpostModel }) {
  if (!outpost.tags || outpost.tags.length === 0) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="bg-gradient-to-br from-purple-500/80 to-blue-500/80 backdrop-blur-sm border border-white/30 text-white hover:from-purple-500 hover:to-blue-500 hover:border-white/50 w-8 h-8 rounded-lg flex items-center justify-center cursor-help transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
          <Tag className="w-4 h-4 drop-shadow-sm" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs p-3 bg-white/95 ">
        <div className="flex flex-wrap gap-2">
          {outpost.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-1.5 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200/50 shadow-sm hover:from-purple-200 hover:to-blue-200 hover:border-purple-300 transition-all duration-200"
            >
              <Tag className="w-3 h-3 text-purple-600" />
              {tag}
            </span>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
