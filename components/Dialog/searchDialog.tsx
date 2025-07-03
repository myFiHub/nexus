"use client";

// Usage example:
//
// import { searchDialog } from "app/components/Dialog";
//
// const handleSearch = async () => {
//   const result = await searchDialog({
//     title: "Search Everything"
//   });
//
//   if (result.confirmed) {
//     console.log("Search dialog closed");
//   }
// };

import { logoUrl } from "app/lib/constants";
import { truncate } from "app/lib/utils";
import podiumApi from "app/services/api";
import { OutpostModel, TagModel, User } from "app/services/api/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Loader2,
  Search,
  Tag,
  Users,
  X,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { AppLink } from "../AppLink";
import { Img } from "../Img";
import { Input } from "../Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./index";

// TabTriggerWithCount Component
interface TabTriggerWithCountProps {
  value: string;
  children: ReactNode;
  count: number;
}

const TabTriggerWithCount = ({
  value,
  children,
  count,
}: TabTriggerWithCountProps) => (
  <TabsTrigger value={value}>
    {children}
    {count > 0 && (
      <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-primary text-white rounded-full">
        {count}
      </span>
    )}
  </TabsTrigger>
);

interface SearchDialogProps {
  title?: ReactNode;
}

export type SearchDialogResult = {
  confirmed: boolean;
};

let resolvePromise: ((value: SearchDialogResult) => void) | null = null;

export const searchDialog = ({
  title = "Search",
}: SearchDialogProps): Promise<SearchDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-search-dialog", {
      detail: {
        title,
      },
    });
    window.dispatchEvent(event);
  });
};

export const SearchDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [dialogContent, setDialogContent] = useState<SearchDialogProps | null>(
    null
  );

  // Search results
  const [usersResults, setUsersResults] = useState<Record<string, User>>({});
  const [outposts, setOutposts] = useState<Record<string, OutpostModel>>({});
  const [tags, setTags] = useState<Record<string, TagModel>>({});

  // Tag click functionality
  const [clickedTag, setClickedTag] = useState<TagModel | null>(null);
  const [isTagLoading, setIsTagLoading] = useState(false);
  const [loadingTagId, setLoadingTagId] = useState<number | null>(null);
  const [tagOutposts, setTagOutposts] = useState<Record<string, OutpostModel>>(
    {}
  );

  useEffect(() => {
    const handleShowDialog = (event: CustomEvent<SearchDialogProps>) => {
      setDialogContent(event.detail);
      setIsOpen(true);
    };

    window.addEventListener(
      "show-search-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-search-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (searchValue.length < 3) {
        setUsersResults({});
        setOutposts({});
        setTags({});
        return;
      }

      setIsSearching(true);
      try {
        // Call all three APIs simultaneously
        const [usersResult, outpostsResult, tagsResult] = await Promise.all([
          podiumApi.searchUserByName(searchValue),
          podiumApi.searchOutpostByName(searchValue),
          podiumApi.searchTag(searchValue),
        ]);

        setUsersResults(usersResult);
        setOutposts(outpostsResult);
        setTags(tagsResult);
      } catch (error) {
        console.error("Error searching:", error);
        setUsersResults({});
        setOutposts({});
        setTags({});
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 500); // 500ms debounce
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const handleClose = () => {
    setIsOpen(false);
    resolvePromise?.({ confirmed: true });
    resolvePromise = null;
    setSearchValue("");
    setUsersResults({});
    setOutposts({});
    setTags({});
    setClickedTag(null);
    setTagOutposts({});
    setLoadingTagId(null);
  };

  const clearSearch = () => {
    setSearchValue("");
    setUsersResults({});
    setOutposts({});
    setTags({});
    setClickedTag(null);
    setTagOutposts({});
    setLoadingTagId(null);
  };

  const handleTagClick = async (tag: TagModel) => {
    if (isTagLoading) return; // Prevent multiple clicks

    setClickedTag(tag);
    setIsTagLoading(true);
    setLoadingTagId(tag.id);

    try {
      const outpostsResult = await podiumApi.getOutpostsByTagId(tag.id);
      setTagOutposts(outpostsResult);
    } catch (error) {
      console.error("Error fetching outposts for tag:", error);
      setTagOutposts({});
    } finally {
      setIsTagLoading(false);
      setLoadingTagId(null);
    }
  };

  const handleBackToTags = () => {
    setClickedTag(null);
    setTagOutposts({});
    setLoadingTagId(null);
  };

  const usersCount = Object.keys(usersResults).length;
  const outpostsCount = Object.keys(outposts).length;
  const tagsCount = Object.keys(tags).length;
  const tagOutpostsCount = Object.keys(tagOutposts).length;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="w-full max-w-2xl min-h-[620px] max-h-[620px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{dialogContent?.title}</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for users, outposts, or tags..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 pr-10"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-spin" />
            )}
            {searchValue.length > 0 && !isSearching && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabTriggerWithCount value="users" count={usersCount}>
              Users
            </TabTriggerWithCount>
            <TabTriggerWithCount value="outposts" count={outpostsCount}>
              Outposts
            </TabTriggerWithCount>
            <TabTriggerWithCount value="tags" count={tagsCount}>
              Tags
            </TabTriggerWithCount>
          </TabsList>

          <div className="mt-4 h-[400px] overflow-y-auto">
            {/* Users Tab */}
            <TabsContent value="users" className="space-y-3">
              {Object.values(usersResults).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No users found</p>
                </div>
              ) : (
                Object.values(usersResults).map((user, index) => (
                  <motion.div
                    key={user.uuid}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <AppLink
                      onClick={() => {
                        handleClose();
                      }}
                      underline={false}
                      href={`/user/${user.uuid}`}
                      className="block p-4 rounded-lg border border-border   transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Img
                            src={user.image || logoUrl}
                            alt={user.name || "User"}
                            className="w-12 h-12 rounded-full border-2 border-gradient-to-br from-blue-500/80 to-purple-500/80 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300"
                            useImgTag
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {user.name || "Anonymous User"}
                          </h4>
                          {user.aptos_address && (
                            <p className="text-sm text-muted-foreground font-mono">
                              {truncate(user.aptos_address)}
                            </p>
                          )}
                          {user.uuid && (
                            <p className="text-sm text-muted-foreground font-mono">
                              {truncate(user.uuid)}
                            </p>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                      </div>
                    </AppLink>
                  </motion.div>
                ))
              )}
            </TabsContent>

            {/* Outposts Tab */}
            <TabsContent value="outposts" className="space-y-3">
              {Object.values(outposts).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No outposts found</p>
                </div>
              ) : (
                Object.values(outposts).map((outpost, index) => (
                  <motion.div
                    key={outpost.uuid}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <AppLink
                      underline={false}
                      onClick={() => {
                        handleClose();
                      }}
                      href={`/outpost_details/${outpost.uuid}`}
                      className="block p-4 rounded-lg border transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Img
                            src={outpost.image || logoUrl}
                            alt={outpost.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {outpost.name}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {outpost.subject}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            by {outpost.creator_user_name}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </AppLink>
                  </motion.div>
                ))
              )}
            </TabsContent>

            {/* Tags Tab */}
            <TabsContent value="tags" className="space-y-3">
              <AnimatePresence mode="wait">
                {!clickedTag ? (
                  <motion.div
                    key="tags-list"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {Object.values(tags).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Tag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No tags found</p>
                      </div>
                    ) : (
                      Object.values(tags).map((tag) => {
                        const isCurrentTagLoading = loadingTagId === tag.id;

                        return (
                          <motion.div
                            key={tag.id}
                            whileTap={{ scale: 0.98 }}
                            className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/5 transition-all duration-200 group cursor-pointer"
                            onClick={() => handleTagClick(tag)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/80 to-blue-500/80 group-hover:from-purple-500 group-hover:to-blue-500 flex items-center justify-center text-white font-semibold text-sm transition-all duration-300">
                                {isCurrentTagLoading ? (
                                  <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                  <Tag className="w-6 h-6" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                  #{tag.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Tag ID: {tag.id}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="tag-outposts"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {/* Back Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBackToTags}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Tags
                    </motion.button>

                    {/* Tag Header */}
                    <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-200/20">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/80 to-blue-500/80 flex items-center justify-center text-white font-semibold text-sm">
                          <Tag className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            #{clickedTag.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {tagOutpostsCount} outpost
                            {tagOutpostsCount !== 1 ? "s" : ""} found
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tag Outposts */}
                    {isTagLoading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin opacity-50" />
                        <p>Loading outposts...</p>
                      </div>
                    ) : tagOutpostsCount === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No outposts found for this tag</p>
                      </div>
                    ) : (
                      Object.values(tagOutposts).map((outpost) => (
                        <motion.div
                          key={outpost.uuid}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <AppLink
                            underline={false}
                            onClick={() => {
                              handleClose();
                            }}
                            href={`/outpost_details/${outpost.uuid}`}
                            className="block p-4 rounded-lg border transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <Img
                                  src={outpost.image || logoUrl}
                                  alt={outpost.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {outpost.name}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {outpost.subject}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  by {outpost.creator_user_name}
                                </p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </AppLink>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
