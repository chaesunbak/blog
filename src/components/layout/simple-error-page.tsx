"use client";

const SimpleErrorPage = () => {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = "/";
  };

  return (
    <main className="site-frame flex min-h-[calc(100vh-12rem)] items-center justify-center py-16">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="space-y-2">
          <p className="text-lg font-medium">존재하지 않는</p>
          <p className="text-lg font-medium">페이지입니다.</p>
        </div>

        <button
          type="button"
          onClick={handleBack}
          className="rounded-full border px-4 py-2 text-sm transition-colors hover:bg-muted"
        >
          이전페이지
        </button>
      </div>
    </main>
  );
};

export { SimpleErrorPage };
