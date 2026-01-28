export default function BlogDetailLoading() {
  return (
    <div className="pt-16">
      <section
        className={[
          "omni-bg-overlay py-14",
          "bg-[url('/images/backgrounds/blogs-news-bg.jpg.jpg')] bg-cover bg-center bg-no-repeat",
        ].join(" ")}
      >
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="omni-glass p-6 sm:p-8">
            <div className="h-4 w-32 rounded bg-white/10 border border-white/15 animate-pulse" />
            <div className="mt-4 h-10 w-5/6 rounded bg-white/10 border border-white/15 animate-pulse" />
            <div className="mt-10 aspect-[16/9] rounded-2xl bg-white/10 border border-white/15 animate-pulse" />
            <div className="mt-10 space-y-3">
              <div className="h-4 w-full rounded bg-white/10 border border-white/15 animate-pulse" />
              <div className="h-4 w-11/12 rounded bg-white/10 border border-white/15 animate-pulse" />
              <div className="h-4 w-10/12 rounded bg-white/10 border border-white/15 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

