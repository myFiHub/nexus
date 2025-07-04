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
    <div className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl h-full flex flex-col border border-border ">
      <ImageSection outpost={outpost} />

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <ContentSection name={outpost.name} subject={outpost.subject} />
        <CreatorSection outpost={outpost} />

        {/* Indicators Section */}
        <div className="space-y-3 mb-4">
          <EnterAndSpeakIndicators outpost={outpost} />
        </div>

        <OutpostCardActions outpost={outpost} />
      </div>
    </div>
  );
}
