# Production setup

Production runs on Cloudflare Pages at
<https://timesmith.saddadnabbil.my.id>. The Pages project is `timesmith` in the
Cloudflare account documented in the repository settings.

## 1. Cloudflare Pages variables and secrets

Configure these for the **Production** environment in Cloudflare Pages. Never
commit their values.

| Name                   | Required                      | Purpose                                      |
| ---------------------- | ----------------------------- | -------------------------------------------- |
| `BETTER_AUTH_URL`      | Yes                           | `https://timesmith.saddadnabbil.my.id`       |
| `BETTER_AUTH_SECRET`   | Yes                           | Random secret of at least 32 bytes           |
| `GOOGLE_CLIENT_ID`     | Yes                           | Google OAuth web client ID                   |
| `GOOGLE_CLIENT_SECRET` | Yes                           | Google OAuth web client secret               |
| `DATABASE_URL`         | Yes                           | Pooled TLS PostgreSQL/Neon connection string |
| `RESEND_API_KEY`       | When email notifications ship | Server-only Resend key                       |

Generate `BETTER_AUTH_SECRET` using a cryptographically secure password
generator. Do not reuse the Google client secret or a personal password.

The GitHub `production` environment also needs `DATABASE_URL` for migrations,
plus `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` for deployment.

## 2. Google OAuth production client

In Google Cloud Console:

1. Create or select the portfolio project.
2. Configure the OAuth consent screen and application name `Timesmith`.
3. Add the production domain to **Authorized domains**.
4. Create an **OAuth client ID** with application type **Web application**.
5. Add this exact authorized JavaScript origin:

   `https://timesmith.saddadnabbil.my.id`

6. Add this exact authorized redirect URI:

   `https://timesmith.saddadnabbil.my.id/api/auth/oauth2/callback/google`

7. Store the client ID and secret in Cloudflare Pages; do not put them in a
   `VITE_` variable because that would expose them to browsers.

If the consent screen is in Testing, add the intended Google accounts as test
users. For public portfolio access, complete the consent-screen publication
requirements before announcing the release.

## 3. Domain and DNS

The custom hostname must remain attached to the `timesmith` Pages project and
serve a valid Cloudflare-managed TLS certificate. Keep the canonical production
URL consistent in `BETTER_AUTH_URL`, Google OAuth, GitHub environment URL, and
the README.

## 4. Production verification

- `/` returns the Timesmith application over HTTPS.
- `/privacy` and `/terms` render successfully.
- Google sign-in returns to Timesmith and the profile remains after refresh.
- A signed-in drill can sync progress and submit one verified leaderboard run.
- Guest practice remains usable when authentication is unavailable.
- The Open Graph image and favicon load from the custom domain.

After verification, record the commit SHA, tag, deployment URL, and any known
limitations in the GitHub Release notes.
