"use client";
import {
  FreeOutpostAccessTypes,
  FreeOutpostSpeakerTypes,
} from "app/components/outpost/types";
import { useState } from "react";
import { AccessField } from "./AccessField";
import { AdultsField } from "./AdultsField";
import { NameField } from "./NameField";
import { RecordableField } from "./RecordableField";
import { ScheduledField } from "./ScheduledField";
import { SpeakField } from "./SpeakField";
import { SubjectField } from "./SubjectField";
import { TagsField } from "./TagsField";

type FormValues = {
  name: string;
  subject: string;
  tags: string[];
  allowedToEnter: string;
  allowedToSpeak: string;
  scheduled: boolean;
  adults: boolean;
  recordable: boolean;
};

const defaultValues: FormValues = {
  name: "",
  subject: "",
  tags: [],
  allowedToEnter: FreeOutpostAccessTypes.public,
  allowedToSpeak: FreeOutpostSpeakerTypes.everyone,
  scheduled: false,
  adults: false,
  recordable: false,
};

const OutpostForm = () => {
  const [formData, setFormData] = useState<FormValues>(defaultValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle submit
    alert(JSON.stringify(formData, null, 2));
  };

  const updateField = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-[#181f29]/90 rounded-2xl shadow-lg px-4 py-7 max-w-[420px] w-full mx-auto">
      <form
        className="flex flex-col gap-5 items-center"
        onSubmit={handleSubmit}
      >
        <NameField
          value={formData.name}
          onChange={(value) => updateField("name", value)}
        />

        <SubjectField
          value={formData.subject}
          onChange={(value) => updateField("subject", value)}
        />

        <TagsField
          value={formData.tags}
          onChange={(value) => updateField("tags", value)}
        />

        <AccessField
          value={formData.allowedToEnter}
          onChange={(value) => updateField("allowedToEnter", value)}
        />

        <SpeakField
          value={formData.allowedToSpeak}
          onChange={(value) => updateField("allowedToSpeak", value)}
        />

        <ScheduledField
          value={formData.scheduled}
          onChange={(value) => updateField("scheduled", value)}
        />

        <AdultsField
          value={formData.adults}
          onChange={(value) => updateField("adults", value)}
        />

        <RecordableField
          value={formData.recordable}
          onChange={(value) => updateField("recordable", value)}
        />

        <button
          type="submit"
          className="w-full max-w-[400px] bg-primary text-white rounded-lg px-4 py-3 text-base font-medium hover:bg-primary/90 transition-colors"
        >
          Create Outpost
        </button>
      </form>
    </div>
  );
};

export default OutpostForm;
