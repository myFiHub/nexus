"use client";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { Input } from "../../../components/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/Popover";
import { Switch } from "../../../components/Switch";
import { TagsInput } from "./TagsInput";
import {
  allowedToEnterOptions,
  allowedToSpeakOptions,
  FreeOutpostAccessTypes,
  FreeOutpostSpeakerTypes,
} from "app/components/outpost/types";

const schema = z.object({
  name: z.string().min(2, "Name is required").max(64),
  subject: z.string().max(128).optional(),
  tags: z.array(z.string().min(1)).max(10, "Max 10 tags").optional(),
  allowedToEnter: z.string(),
  allowedToSpeak: z.string(),
  scheduled: z.boolean(),
  adults: z.boolean(),
  recordable: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

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
  const [enterOpen, setEnterOpen] = useState(false);
  const [speakOpen, setSpeakOpen] = useState(false);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // handle submit
      alert(JSON.stringify(value, null, 2));
    },
    validators: {
      onSubmit: async (values) => {
        const result = schema.safeParse(values.value);
        if (!result.success) {
          const errors = result.error.flatten().fieldErrors;
          return { errors };
        }
        return { errors: {} };
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <div className="bg-[#181f29]/90 rounded-2xl shadow-lg px-4 py-7 max-w-[420px] w-full mx-auto">
      <form
        className="flex flex-col gap-5 items-center"
        onSubmit={handleSubmit}
      >
        <div className="w-full max-w-[400px]">
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                if (value.length < 2) {
                  return "Name must be at least 2 characters";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Outpost Name"
                  aria-invalid={!!field.state.meta.errors?.length}
                />
                {field.state.meta.errors?.length > 0 && (
                  <div className="text-red-500 text-xs mt-1">
                    {field.state.meta.errors[0]}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="w-full max-w-[400px]">
          <form.Field name="subject">
            {(field) => (
              <>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Main Subject (optional)"
                  aria-invalid={!!field.state.meta.errors?.length}
                />
                {field.state.meta.errors?.length > 0 && (
                  <div className="text-red-500 text-xs mt-1">
                    {field.state.meta.errors[0]}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="w-full max-w-[400px]">
          <form.Field
            name="tags"
            validators={{
              onChange: ({ value }) => {
                if (value && value.length > 10) {
                  return "Maximum 10 tags allowed";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <>
                <TagsInput
                  value={field.state.value || []}
                  onChange={field.handleChange}
                  placeholder="Enter a tag (optional)..."
                />
                {field.state.meta.errors?.length > 0 && (
                  <div className="text-red-500 text-xs mt-1">
                    {field.state.meta.errors[0]}
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="w-full max-w-[400px]">
          <div className="font-medium text-[15px] mb-1">Allowed to Enter</div>
          <form.Field name="allowedToEnter">
            {(field) => (
              <Popover open={enterOpen} onOpenChange={setEnterOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full bg-[#181f29] text-white rounded-lg px-4 py-3 text-base text-left shadow-sm hover:bg-[#232b36] focus:bg-[#232b36] transition-colors outline-none"
                  >
                    {
                      allowedToEnterOptions.find(
                        (item) => item.value == field.state.value
                      )?.text
                    }
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[200px] p-0"
                  align="start"
                  sideOffset={4}
                >
                  <div>
                    {allowedToEnterOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className="block w-full text-left px-2 py-1 hover:bg-primary/10"
                        onClick={() => {
                          field.handleChange(option.value);
                          setEnterOpen(false);
                        }}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </form.Field>
        </div>
        <div className="w-full max-w-[400px]">
          <div className="font-medium text-[15px] mb-1">Allowed to Speak</div>
          <form.Field name="allowedToSpeak">
            {(field) => (
              <Popover open={speakOpen} onOpenChange={setSpeakOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full bg-[#181f29] text-white rounded-lg px-4 py-3 text-base text-left shadow-sm hover:bg-[#232b36] focus:bg-[#232b36] transition-colors outline-none"
                  >
                    {
                      allowedToSpeakOptions.find(
                        (item) => item.value == field.state.value
                      )?.text
                    }
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[200px] p-0"
                  align="start"
                  sideOffset={4}
                >
                  <div>
                    {allowedToSpeakOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className="block w-full text-left px-2 py-1 hover:bg-primary/10"
                        onClick={() => {
                          field.handleChange(option.value);
                          setSpeakOpen(false);
                        }}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </form.Field>
        </div>
        <div className="flex items-center justify-between mt-2 w-full max-w-[400px]">
          <div>
            <div className="font-medium text-base">Scheduled Outpost</div>
            <div className="text-[#b0b8c1] text-xs">
              Organize and notify in advance.
            </div>
          </div>
          <form.Field name="scheduled">
            {(field) => (
              <Switch
                checked={field.state.value}
                onCheckedChange={field.handleChange}
              />
            )}
          </form.Field>
        </div>
        <div className="flex items-center justify-between w-full max-w-[400px]">
          <div className="font-medium text-base">Adults speaking</div>
          <form.Field name="adults">
            {(field) => (
              <Switch
                checked={field.state.value}
                onCheckedChange={field.handleChange}
              />
            )}
          </form.Field>
        </div>
        <div className="flex items-center justify-between w-full max-w-[400px]">
          <div>
            <div className="font-medium text-base">Recordable</div>
            <div className="text-[#b0b8c1] text-xs">
              Outpost sessions can be recorded by you
            </div>
          </div>
          <form.Field name="recordable">
            {(field) => (
              <Switch
                checked={field.state.value}
                onCheckedChange={field.handleChange}
              />
            )}
          </form.Field>
        </div>
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
