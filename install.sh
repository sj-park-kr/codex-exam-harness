#!/usr/bin/env bash
# 사용법: bash install.sh [작업공간 경로, 기본 .]
# 스킬을 사용자 경로에 복사하고, 작업공간 AGENTS.md 뒤에 하네스 규칙을, 전역 AGENTS.md 뒤에 카파시 지침을 덧붙인다.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
WS="$(cd "${1:-.}" && pwd)"
DEST="${CODEX_SKILLS_DIR:-$HOME/.agents/skills}"
MARK='<!-- harness: codex-exam-harness -->'

# 작업공간 안에 설치하면 스킬이 제출물에 섞인다 (확인 전에는 폴더를 만들지 않음)
case "$DEST" in /*) ;; *) DEST="$PWD/$DEST";; esac
case "$DEST/" in "$WS"/*) echo "중단: 스킬 경로($DEST)가 작업공간 안입니다" >&2; exit 1;; esac
mkdir -p "$DEST"

cp -R "$HERE"/skills/. "$DEST"/
echo "스킬 $(ls "$HERE/skills" | wc -l | tr -d ' ')개 → $DEST"

AG="$WS/AGENTS.md"
if [ -f "$AG" ] && grep -qF "$MARK" "$AG"; then
  echo "AGENTS.md: 이미 들어 있음, 건너뜀"
else
  # 과제가 준 AGENTS.md는 보존하고 뒤에 붙인다
  { [ -s "$AG" ] && printf '\n'; sed "s#~/.agents/skills#$DEST#g" "$HERE/AGENTS.md"; } >> "$AG"
  echo "AGENTS.md: 하네스 규칙 추가 → $AG (새 작업공간에서 \$init 호출)"
fi
GAG="${CODEX_HOME:-$HOME/.codex}/AGENTS.md"
if [ -f "$GAG" ] && grep -qF '<!-- harness: karpathy -->' "$GAG"; then
  echo "전역 AGENTS.md: 카파시 지침 이미 들어 있음, 건너뜀"
else
  mkdir -p "$(dirname "$GAG")"
  { [ -s "$GAG" ] && printf '\n'; cat "$HERE/karpathy.md"; } >> "$GAG"
  echo "전역 AGENTS.md: 카파시 지침 추가 → $GAG"
fi
echo "다음: codex 재시작 → /skills 로 목록 확인"
