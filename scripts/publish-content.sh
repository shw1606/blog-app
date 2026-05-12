#!/usr/bin/env bash
# Bumps the content submodule to blog-content's main HEAD, commits the
# new pointer, and pushes. Use after pushing new posts to blog-content.
#
# Usage:
#   pnpm publish-content                   # auto message from latest content commit
#   pnpm publish-content "Publish foo"     # explicit message
set -euo pipefail

cd "$(dirname "$0")/.."

echo "[publish-content] fetching latest content..."
git submodule update --remote content

if git diff --quiet -- content; then
  echo "[publish-content] already at remote HEAD; nothing to do"
  exit 0
fi

content_subject=$(git -C content log -1 --pretty=%s)
msg="${1:-Bump content: ${content_subject}}"

git add content
git commit -m "$msg"
git push

echo "[publish-content] pushed"
