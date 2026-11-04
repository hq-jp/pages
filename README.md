# HQ Pages

![](https://github.com/hq-jp/pages/workflows/Test/badge.svg)

> Internal document sharing system for [HQ](https://corp.hq-hq.co.jp).

## Deployment

Every push to `main` branch will deploy a new version of this app. Deploys happen automatically.

## Environment variables

All variables are optional. Production runs with the defaults.

| Name                    | Default    | Description                            |
| ----------------------- | ---------- | -------------------------------------- |
| `GCLOUD_STORAGE_BUCKET` | `hq-pages` | GCS bucket to serve.                   |
| `SITE_TITLE`            | `HQ Pages` | Title of directory listing pages.      |
| `PORT`                  | `8080`     | Port to listen on. App Engine sets it. |

For local development, override them on the command line, for example `SITE_TITLE=Local npm run dev`.
