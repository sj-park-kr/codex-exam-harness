// PreToolUse 훅: 탐색할 필요 없는 폴더(의존성·빌드·캐시·스킬 목록)를 읽는 셸 명령을 막는다.
let s = '';
process.stdin.on('data', d => (s += d)).on('end', () => {
  let cmd = '';
  try { const j = JSON.parse(s); cmd = String(j.tool_input?.command ?? j.tool_input?.cmd ?? ''); } catch { return; }
  // 스킬 본문(SKILL.md)을 직접 읽는 것은 허용한다
  if (/SKILL\.md/.test(cmd)) return;
  const noise = /(^|[\/\s'"])(node_modules|\.git|\.venv|venv|__pycache__|\.pytest_cache|\.next|dist|build|target|site-packages)([\/\s'"]|$)|\.agents[\/]skills|\.codex[\/]skills/;
  if (!noise.test(cmd)) return;
  // 단순 "git ..." 서브커맨드는 .git 경로를 쓰지 않으므로 위 정규식에 걸리지 않는다
  process.stdout.write(JSON.stringify({ hookSpecificOutput: {
    hookEventName: 'PreToolUse',
    permissionDecision: 'deny',
    permissionDecisionReason: '의존성·빌드·캐시·스킬 폴더는 읽지 않는다. 작업 폴더(src, docs 등)만 지정해 다시 실행한다.',
  } }));
});
