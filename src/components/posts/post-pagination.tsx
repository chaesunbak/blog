import { Fragment } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PostPaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

function buildHref(basePath: string, page: number) {
  if (page <= 1) {
    return basePath;
  }

  return `${basePath}?page=${page}`;
}

function buildPageRange(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) {
    pages.add(currentPage - 1);
  }

  if (currentPage < totalPages) {
    pages.add(currentPage + 1);
  }

  return [...pages].sort((left, right) => left - right);
}

export function PostPagination({
  currentPage,
  totalPages,
  basePath,
}: PostPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPageRange(currentPage, totalPages);

  return (
    <Pagination className="mt-14 justify-start">
      <PaginationContent>
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationPrevious href={buildHref(basePath, currentPage - 1)} />
          ) : (
            <span className="inline-flex h-11 items-center px-4 text-sm font-medium text-slate-300">
              ‹ 이전
            </span>
          )}
        </PaginationItem>

        {pages.map((page, index) => {
          const previousPage = pages[index - 1];
          const shouldShowEllipsis = previousPage && page - previousPage > 1;

          return (
            <Fragment key={page}>
              {shouldShowEllipsis ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}
              <PaginationItem>
                <PaginationLink
                  href={buildHref(basePath, page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </Fragment>
          );
        })}

        <PaginationItem>
          {currentPage < totalPages ? (
            <PaginationNext href={buildHref(basePath, currentPage + 1)} />
          ) : (
            <span className="inline-flex h-11 items-center px-4 text-sm font-medium text-slate-300">
              다음 ›
            </span>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
