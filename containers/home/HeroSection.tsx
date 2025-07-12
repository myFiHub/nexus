import { AppLink } from "../../components/AppLink";
import { AppPages } from "../../lib/routes";

export function HeroSection() {
  return (
    <div className="flex flex-col items-center text-center w-full">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 -z-10" />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-[var(--primary)] via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
          Support What Interests You
        </h1>

        <p className="text-xl md:text-2xl text-[var(--muted-foreground)] mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          A frontier where creators and supporters build value together through
          shared ownership and goals.
        </p>
        {/* Social proof */}
        <div className="flex items-center justify-center gap-4 text-sm text-[var(--muted-foreground)] mb-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 border-2 border-white"
              />
            ))}
          </div>
          <span className="font-medium">Join 100+ creators and supporters</span>
        </div>
        <div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-4 ">
            <AppLink
              href={`${AppPages.users}/top_accounts`}
              variant="default"
              size="default"
              className="bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Discover Creators
            </AppLink>
            <AppLink
              href={AppPages.createOutpost}
              variant="outline"
              size="default"
              className="border-2 border-[var(--primary)] text-[var(--primary)] px-8 py-4 rounded-full text-lg font-bold hover:bg-[var(--primary)] hover:text-white transition-all duration-200 hover:scale-105 backdrop-blur-sm"
            >
              Start Your Outpost
            </AppLink>
          </div>
          <AppLink
            href={AppPages.allOutposts}
            className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold hover:text-purple-600 text-lg group transition-colors duration-200 mb-12"
          >
            <span>View All Outposts</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              &rarr;
            </span>
          </AppLink>
        </div>
      </div>
    </div>
  );
}
