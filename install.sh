#!/usr/bin/env bash
# 사용법: bash install.sh [작업공간 경로, 기본 .]
# 스킬을 사용자 경로에 복사하고, 작업공간 AGENTS.md 뒤에 하네스 규칙을, 전역 AGENTS.md 뒤에 카파시 지침을 덧붙인다.
# 전역 경로가 읽기 전용이면 그 단계만 경고하고 나머지는 계속한다.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
WS="$(cd "${1:-.}" && pwd)"
DEST="${CODEX_SKILLS_DIR:-$HOME/.agents/skills}"
MARK='<!-- harness: codex-harness -->'
warn() { echo "경고: $*" >&2; }

# 작성자 정보가 없으면 git commit이 실패한다. 이미 있으면 건드리지 않는다.
git config user.name  >/dev/null || git config --global user.name  "sj0830.park" || warn "git user.name 설정 실패, 직접 설정해"
git config user.email >/dev/null || git config --global user.email "sj-park-kr@users.noreply.github.com" || warn "git user.email 설정 실패, 직접 설정해"
echo "git 작성자: $(git config user.name || true) <$(git config user.email || true)>"

# 작업공간 안에 설치하면 스킬이 제출물에 섞인다 (확인 전에는 폴더를 만들지 않음)
case "$DEST" in /*) ;; *) DEST="$PWD/$DEST";; esac
case "$DEST/" in "$WS"/*) echo "중단: 스킬 경로($DEST)가 작업공간 안입니다" >&2; exit 1;; esac
if mkdir -p "$DEST" && cp -R "$HERE"/skills/. "$DEST"/; then
  echo "스킬 $(ls "$HERE/skills" | wc -l | tr -d ' ')개 → $DEST"
else
  warn "스킬을 $DEST 에 복사 못 함. CODEX_SKILLS_DIR=쓰기 가능한 경로 로 다시 실행해"
fi

AG="$WS/AGENTS.md"
if [ -f "$AG" ] && grep -qF "$MARK" "$AG"; then
  echo "AGENTS.md: 이미 들어 있음, 건너뜀"
else
  # 과제가 준 AGENTS.md는 보존하고 뒤에 붙인다
  # Git Bash의 /c/... 경로는 Windows용 Codex가 못 읽어서 C:/... 형식으로 적는다
  DOC_DEST="$DEST"; command -v cygpath >/dev/null && DOC_DEST="$(cygpath -m "$DEST")"
  { [ -s "$AG" ] && printf '\n'; sed "s#~/.agents/skills#$DOC_DEST#g" "$HERE/AGENTS.md"; } >> "$AG"
  echo "AGENTS.md: 하네스 규칙 추가 → $AG (새 작업공간에서 첫 요청 시 폴더 탐색과 링크 정리가 자동으로 실행됨)"
fi

CH="${CODEX_HOME:-$HOME/.codex}"
if ! { mkdir -p "$CH/harness-hooks" && [ -w "$CH" ]; } 2>/dev/null; then
  warn "$CH 쓰기 불가 → 카파시 지침·훅 건너뜀 (작업공간 AGENTS.md 규칙은 적용됨)"
else
  GAG="$CH/AGENTS.md"
  if [ -f "$GAG" ] && grep -qF '<!-- harness: karpathy -->' "$GAG"; then
    echo "전역 AGENTS.md: 카파시 지침 이미 들어 있음, 건너뜀"
  else
    { [ -s "$GAG" ] && printf '\n'; cat "$HERE/karpathy.md"; } >> "$GAG"
    echo "전역 AGENTS.md: 카파시 지침 추가 → $GAG"
  fi
  # 불필요한 폴더(의존성·캐시·스킬 목록) 탐색과 .env 읽기를 막는 훅. config.toml은 건드리지 않고 hooks.json만 둔다.
  cp "$HERE/hooks/block-noise.js" "$CH/harness-hooks/"
  if [ -f "$CH/hooks.json" ]; then
    echo "훅: $CH/hooks.json 이미 있음, 건너뜀 (직접 합치세요: $HERE/hooks/hooks.json)"
  else
    sed "s#HOOK_DIR#$CH/harness-hooks#" "$HERE/hooks/hooks.json" > "$CH/hooks.json"
    echo "훅: $CH/hooks.json 추가 (Codex에서 /hooks 로 신뢰 승인 필요, 목록에 없으면 훅 없이 진행)"
  fi
fi
echo "다음: codex 재시작 → /skills 로 목록 확인"
