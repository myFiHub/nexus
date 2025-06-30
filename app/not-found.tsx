import { AppLink } from "app/components/AppLink";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-[var(--primary)] mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-[var(--muted-foreground)] mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <AppLink
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[var(--primary)] text-white rounded-full hover:bg-[var(--primary-hover)] transition-colors"
          >
            Go Home
          </AppLink>
          <AppLink
            href="/all_outposts"
            className="inline-flex items-center justify-center px-6 py-3 border border-[var(--primary)] text-[var(--primary)] rounded-full hover:bg-[var(--primary)] hover:text-white transition-colors"
          >
            Browse Outposts
          </AppLink>
        </div>
      </div>
    </div>
  );
}
