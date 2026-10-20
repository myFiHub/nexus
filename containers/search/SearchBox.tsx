"use client";

import { Loader2, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { MIN_SEARCH_QUERY_LENGTH } from "./constants";

const DEBOUNCE_MS = 350;

export const SearchBox = ({ initialQuery }: { initialQuery: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const query = value.trim();
    if (query === (searchParams.get("q") ?? "")) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (query.length >= MIN_SEARCH_QUERY_LENGTH) params.set("q", query);
      else params.delete("q");
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, pathname, router, searchParams]);

  return (
    <div className="glass-card flex items-center gap-3 px-4 py-3">
      {pending ? (
        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />
      ) : (
        <Search className="h-5 w-5 shrink-0 text-text-faint" />
      )}
      <input
        ref={inputRef}
        type="search"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search outposts, people and topics"
        aria-label="Search"
        className="min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-text-faint outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="press rounded-full p-1 text-text-faint hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
