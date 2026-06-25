"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <main className="flex min-h-screen items-center justify-center px-6 text-center">
          <div className="max-w-xl rounded-3xl border border-white/10 bg-gray-900 p-8">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-green-500">Error 500</p>
            <h1 className="mt-4 font-serif text-4xl font-bold">Something Went Wrong</h1>
            <p className="mt-4 text-gray-300">The site could not finish loading. No private error details have been displayed.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={reset} className="rounded-xl bg-green-600 px-6 py-3 font-bold text-black">Try Again</button>
              <button type="button" onClick={() => window.location.assign("/")} className="rounded-xl border border-white/20 px-6 py-3 font-bold">Back Home</button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
