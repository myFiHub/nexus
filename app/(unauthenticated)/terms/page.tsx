import { AppLink } from "app/components/AppLink";

export const metadata = {
  title: "End User License Agreement",
  description: "Podium End User License Agreement (EULA)",
};

export default function TermsPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">
        PODIUM END USER LICENSE AGREEMENT
      </h1>

      <h2 className="text-xl font-semibold mb-3">1. INTRODUCTION</h2>
      <p className="text-muted-foreground mb-4">
        This End User License Agreement (&quot;EULA&quot;) is a binding legal
        agreement between you (&quot;End User,&quot; &quot;you&quot; or
        &quot;your&quot;) and FiHUB DAO LLC (&quot;Podium,&quot; &quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) for the Podium software application
        (&quot;App&quot;). This EULA governs your use of the App and all related
        services.
      </p>
      <p className="mb-4 font-semibold uppercase text-foreground text-sm">
        This agreement is solely between you and FiHUB DAO LLC, not Apple, Inc.
        FiHUB DAO LLC, not Apple, is solely responsible for the App and its
        content.
      </p>
      <p className="text-muted-foreground mb-8">
        By downloading, installing, accessing, or using the App, you agree to be
        bound by the terms of this EULA. If you do not agree to these terms, you
        must not download, install, access, or use the App.
      </p>

      <h2 className="text-xl font-semibold mb-3">
        2. USER-GENERATED CONTENT POLICY
      </h2>
      <p className="text-muted-foreground mb-4">
        Podium facilitates live audio conversations (&quot;Outposts&quot;) where
        users can participate in discussions. All content created, shared, or
        transmitted through the App constitutes &quot;User-Generated
        Content.&quot;
      </p>

      <h3 className="text-lg font-semibold mb-2">2.1 ZERO TOLERANCE FOR OBJECTIONABLE CONTENT</h3>
      <p className="mb-3 font-semibold uppercase text-foreground text-sm">
        Podium has zero tolerance for objectionable content or abusive users.
      </p>
      <p className="text-muted-foreground mb-2">Prohibited content includes, but is not limited to:</p>
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
        <li>
          Hate speech, discrimination, or content that promotes intolerance
          based on race, ethnicity, national origin, religion, gender, gender
          identity, sexual orientation, age, disability, or medical condition
        </li>
        <li>Harassment, bullying, intimidation, or threats against any individual or group</li>
        <li>Explicit sexual content, pornography, or sexually exploitative material</li>
        <li>Graphic violence or content that glorifies violence</li>
        <li>Illegal activities, including promotion of illegal drugs, fraud, or theft</li>
        <li>Personal, private, or confidential information of others without consent</li>
        <li>Deliberate misinformation or content intended to mislead others</li>
        <li>Content that infringes on intellectual property rights</li>
        <li>Spam, scams, or deceptive practices</li>
      </ul>

      <h3 className="text-lg font-semibold mb-2">2.2 CONTENT MODERATION</h3>
      <p className="text-muted-foreground mb-3">
        Podium employs the following methods to maintain a safe environment:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
        <li>
          <span className="font-medium text-foreground">User Reporting System:</span>{" "}
          The App includes a mechanism for users to flag objectionable content
          through the feedback/report feature accessible during any conversation.
        </li>
        <li>
          <span className="font-medium text-foreground">User Control Measures:</span>{" "}
          Users can exit any conversation they find objectionable and can report
          users who engage in prohibited behavior.
        </li>
        <li>
          <span className="font-medium text-foreground">Content Review:</span>{" "}
          Podium will review all reports of objectionable content within 24 hours.
        </li>
        <li>
          <span className="font-medium text-foreground">Enforcement Actions:</span>{" "}
          Podium may remove reported content, issue warnings, temporarily
          suspend, or permanently ban users who violate this EULA.
        </li>
      </ul>

      <h3 className="text-lg font-semibold mb-2">2.3 BLOCKING ABUSIVE USERS</h3>
      <p className="text-muted-foreground mb-4">
        Podium&apos;s platform provides mechanisms to protect users from abusive
        behavior:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
        <li>Users can select which conversations to join based on topics and hosts.</li>
        <li>
          The audience-driven moderation system allows users to collectively
          reduce speaking time for disruptive participants.
        </li>
        <li>Users can report abusive participants through the report feature.</li>
        <li>Hosts can remove disruptive participants from conversations.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">3. LICENSE GRANT</h2>
      <p className="text-muted-foreground mb-8">
        Subject to your compliance with this EULA, Podium grants you a limited,
        non-exclusive, non-transferable, revocable license to download, install,
        and use the App for your personal, non-commercial purposes on devices
        you own or control.
      </p>

      <h2 className="text-xl font-semibold mb-3">4. RESTRICTIONS ON USE</h2>
      <p className="text-muted-foreground mb-3">
        You agree not to, and will not permit others to:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
        <li>
          License, sell, rent, lease, assign, distribute, transmit, host,
          outsource, disclose, or otherwise commercially exploit the App
        </li>
        <li>
          Modify, make derivative works of, disassemble, decrypt, reverse
          compile, or reverse engineer any part of the App
        </li>
        <li>
          Remove, alter, or obscure any proprietary notice of Podium or its
          affiliates, partners, suppliers, or licensors
        </li>
        <li>
          Use the App to transmit viruses, worms, defects, Trojan horses, or any
          items of a destructive nature
        </li>
        <li>
          Use the App in any manner that could damage, disable, overburden, or
          impair Podium systems or networks
        </li>
        <li>Use any robot, spider, or other automatic device to access the App</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">5. MAINTENANCE AND SUPPORT</h2>
      <p className="text-muted-foreground mb-8">
        Podium, not Apple, is solely responsible for providing maintenance and
        support services for the App. Apple has no obligation to furnish any
        maintenance and support services with respect to the App.
      </p>

      <h2 className="text-xl font-semibold mb-3">6. INTELLECTUAL PROPERTY</h2>
      <p className="text-muted-foreground mb-8">
        All rights, title, and interest in and to the App (excluding
        User-Generated Content), including all intellectual property rights,
        are and will remain the exclusive property of Podium. User-Generated
        Content remains the intellectual property of the creating user, subject
        to the license granted to Podium to host, store, transfer, and display
        the User-Generated Content.
      </p>

      <h2 className="text-xl font-semibold mb-3">7. TERM AND TERMINATION</h2>
      <p className="text-muted-foreground mb-8">
        This EULA is effective until terminated by you or Podium. Your rights
        under this EULA will terminate automatically without notice if you fail
        to comply with any term of this EULA. Upon termination, you must cease
        all use of the App and delete all copies.
      </p>

      <h2 className="text-xl font-semibold mb-3">8. LIABILITY AND WARRANTIES</h2>
      <h3 className="text-lg font-semibold mb-2">8.1 DISCLAIMER OF WARRANTIES</h3>
      <p className="mb-4 font-semibold uppercase text-foreground text-sm">
        The App is provided &quot;as is&quot; and &quot;as available&quot;
        without warranty of any kind. Podium disclaims all warranties, express
        or implied, including but not limited to implied warranties of
        merchantability, fitness for a particular purpose, and
        non-infringement.
      </p>
      <h3 className="text-lg font-semibold mb-2">8.2 LIMITATION OF LIABILITY</h3>
      <p className="mb-8 font-semibold uppercase text-foreground text-sm">
        To the maximum extent permitted by applicable law, in no event shall
        Podium be liable for any incidental, special, indirect, or consequential
        damages arising out of or relating to this EULA or your use or
        inability to use the App.
      </p>

      <h2 className="text-xl font-semibold mb-3">9. THIRD-PARTY TERMS</h2>
      <p className="text-muted-foreground mb-8">
        You acknowledge that you must comply with applicable third-party terms
        of agreement when using the App (e.g., you must not be in violation of
        your wireless data service agreement when using the App).
      </p>

      <h2 className="text-xl font-semibold mb-3">10. THIRD-PARTY BENEFICIARY</h2>
      <p className="text-muted-foreground mb-8">
        You acknowledge and agree that Apple and its subsidiaries are
        third-party beneficiaries of this EULA. Upon your acceptance of this
        EULA, Apple will have the right (and will be deemed to have accepted
        the right) to enforce this EULA against you as a third-party
        beneficiary.
      </p>

      <h2 className="text-xl font-semibold mb-3">11. LEGAL COMPLIANCE</h2>
      <p className="text-muted-foreground mb-8">
        You represent and warrant that you are not located in a country subject
        to a U.S. Government embargo or designated as a &quot;terrorist
        supporting&quot; country and are not listed on any U.S. Government list
        of prohibited or restricted parties.
      </p>

      <h2 className="text-xl font-semibold mb-3">12. GOVERNING LAW</h2>
      <p className="text-muted-foreground mb-8">
        This EULA is governed by the laws of the State of Wyoming without regard
        to its conflict of law provisions.
      </p>

      <h2 className="text-xl font-semibold mb-3">13. CONTACT INFORMATION</h2>
      <p className="text-muted-foreground mb-4">
        If you have any questions about this EULA, please contact us at:
      </p>
      <p className="text-muted-foreground mb-2">FiHUB DAO, LLC</p>
      <p className="text-muted-foreground mb-8">
        <a
          href="mailto:web3podium@gmail.com"
          className="text-primary font-medium hover:underline"
        >
          web3podium@gmail.com
        </a>
      </p>

      <p className="text-muted-foreground mb-8">
        By downloading, installing, or using the App, you acknowledge that you
        have read this EULA, understand it, and agree to be bound by its terms
        and conditions.
      </p>

      <AppLink href="/" className="text-primary font-medium hover:underline">
        Back to home
      </AppLink>
    </div>
  );
}
