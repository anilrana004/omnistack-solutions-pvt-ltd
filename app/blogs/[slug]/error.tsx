"use client";

export default function BlogDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error; // Required by Next.js error boundary; not displayed in UI
  return (
    <div className="pt-14 sm:pt-16 min-w-0 w-full overflow-x-hidden max-w-[100vw]">
      <section className="min-h-screen w-full bg-white py-8 sm:py-10 md:py-14 px-4 sm:px-6 lg:px-10">
        <div className="relative z-10 w-full min-w-0 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">
            Couldn’t load this blog
          </h1>
          <p className="mt-3 text-gray-600">Please try again.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-olive-600 px-6 py-3 text-sm font-semibold text-white transition-colors [@media(hover:hover)]:hover:bg-olive-700"
          >
            Retry
          </button>
        </div>
      </section>
    </div>
  );
}

