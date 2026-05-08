#!/usr/bin/env bash
# Custom install step for Vercel: fetch private content submodule, then install deps.
# Vercel's GitHub App auth does not carry over to git submodule fetches, so we
# inject CONTENT_REPO_TOKEN (a fine-grained PAT with read access to the
# blog-content repo) via git's insteadOf rewrite.
set -euo pipefail

if [ -n "${CONTENT_REPO_TOKEN:-}" ]; then
  echo "[vercel-install] Authenticating submodule fetch via CONTENT_REPO_TOKEN"
  git config --global \
    url."https://x-access-token:${CONTENT_REPO_TOKEN}@github.com/".insteadOf \
    "https://github.com/"
  git submodule sync --recursive
  git submodule update --init --recursive
else
  echo "[vercel-install] CONTENT_REPO_TOKEN not set; skipping submodule fetch (content/ will be empty)"
fi

pnpm install --frozen-lockfile
