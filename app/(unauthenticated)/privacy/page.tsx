import { AppLink } from "app/components/AppLink";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Podium",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">
        This Privacy Policy describes how Podium (&quot;we&quot;, &quot;us&quot;, or
        &quot;our&quot;) collects, uses, and shares personal information when you use
        our mobile application (the &quot;App&quot;).
      </p>

      <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
      <p className="text-muted-foreground mb-4">
        We may collect the following types of personal information when you use the
        App:
      </p>
      <ul className="list-disc pl-6 space-y-3 text-muted-foreground mb-8">
        <li>
          <span className="font-medium text-foreground">
            Information You Provide:
          </span>{" "}
          We may collect information that you provide when you register an account,
          participate in discussions, or interact with other users on the App. This
          may include your username, email address, profile picture, and any other
          information you choose to provide.
        </li>
        <li>
          <span className="font-medium text-foreground">
            Usage Information:
          </span>{" "}
          We may automatically collect certain information about your device and how
          you use the App, such as your IP address, device type, operating system,
          and usage patterns.
        </li>
        <li>
          <span className="font-medium text-foreground">Audio Data:</span>{" "}
          When you participate in audio rooms or discussions on the App, we may
          collect audio recordings of your voice.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
      <p className="text-muted-foreground mb-4">
        We may use the information we collect for the following purposes:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
        <li>To provide and maintain the App;</li>
        <li>To personalize your experience and improve the App&apos;s features;</li>
        <li>
          To communicate with you, including responding to your inquiries and
          providing customer support;
        </li>
        <li>To analyze usage patterns and improve the performance of the App;</li>
        <li>To comply with legal obligations and enforce our policies.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">Sharing Your Information</h2>
      <p className="text-muted-foreground mb-4">
        We may share your personal information with third parties for the following
        purposes:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
        <li>
          With service providers who assist us in operating the App and providing
          services to you;
        </li>
        <li>
          With other users of the App as part of your interactions on the platform;
        </li>
        <li>
          With law enforcement authorities or government agencies in response to
          legal requests or to protect our rights or the rights of others.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">Data Retention</h2>
      <p className="text-muted-foreground mb-8">
        We will retain your personal information for as long as necessary to fulfill
        the purposes outlined in this Privacy Policy unless a longer retention period
        is required or permitted by law.
      </p>

      <h2 className="text-xl font-semibold mb-3">Children&apos;s Privacy</h2>
      <p className="text-muted-foreground mb-8">
        The App is not intended for children under the age of 13, and we do not
        knowingly collect personal information from children under this age. If you
        are a parent or guardian and believe that your child has provided us with
        personal information, please contact us immediately.
      </p>

      <h2 className="text-xl font-semibold mb-3">Your Choices</h2>
      <p className="text-muted-foreground mb-8">
        You can control the information we collect about you by adjusting your
        account settings or by contacting us directly. However, please note that some
        features of the App may not be available if you choose not to provide certain
        information.
      </p>

      <h2 className="text-xl font-semibold mb-3">Changes to This Privacy Policy</h2>
      <p className="text-muted-foreground mb-8">
        We may update this Privacy Policy from time to time, and any changes will be
        posted on this page. We encourage you to review this Privacy Policy
        periodically for updates.
      </p>

      <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
      <p className="text-muted-foreground mb-8">
        If you have any questions or concerns about this Privacy Policy or our
        privacy practices, please contact us at{" "}
        <a
          href="mailto:jomari.peterson@hajjmedia.com"
          className="text-primary font-medium hover:underline"
        >
          jomari.peterson@hajjmedia.com
        </a>
        .
      </p>

      <AppLink href="/" className="text-primary font-medium hover:underline">
        Back to home
      </AppLink>
    </div>
  );
}
