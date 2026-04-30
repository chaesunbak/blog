import Link from 'next/link';
import { SearchForm } from '@/components/search/search-form';

const navigationItems = [
  { href: '/', label: '홈' },
  { href: '/tags', label: '태그' },
  { href: '/guestbook', label: '방명록' },
  { href: '/feed', label: 'RSS' },
  { href: 'https://github.com/chaesunbak', label: 'GitHub', external: true },
];

export function SiteHeader() {
  return (
    <header className="mx-auto w-full max-w-6xl pt-5 sm:pt-7 lg:pt-8">
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between px-2">
          <Link
            href="/"
            className="inline-block text-lg font-semibold text-slate-500 transition-colors hover:text-slate-950"
          >
            chaesunbak 님의 블로그
          </Link>
          <SearchForm className="w-full lg:max-w-sm" />
        </div>

        <nav
          aria-label="전역 메뉴"
          className="flex flex-wrap items-center gap-2 border-b font-medium text-slate-600"
        >
          {navigationItems.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="p-2 hover:underline"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="p-2 hover:underline"
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
