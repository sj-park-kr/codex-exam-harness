// PreToolUse 훅: 탐색할 필요 없는 폴더(의존성·빌드·캐시·스킬 목록)와 .env를 읽는 셸 명령을 막는다.
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
  // find -not -path './.git/*', --exclude-dir=.git, -path ./.git -prune 도 제외 표현이다
  const rest = cmd.replace(/(['"])!.*?\1/g, '')
    .replace(/(-not|!)\s+-i?(path|name)\s+\S+/g, '')
    .replace(/--exclude(-dir)?[=\s]\S+/g, '')
    .replace(/-i?path\s+\S+\s+-prune/g, '');
  const segs = rest.split(/;|&&|\|\||\n/).filter(seg => !run.test(seg));
  // .env는 앱만 읽는다(비밀값 노출 방지). .env.example 같은 견본은 허용한다
  const env = /(^|[\/\\\s'"=])\.env(?!\.(example|sample|template)\b)(\.[\w-]+)*\*?(?=[\s'"|;>)]|$)/;
  const deny = reason => process.stdout.write(JSON.stringify({ hookSpecificOutput: {
    hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason } }));
  if (segs.some(seg => env.test(seg))) return deny('.env는 직접 열지 않는다. 앱이 읽게 두고, 설정 동작은 임시 환경변수로 검증한다.');
  if (!segs.some(seg => noise.test(seg))) return;
  // 단순 "git ..." 서브커맨드는 .git 경로를 쓰지 않으므로 위 정규식에 걸리지 않는다
  deny('의존성·빌드·캐시·스킬 폴더는 읽지 않는다. 작업 폴더(src, docs 등)만 지정하거나, 빼려면 rg --glob \'!.git\' / find -not -path 형식으로 다시 실행한다.');
});
