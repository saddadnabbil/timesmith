import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/terms")({ component: Terms });

function Terms() {
  return (
    <LegalPage
      eyebrow="Play fair"
      title="Terms of Use"
      intro="These terms keep Timesmith welcoming, useful, and fair for everyone who practices or joins the leaderboard."
    >
      <section>
        <h2>Using Timesmith</h2>
        <p>
          You may use Timesmith for personal learning and practice. You are responsible for activity
          performed through your connected account.
        </p>
      </section>
      <section>
        <h2>Leaderboard conduct</h2>
        <p>
          Do not manipulate scores, automate answers, impersonate another person, or use an
          offensive display name. Results that compromise a fair leaderboard may be removed.
        </p>
      </section>
      <section>
        <h2>Accounts and availability</h2>
        <p>
          An account is optional. Features may change, pause, or be discontinued, and uninterrupted
          availability is not guaranteed. Keep a local copy of anything you consider important.
        </p>
      </section>
      <section>
        <h2>Educational purpose</h2>
        <p>
          Timesmith is a practice tool and does not replace professional teaching, assessment, or
          academic advice. The service is provided as available without warranties of a particular
          learning outcome.
        </p>
      </section>
      <section>
        <h2>Updates</h2>
        <p>
          We may revise these terms as the product changes. Continuing to use Timesmith after an
          update means you accept the revised terms.
        </p>
      </section>
    </LegalPage>
  );
}
