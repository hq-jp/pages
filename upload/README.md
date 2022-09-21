# GitHub Action for HQ Pages

This action uploads documents to HQ Pages.

## Inputs

### `namespace`

Document namespace in HQ Pages.

### `source`

Path to documents directory. Default `"docs"`.

### `bucket`

GCS bucket name. Default `"hq-pages"`.

## Example usage

```yaml
name: Upload documents
on:
  push:
    branches:
      - main
jobs:
  upload:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v3
      - uses: hq-jp/pages/upload@main
        with:
          namespace: foo
          source: path/to/dir
```
