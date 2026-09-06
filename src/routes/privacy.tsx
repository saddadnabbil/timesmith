import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/privacy")({ component: Privacy });

function Privacy() {
  return (
    <LegalPage
      eyebrow="Your data"
      title="Privacy Policy"
      intro="Timesmith works in guest mode by default. You can practice without creating an account, and connecting an account is always optional."
    >
      <section>
        <h2>What we collect</h2>
        <p>
          In guest mode, your profile name, settings, practice history, and progress stay in your
          browser on this device.
        </p>
        <p>
          If you choose to sign in, we receive the basic account information supplied by your
          sign-in provider, such as your name, email address, and account identifier.
        </p>
      </section>
      <section>
        <h2>How your data is used</h2>
        <ul>
          <li>To save and restore your learning progress across devices.</li>
          <li>To operate sign-in and keep your account secure.</li>
          <li>To publish a display name and verified score on the leaderboard.</li>
        </ul>
        <p>Your email address is never displayed on the public leaderboard.</p>
      </section>
      <section>
        <h2>Storage and third parties</h2>
        <p>
          Guest progress uses browser storage. Account sign-in is handled by the provider you
          select, and their own privacy terms also apply. Signed-in progress and ranked results may
          be stored by Timesmith's hosting and database providers.
        </p>
      </section>
      <section>
        <h2>Your choices</h2>
        <p>
          You can continue as a guest, disconnect your account, or clear guest data through your
          browser settings. Avoid using personal information in your public display name.
        </p>
      </section>
      <section>
        <h2>Changes to this policy</h2>
        <p>
          We may update this policy as Timesmith evolves. The effective date above will change
          whenever the policy is materially revised.
        </p>
      </section>
    </LegalPage>
  );
}
