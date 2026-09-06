# Timesmith release guide

Timesmith uses the same immutable-release discipline as VisionOps: verify a
clean commit, deploy the exact commit, tag it, publish release notes, and keep a
known-good tag for rollback.

## Release gate

```bash
npm ci
npm run lint
npm run typecheck
npm run test:timesmith
npm run test:ui
npm run build
```

Confirm the production environment is configured using
[`docs/PRODUCTION.md`](docs/PRODUCTION.md). Never create a release while Google
OAuth, the database, or the custom domain health check is failing.

## Release sequence

1. Merge the reviewed release commit into `main`.
2. Confirm the `Quality gate` job passes, then deploy the exact release commit
   from an authenticated Wrangler session. The manual `Deploy production`
   workflow can take over after `CLOUDFLARE_API_TOKEN` is added to GitHub's
   `production` environment.
3. Smoke-test Home, Practice, one completed drill, Progress, League, and Google
   sign-in on the production domain.
4. Create an annotated semantic-version tag from that exact commit and push it.
5. The tag workflow re-runs the quality gate and creates the GitHub Release.

```bash
git tag -a v1.0.0 -m "Timesmith v1.0.0"
git push origin v1.0.0
```

## Rollback

Deploy the previous known-good tag. Database migrations must remain backward
compatible; use expand/migrate/contract for destructive schema changes.
