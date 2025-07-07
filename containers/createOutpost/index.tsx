"use client";
import { ReduxProvider } from "app/store/Provider";
import { AdultsField } from "./components/AdultsField";
import CreateButton from "./components/CreateButton";
import { EnterTypeField } from "./components/enterTypeField";
import ImageSelector from "./components/ImageSelector";
import { NameField } from "./components/nameField";
import { RecordableField } from "./components/RecordableField";
import { ScheduledField } from "./components/scheduleField";
import { SpeakField } from "./components/speakTypeField";
import { SubjectField } from "./components/SubjectField";
import { TagsField } from "./components/TagsField";
import { useCreateOutpostSlice } from "./slice";

const Content = () => {
  useCreateOutpostSlice();
  return (
    <div className="min-h-screen   from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4 pt-20 !w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            Create New Outpost
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Set up your virtual space and start connecting with others
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-3 items-start">
          {/* Image Selector Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 shadow-2xl">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Outpost Image
              </h2>
              <ImageSelector />
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 lg:p-6 border border-white/10 shadow-2xl max-w-lg mx-3">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Outpost Details
              </h2>

              <div className="space-y-6 w-full">
                <NameField />
                <SubjectField />
                <TagsField />
                <EnterTypeField />
                <SpeakField />
                <ScheduledField />
                <AdultsField />
                <RecordableField />
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <CreateButton />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export const CreateOutpost = () => {
  return (
    <ReduxProvider>
      <Content />
    </ReduxProvider>
  );
};
