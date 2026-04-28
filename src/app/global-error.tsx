"use client";

import { SimpleErrorPage } from "@/components/layout/simple-error-page";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;

  return (
    <html lang="ko">
      <body className="bg-background text-foreground">
        <SimpleErrorPage />
      </body>
    </html>
  );
}
