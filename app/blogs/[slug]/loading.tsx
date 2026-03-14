export default function BlogDetailLoading() {
  return (
    <div className="pt-14 sm:pt-16 min-w-0 w-full overflow-x-hidden max-w-[100vw]">
      <section className="min-h-screen w-full bg-white py-6 sm:py-10 md:py-14 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 w-full min-w-0 flex justify-center">
          <div className="w-full max-w-4xl min-w-0">
            <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
            <div className="mt-4 h-10 w-3/4 max-w-2xl rounded bg-gray-200 animate-pulse" />
            <div className="mt-8 aspect-[16/9] w-full rounded-lg bg-gray-200 animate-pulse" />
            <div className="mt-8 space-y-3 w-full">
              <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-11/12 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-10/12 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

