export default function BlogsLoading() {
  return (
    <div className="pt-16">
      <section
        className={[
          "omni-bg-overlay py-20 text-white",
          "bg-[url('/images/backgrounds/blogs-news-bg.jpg.jpg')] bg-cover bg-center bg-no-repeat",
        ].join(" ")}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-10 w-72 mx-auto rounded-xl bg-white/10 border border-white/15 animate-pulse" />
          <div className="mt-6 h-5 w-[min(36rem,90%)] mx-auto rounded-lg bg-white/10 border border-white/15 animate-pulse" />
        </div>
      </section>

      <section
        className={[
          "omni-bg-overlay py-20",
          "bg-[url('/images/backgrounds/blogs-news-bg.jpg.jpg')] bg-cover bg-center bg-no-repeat",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="omni-glass-card overflow-hidden">
                <div className="aspect-[16/9] bg-white/10 border-b border-white/15 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-24 rounded bg-white/10 border border-white/15 animate-pulse" />
                  <div className="h-6 w-3/4 rounded bg-white/10 border border-white/15 animate-pulse" />
                  <div className="h-4 w-full rounded bg-white/10 border border-white/15 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-white/10 border border-white/15 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

