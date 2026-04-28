"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchForm({
  initialValue = "",
  className,
}: {
  initialValue?: string;
  className?: string;
}) {
  const router = useRouter();
  const inputId = useId();
  const [query, setQuery] = useState(initialValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      router.push("/");
      return;
    }

    router.push(`/search/${encodeURIComponent(normalizedQuery)}`);
  }

  function handleClear() {
    setQuery("");
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className={cn("max-w-lg", className)}>
      <label htmlFor={inputId} className="sr-only">
        포스트 검색
      </label>
      <div className="relative flex max-w-lg items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          id={inputId}
          type="search"
          placeholder="검색"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-10 w-full min-w-0 rounded-md border-slate-200 bg-white pr-9 pl-9"
          role="searchbox"
        />
        {query ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </form>
  );
}
