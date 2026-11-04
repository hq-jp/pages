# AGENTS.md

HQ Pages serves a GCS bucket over HTTP from App Engine. Read `ARCHITECTURE.md` first for the request routing and the invariants.

## Setup and commands

Node is pinned in `.tool-versions` and managed with asdf. Packages use npm (`package-lock.json`).

```sh
asdf install
npm ci
npm run dev        # runs the app with tsx on PORT (default 8080)
npm run lint       # biome check (format + lint); this is the only CI check
npm run typecheck  # tsc --noEmit; not run in CI, run it yourself
npm run format     # biome check --write
```

`npm run dev` reads the real bucket named by `GCLOUD_STORAGE_BUCKET` (default `hq-pages`). It needs Application Default Credentials with read access (`gcloud auth application-default login`). There is no emulator or fake bucket.

There is no test suite. To check a routing change, run `npm run dev` and request a file path, a directory with `index.html`, a directory without one, a missing path, and a text file over 500 KB.

## Code style

- TypeScript in strict mode with `noUnusedLocals`, `noUnusedParameters`, and `noImplicitReturns`.
- Formatting and linting are owned by Biome (`biome.json`). Do not hand-format. Run `npm run format`.
- Modules use a single default export.
- `tsc` compiles in place, so `.js` files appear next to `.ts` files after a build. They are gitignored. Do not commit them.

## Things that are easy to break

- Pushing to `main` deploys to production. There is no staging.
- The Node major version is declared in three places. `.tool-versions` drives local development and `test.yml`, `app.yaml` drives App Engine, and `package.json` `engines` documents the supported major. Change them together.
- Production has no environment variables set. It runs on the defaults in the code, listed in `README.md`. Changing a default changes production.
- `.gcloudignore` includes `.gitignore`, so `.gitignore` also decides what `gcloud app deploy` uploads. Keep `node_modules/` and `src/**/*.js` in it.
- The app must stay read-only against GCS.
- Do not add `js` to the signed URL extension list in `main.ts`. See `ARCHITECTURE.md`.
- `upload/action.yml` is consumed by other repositories as `hq-jp/pages/upload@main`. Changing or removing an input breaks them. Its `rsync -d` deletes files, so never change the destination path logic casually.

## Commits and PRs

- Short imperative subject in English, for example `Use signed URL for large files only`.
- Run `npm run lint` and `npm run typecheck` before opening a PR.
- If you change routing, deployment, or the upload action, update `ARCHITECTURE.md` in the same PR.
