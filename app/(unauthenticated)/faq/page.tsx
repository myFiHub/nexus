import { AppLink } from "app/components/AppLink";

export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Podium and passes",
};

export default function FAQPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-8 text-[var(--muted-foreground)]">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            What is a Room (Outpost)?
          </h2>
          <p>
            A Room (we also call it an Outpost) is a live audio space where
            creators host conversations and listeners can join, react, and
            support. You can discover live and upcoming rooms on the home page.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Do I need crypto to use Podium?
          </h2>
          <p>
            No. You can sign in with social login (e.g. Google, email) and join
            public rooms without a wallet. Connecting a wallet and owning Passes
            are optional—for pass-gated rooms and rewards.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            What is a Pass?
          </h2>
          <p>
            A Pass is a creator&apos;s membership token. Owning one grants
            access to their pass-gated rooms and perks. Some rooms are
            public; others require a Pass to enter or speak.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            How do reminders work?
          </h2>
          <p>
            For upcoming rooms, you can click &quot;Remind me&quot; and choose
            when to be notified (e.g. 15 minutes before or when it starts). We
            send you a notification so you don&apos;t miss the room.
          </p>
        </section>
      </div>
      <p className="mt-12">
        <AppLink href="/" className="text-[var(--primary)] font-medium hover:underline">
          Back to home
        </AppLink>
      </p>
    </div>
  );
}
