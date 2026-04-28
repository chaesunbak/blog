import Link from "next/link";

const footerLinks = [
  { href: "/", label: "홈" },
  { href: "/tags", label: "태그" },
  { href: "/feed", label: "RSS" },
  { href: "https://github.com/chaesunbak", label: "GitHub" },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mx-auto w-full max-w-6xl py-6 pt-10 pb-8 sm:pt-14 sm:pb-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-lg font-semibold tracking-[-0.04em] text-slate-800">
            chaesunbak 님의 블로그
          </p>
        </div>

        <div className="flex flex-col gap-4 text-sm text-slate-500 sm:text-base lg:items-end">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {footerLinks.map((link) => {
              const isExternal = link.href.startsWith("http");

              return isExternal ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-slate-900"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-slate-900"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <p>© {currentYear} chaesunbak. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
