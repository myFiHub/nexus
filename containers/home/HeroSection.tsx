import { AppLink } from "../../components/AppLink";

export function HeroSection() {
  return (
    <div className="flex flex-col items-center text-center max-w-3xl w-full mx-auto mb-12">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-[var(--primary)]">
        Support What Interests You
      </h1>
      <p className="text-lg md:text-xl text-[var(--muted-foreground)] mb-8">
        A frontier where creators and supporters build value together through
        shared ownership and goals.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <AppLink
          href="/discover"
          variant="default"
          size="default"
          className="bg-[var(--primary)] text-white px-6 py-2 rounded-full text-lg font-semibold shadow-md hover:bg-[var(--primary-hover)] transition"
        >
          Discover Creators
        </AppLink>
        <AppLink
          href="/create_outpost"
          variant="outline"
          size="default"
          className="border-[var(--primary)] text-[var(--primary)] px-6 py-2 rounded-full text-lg font-semibold hover:bg-[var(--primary)] hover:text-white transition"
        >
          Start Your Outpost
        </AppLink>
      </div>
    </div>
  );
}
