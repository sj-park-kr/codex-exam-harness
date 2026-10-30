// PreToolUse 훅: 탐색할 필요 없는 폴더(의존성·빌드·캐시·스킬 목록)를 읽는 셸 명령을 막는다.
let s = '';
process.stdin.on('data', d => (s += d)).on('end', () => {
  let cmd = '';
  try { const j = JSON.parse(s); cmd = String(j.tool_input?.command ?? j.tool_input?.cmd ?? ''); } catch { return; }
  // 스킬 본문(SKILL.md)과 스킬이 가리키는 문서(.md)를 직접 읽는 것은 허용한다
  if (/SKILL\.md|skills[\/\\][^\s'"]*\.md/.test(cmd)) return;
  // 코드 패치(apply_patch) 본문은 파일 쓰기다
  if (/^\*\*\* Begin Patch/.test(cmd)) return;
  // build·target은 "npm run build" 같은 낱말과 겹쳐 경로(뒤에 / 또는 \)일 때만 막는다. dist는 배포물 확인에 필요해 막지 않는다
  const noise = /(^|[\/\\\s'"])((node_modules|\.git|\.venv|venv|__pycache__|\.pytest_cache|\.next|site-packages)([\/\\\s'"]|$)|(build|target)[\/\\])|\.agents[\/\\]skills|\.codex[\/\\]skills/;
  // 빌드·실행·존재 확인 구간은 탐색이 아니다("…; npm run build"처럼 이어 붙여도 구간별로 본다)
  const run = /^\s*(npm|npx|pnpm|yarn|node|Test-Path)(\.cmd|\.exe)?\s/i;
  // '!node_modules/**' 같은 제외 글롭은 오히려 그 폴더를 빼는 것이라 검사에서 지운다
  const rest = cmd.replace(/(['"])!.*?\1/g, '');
  if (!rest.split(/;|&&|\|\||\n/).some(seg => !run.test(seg) && noise.test(seg))) return;
  // 단순 "git ..." 서브커맨드는 .git 경로를 쓰지 않으므로 위 정규식에 걸리지 않는다
  process.stdout.write(JSON.stringify({ hookSpecificOutput: {
    hookEventName: 'PreToolUse',
    permissionDecision: 'deny',
    permissionDecisionReason: '의존성·빌드·캐시·스킬 폴더는 읽지 않는다. 작업 폴더(src, docs 등)만 지정해 다시 실행한다.',
  } }));
});
