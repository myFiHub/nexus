import { OutpostModel } from "app/services/api/types";
import { OutpostCardActions } from "./actions";
import { ContentSection } from "./ContentSection";
import { CreatorSection } from "./CreatorSection";
import { EnterAndSpeakIndicators } from "./enterAndSpeakIndicators";
import { ImageSection } from "./ImageSection";

interface OutpostCardProps {
  outpost: OutpostModel;
}

export function OutpostCard({ outpost }: OutpostCardProps) {
  return (
    <div className="group relative bg-background rounded-xl border border-border overflow-hidden hover:border-border/80 transition-colors duration-200">
      {/* Main content */}
      <div className="relative">
        {/* Image section */}
        <div className="relative">
          <ImageSection outpost={outpost} />
          {/* Floating status indicators */}
          <div className="absolute -bottom-4 left-4 right-4 z-1">
            <div className="bg-background/98 backdrop-blur-sm rounded-lg border border-border/80 shadow-lg p-3">
              <EnterAndSpeakIndicators outpost={outpost} />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-5 pt-8">
          {/* Title and subject */}
          <div className="mb-5">
            <ContentSection
              name={outpost.name}
              subject={outpost.subject}
              uuid={outpost.uuid}
            />
          </div>

          {/* Creator section */}
          <div className="mb-5">
            <CreatorSection outpost={outpost} />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-border/30">
            <OutpostCardActions outpost={outpost} />
          </div>
        </div>
      </div>
    </div>
  );
}
