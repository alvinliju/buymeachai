import Link from "next/link"
import { Github } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-dvh bg-white text-gray-900">
      {/* Top badge: test deployment note */}
      <div className="px-4 pt-6">
        <div className="mx-auto max-w-3xl flex justify-center">
          {/* Test deployment badge (not under development) */}
          <span className="px-3 py-1 rounded-full text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200">
            Test deployment · Minimal preview
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 py-20 md:py-28 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
          Buy Me A <span className="text-orange-500">Chai</span> ☕
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-pretty">
          A minimal, elegant way for creators to receive support — made with native UPI for India and proudly
          open‑source.
        </p>

        {/* Badges */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="px-3 py-1 rounded-full text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200">
            Native UPI · India
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200">
            Open‑source
          </span>
        </div>

        {/* CTAs (kept simple and minimal) */}
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-10">
          {/* Keep neutral button styling to align with minimal aesthetic */}
          <Link
            href="/dashboard"
            className="px-5 md:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            aria-label="Go to dashboard"
          >
            Get started
          </Link>
          <Link
            href="https://github.com/yourusername/buymeachai"
            className="px-5 md:px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            aria-label="View project on GitHub"
          >
            View on GitHub
          </Link>
        </div>

        {/* Open Source mention with icon */}
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Github className="w-5 h-5" aria-hidden="true" />
          <span className="text-sm">MIT‑licensed · Community‑driven</span>
        </div>
      </section>

      {/* Why we built it */}
      <section id="why" className="max-w-3xl mx-auto px-4 pb-16 md:pb-24">
        <div className="rounded-lg border border-gray-200 bg-white/80 p-6 md:p-8 text-center">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">Why we built it</h2>
          <p className="text-gray-600 leading-relaxed text-pretty">
            We wanted a simple, elegant way for creators and developers in India to receive support without heavy
            tooling. Native UPI keeps it fast and familiar. Keeping it open‑source makes it transparent and easy to
            extend.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">Made with native UPI support · India</p>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="https://github.com/yourusername/buymeachai"
              className="text-orange-600 hover:text-orange-700 font-medium"
              aria-label="Open-source repository on GitHub"
            >
              Open‑source
            </Link>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">MIT License</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
