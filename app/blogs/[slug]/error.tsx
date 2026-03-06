"use client";

export default function BlogDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="pt-14 sm:pt-16 min-w-0 overflow-x-hidden">
      <section
        className={[
          "omni-bg-overlay py-6 sm:py-10 md:py-14",
          "bg-[url('/images/backgrounds/blogs-news-bg.jpg.jpg')] bg-cover bg-center bg-no-repeat",
        ].join(" ")}
      >
        <div className="relative z-10 max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="omni-glass p-5 sm:p-6 md:p-8 text-center rounded-xl sm:rounded-2xl">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-50 break-words">
              Couldn’t load this blog
            </h1>
            <p className="mt-3 text-white/85">Please try again.</p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-olive-800 transition-colors [@media(hover:hover)]:hover:bg-white/90"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

