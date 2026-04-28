import Link from "next/link";
import { SearchForm } from "@/components/search/search-form";

const navigationItems = [
  { href: "/", label: "홈" },
  { href: "/tags", label: "태그" },
  { href: "/feed", label: "RSS" },
  { href: "https://github.com/chaesunbak", label: "GitHub", external: true },
];

export function SiteHeader() {
  return (
    <header className="max-w-6xl w-full mx-auto pt-5 sm:pt-7 lg:pt-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <Link
              href="/"
              className="inline-block text-lg font-semibold  text-slate-500 transition-colors hover:text-slate-950 "
            >
              chaesunbak 님의 블로그
            </Link>
          </div>

          <SearchForm className="w-full lg:max-w-md lg:self-start" />
        </div>

        <nav
          aria-label="전역 메뉴"
          className="flex border-b flex-wrap items-center gap-2 font-medium text-slate-600 "
        >
          {navigationItems.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="hover:underline p-2"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className=" hover:underline  p-2"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
