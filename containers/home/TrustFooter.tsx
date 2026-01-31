import { AppLink } from "app/components/AppLink";

const FAQ_PATH = "/faq";
const TERMS_PATH = "/terms";
const PRIVACY_PATH = "/privacy";
const HELP_PATH = "/faq";

export function TrustFooter() {
  return (
    <footer
      className="w-full py-12 mt-16 border-t border-[var(--border)]"
      role="contentinfo"
      aria-label="Trust and support"
    >
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Pass-gating and FAQ */}
        <section aria-labelledby="trust-heading">
          <h2
            id="trust-heading"
            className="text-lg font-semibold text-foreground mb-3"
          >
            Trust &amp; Safety
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed">
            Some rooms are pass-gated: you need a creator&apos;s Pass to enter
            or speak. Passes unlock access and perks. You do not need crypto to
            use Podium; wallet and passes are optional.
          </p>
          <AppLink
            href={FAQ_PATH}
            className="text-sm font-medium text-[var(--primary)] hover:underline"
          >
            Learn more about passes
          </AppLink>

          <dl className="mt-6 space-y-3 text-sm text-[var(--muted-foreground)]">
            <div>
              <dt className="font-medium text-foreground">Do I need crypto?</dt>
              <dd>
                No. You can sign in with social login and join public rooms
                without a wallet. Passes and wallet are optional for gated rooms
                and rewards.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">What is a Pass?</dt>
              <dd>
                A Pass is a creator&apos;s membership token. Owning one grants
                access to their pass-gated rooms and perks.{" "}
                <AppLink href={FAQ_PATH} className="text-[var(--primary)] hover:underline">
                  FAQ
                </AppLink>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">How do reminders work?</dt>
              <dd>
                For upcoming rooms, you can set a reminder. We notify you before
                the room starts (e.g. 15 minutes or when it starts). Manage
                reminders in your account.
              </dd>
            </div>
          </dl>
        </section>

        {/* Nav links */}
        <nav
          className="flex flex-wrap gap-6 text-sm"
          aria-label="Footer navigation"
        >
          <AppLink
            href={HELP_PATH}
            className="text-[var(--muted-foreground)] hover:text-foreground"
          >
            Help / FAQ
          </AppLink>
          <AppLink
            href={TERMS_PATH}
            className="text-[var(--muted-foreground)] hover:text-foreground"
          >
            Terms
          </AppLink>
          <AppLink
            href={PRIVACY_PATH}
            className="text-[var(--muted-foreground)] hover:text-foreground"
          >
            Privacy
          </AppLink>
        </nav>

        {/* Optional: Powered by Movement */}
        <p className="text-xs text-[var(--muted-foreground)]">
          Powered by Movement. Podium runs on secure, decentralized
          infrastructure.
        </p>
      </div>
    </footer>
  );
}
