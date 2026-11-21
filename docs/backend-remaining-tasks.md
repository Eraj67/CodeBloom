# Backend remaining tasks

Checklist of backend work still outstanding, based on the current `backend/` code, `docs/HLD-backend.md`, and open PR #25. Last reviewed: 2026-11-22.

## High priority

- [ ] Add an API deployment path: Dockerfile plus a CI pipeline that runs tests, builds, applies migrations, and deploys. Only the frontend Pages workflow (`.github/workflows/static.yml`) exists today.
- [ ] Add `SHADOW_DATABASE_URL` to `backend/.env.example`.
- [ ] Reconcile `backend/README.md` (uses `db:push`) with the committed-migration workflow required by `docs/HLD-backend.md`.
- [ ] Finish email verification end to end. PR #25 adds the schema only; still needed: a migration that backfills existing users, token generation and storage, a verification endpoint, and email delivery.
- [ ] Add password reset (token generation, email delivery, reset endpoint).
- [ ] Add refresh tokens and rotation.
- [ ] Add role-based authorization. Auth is currently binary in `backend/src/middleware/auth.middleware.ts`.
- [ ] Add account lockout after repeated failed login attempts.
- [ ] Add CSRF protection for production `SameSite=None` cookies (`backend/src/middleware/auth.middleware.ts:50`).
- [ ] Seed lesson content (`backend/prisma/seed.ts:154`); lessons currently render a "coming soon" fallback.
- [ ] Flesh out challenges: the model only has `id`, `title`, `level` (`backend/prisma/schema.prisma:54-58`); add description, requirements, starter code, hints and solution, plus list/detail endpoints.
- [ ] Add course search, categories, and difficulty fields/filters advertised in the README but absent from the schema and `backend/src/services/course.service.ts`.

## Medium priority

- [ ] Replace local-disk avatar storage with object storage (`backend/src/lib/multer.ts:5`) and move rate limits out of process memory (`backend/src/routes/auth.routes.ts:18`, `backend/src/routes/contact.routes.ts:8`).
- [ ] Make CORS configurable for multiple origins (`backend/src/app.ts:17`) and set `TRUST_PROXY=1` behind a proxy (`backend/src/config/env.ts:15`).
- [ ] Add audit logging and request correlation IDs; currently only `console.error` in error handling.
- [ ] Add uncomplete/delete-progress endpoints and pagination for progress and courses (`backend/src/routes/progress.routes.ts`, `backend/src/services/course.service.ts`).
- [ ] Fix avatar lifecycle: clear `avatarUrl` without leaving orphaned files (`backend/src/services/profile.service.ts:18`), delete the old file only after the DB update succeeds, and rate-limit uploads.
- [ ] Harden signup against the duplicate-check race and map `P2002` to a 409 instead of a generic 500 (`backend/src/services/auth.service.ts:28`, `backend/src/middleware/error.middleware.ts:41`).
- [ ] Pin JWT algorithms, issuer, and audience; validate `JWT_EXPIRES_IN` instead of silently falling back to 7 days (`backend/src/config/env.ts:9`).
- [ ] Stop building absolute avatar URLs from the Host header (`backend/src/routes/profile.routes.ts:46`).
- [ ] Validate uploaded file content rather than trusting client-supplied MIME metadata (`backend/src/lib/multer.ts:22`) and restrict file extensions derived from the original filename.
- [ ] Add delivery retries/outbox for contact emails and make the sender domain configurable (`backend/src/services/contact.service.ts:20`).
- [ ] Make the seed idempotent for lessons and recompute the denormalized `totalLessons` on updates (`backend/prisma/seed.ts:141`).

## Tests

- [ ] Add E2E and live-DB tests covering migrations, seed, uniqueness constraints, and transactions (`test-preferences.json:5` has `e2eTool: none`).
- [ ] Add contact route and validator tests; only the service is covered today.
- [ ] Cover `GET /profile/stats`, `GET /progress`, and `POST /progress/challenges/:challengeId/complete`.
- [ ] Cover cookie flags/expiry parsing (`setAuthCookie`, `clearAuthCookie`, `expiresInToMs`).
- [ ] Cover signup, password-change, and contact rate limiters (only login is tested).
- [ ] Add a route test for the upload size limit and tests for `backend/src/config/env.ts`.
- [ ] Add a coverage gate/provider (`backend/vitest.config.mts`, `test-preferences.json:3`).
- [ ] Remove the dead `realHash` placeholder in `backend/tests/services/auth.service.test.ts:78`.

## Docs

- [ ] Refresh `docs/HLD-backend.md`: status is still `DRAFT`, the baseline commit is stale, G2/G3 are marked resolved despite the header saying "uncommitted", and the "fully implemented" claim contradicts the gap list.
- [ ] Correct HLD test-tooling details: config lives in `backend/vitest.config.mts`, not `test-preferences.json`, and there are 14 `*.test.ts` files, not 15.
- [ ] Correct the HLD description of avatar deletion order (`docs/HLD-backend.md:247`).
- [ ] Update `backend/README.md` endpoint list: it omits `/auth/password`, `/profile/stats`, `/profile/avatar`, and all `/courses*` routes.
- [ ] Fix root `README.md`: remove the nonexistent `backend/controllers/` directory and the claims about course search/categories/difficulty and challenge content.
- [ ] Close the unclosed code fence in the PR #25 description.
