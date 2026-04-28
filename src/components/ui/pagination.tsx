import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

type PaginationLinkProps = React.ComponentProps<typeof Link> & {
  isActive?: boolean;
  size?: "default" | "icon";
};

export function Pagination({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

export function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-2", className)}
      {...props}
    />
  );
}

export function PaginationItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return <li className={cn(className)} {...props} />;
}

export function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2",
        size === "icon" ? "h-11 min-w-11 px-3" : "h-11 min-w-11 px-4",
        isActive
          ? "bg-slate-100 text-slate-900"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
        className,
      )}
      {...props}
    />
  );
}

export function PaginationPrevious({
  className,
  ...props
}: Omit<PaginationLinkProps, "size">) {
  return (
    <PaginationLink
      aria-label="이전 페이지"
      size="default"
      className={cn("gap-2 pl-3 pr-4", className)}
      {...props}
    >
      <span aria-hidden>‹</span>
      <span>이전</span>
    </PaginationLink>
  );
}

export function PaginationNext({
  className,
  ...props
}: Omit<PaginationLinkProps, "size">) {
  return (
    <PaginationLink
      aria-label="다음 페이지"
      size="default"
      className={cn("gap-2 pl-4 pr-3", className)}
      {...props}
    >
      <span>다음</span>
      <span aria-hidden>›</span>
    </PaginationLink>
  );
}

export function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-11 min-w-11 items-center justify-center text-slate-400",
        className,
      )}
      {...props}
    >
      …
    </span>
  );
}
