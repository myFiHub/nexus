import { AppLink } from "app/components/AppLink";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of service for Podium",
};

export default function TermsPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <p className="text-[var(--muted-foreground)] mb-8">
        This page is a placeholder. Replace with your full terms of service.
      </p>
      <AppLink href="/" className="text-[var(--primary)] font-medium hover:underline">
        Back to home
      </AppLink>
    </div>
  );
}
