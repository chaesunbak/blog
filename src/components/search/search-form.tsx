'use client';

import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FormEvent, useId, useState } from 'react';
import { Responsive } from '@/shared/components/responsive';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const SearchField = ({
  autoFocus = false,
  inputId,
  query,
  onChange,
  onClear,
}: {
  autoFocus?: boolean;
  inputId: string;
  query: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) => (
  <div className="relative flex w-full items-center">
    <Search className="text-muted-foreground absolute left-3 h-4 w-4" />
    <Input
      id={inputId}
      type="search"
      placeholder="검색"
      value={query}
      autoFocus={autoFocus}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full min-w-0 rounded-full border-slate-200 bg-white pr-11 pl-9"
      role="searchbox"
    />
    {query ? (
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onClear}
        className="text-muted-foreground hover:text-foreground absolute right-2 rounded-full"
      >
        <X className="h-4 w-4" />
      </Button>
    ) : null}
  </div>
);

const DesktopSearch = ({
  className,
  inputId,
  query,
  onChange,
  onClear,
  onSubmit,
}: {
  className?: string;
  inputId: string;
  query: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) => (
  <form onSubmit={onSubmit} className={cn('max-w-lg', className)}>
    <label htmlFor={inputId} className="sr-only">
      포스트 검색
    </label>
    <SearchField
      inputId={inputId}
      query={query}
      onChange={onChange}
      onClear={onClear}
    />
  </form>
);

const MobileSearch = ({
  inputId,
  isDialogOpen,
  query,
  onChange,
  onClear,
  onOpenChange,
  onSubmit,
}: {
  inputId: string;
  isDialogOpen: boolean;
  query: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) => (
  <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      onClick={() => onOpenChange(true)}
      className="text-muted-foreground shrink-0 rounded-full border-slate-200 bg-white"
      aria-label="검색 열기"
    >
      <Search className="h-4 w-4" />
    </Button>

    <DialogContent className="gap-5 p-5 sm:p-6">
      <DialogHeader>
        <DialogTitle>포스트 검색</DialogTitle>
        <DialogDescription>
          키워드를 입력해서 블로그 글을 찾아보세요.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit} className="space-y-3">
        <label htmlFor={inputId} className="sr-only">
          포스트 검색
        </label>
        <SearchField
          autoFocus
          inputId={inputId}
          query={query}
          onChange={onChange}
          onClear={onClear}
        />
        <div className="flex items-center justify-end gap-2">
          {query ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onClear}
              className="rounded-full px-4"
            >
              초기화
            </Button>
          ) : null}

          <Button type="submit" className="rounded-full px-4">
            검색
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);

export function SearchForm({
  initialValue = '',
  className,
}: {
  initialValue?: string;
  className?: string;
}) {
  const router = useRouter();
  const inputId = useId();
  const [query, setQuery] = useState(initialValue);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function navigateToQuery() {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      router.push('/');
      return;
    }

    router.push(`/search/${encodeURIComponent(normalizedQuery)}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    navigateToQuery();
    setIsDialogOpen(false);
  }

  function handleClear() {
    setQuery('');
    router.push('/');
    setIsDialogOpen(false);
  }

  return (
    <Responsive
      desktop={
        <DesktopSearch
          className={className}
          inputId={inputId}
          query={query}
          onChange={setQuery}
          onClear={handleClear}
          onSubmit={handleSubmit}
        />
      }
      mobile={
        <MobileSearch
          inputId={inputId}
          isDialogOpen={isDialogOpen}
          query={query}
          onChange={setQuery}
          onClear={handleClear}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
        />
      }
    />
  );
}
