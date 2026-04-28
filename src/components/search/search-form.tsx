'use client';

import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useId, useState } from 'react';
import { Responsive } from '@/shared/components/responsive';
import { useIsMobile } from '@/shared/hooks/use-is-mobile';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Kbd,
  KbdGroup,
} from '@/components/ui/kbd';
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
  <div className="relative">
    <input
      id={inputId}
      type="text"
      inputMode="search"
      enterKeyHint="search"
      placeholder="검색"
      value={query}
      autoFocus={autoFocus}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-full border border-slate-200 bg-white pr-12 pl-11 text-sm text-slate-950 outline-none ring-offset-1 transition-all placeholder:text-muted-foreground focus-visible:ring-[2px] focus-visible:ring-ring"
      role="searchbox"
    />
    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
    {query ? (
      <button
        type="button"
        onClick={onClear}
        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full transition-colors"
        aria-label="검색어 지우기"
      >
        <X className="h-4 w-4" />
      </button>
    ) : null}
  </div>
);

const DesktopSearch = ({
  className,
  onOpen,
}: {
  className?: string;
  onOpen: () => void;
}) => (
  <Button
    type="button"
    variant="outline"
    size="lg"
    onClick={onOpen}
    className={cn(
      'text-muted-foreground h-11 w-full justify-between rounded-full border-slate-200 bg-white px-3 hover:bg-white',
      className,
    )}
    aria-label="검색 열기"
  >
    <span className="flex min-w-0 items-center gap-3">
      <Search className="h-4 w-4 shrink-0" />
      <span className="truncate">검색</span>
    </span>
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  </Button>
);

const MobileSearch = ({ onOpen }: { onOpen: () => void }) => (
  <Button
    type="button"
    variant="outline"
    size="icon-lg"
    onClick={onOpen}
    className="text-muted-foreground shrink-0 rounded-full border-slate-200 bg-white"
    aria-label="검색 열기"
  >
    <Search className="h-4 w-4" />
  </Button>
);

const SearchDialog = ({
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
    <DialogContent className="gap-5 p-5 sm:p-6">
      <DialogHeader>
        <DialogTitle>게시글 검색</DialogTitle>
        <DialogDescription>키워드를 입력주세요.</DialogDescription>
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
  const isMobile = useIsMobile();
  const inputId = useId();
  const [query, setQuery] = useState(initialValue);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (
        !(event.ctrlKey || event.metaKey) ||
        event.key.toLowerCase() !== 'k' ||
        event.isComposing
      ) {
        return;
      }

      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement)
      ) {
        return;
      }

      event.preventDefault();
      setIsDialogOpen(true);
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile]);

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
    <>
      <Responsive
        desktop={
          <DesktopSearch
            className={className}
            onOpen={() => setIsDialogOpen(true)}
          />
        }
        mobile={<MobileSearch onOpen={() => setIsDialogOpen(true)} />}
      />
      <SearchDialog
        inputId={inputId}
        isDialogOpen={isDialogOpen}
        query={query}
        onChange={setQuery}
        onClear={handleClear}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}
