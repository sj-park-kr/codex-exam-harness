# codex-harness

Codex로 실무형 과제를 풀 때 쓰는 하네스야. AGENTS.md 규칙, 스킬, 훅이 들어 있어.

## 설치 (작업공간 터미널에서)

```bash
git clone https://github.com/<github-id>/codex-harness /tmp/h
bash /tmp/h/install.sh .
codex   # 이미 켜져 있으면 재시작 후 /skills 로 확인
```

- 스킬 → `~/.agents/skills`, 규칙 → `./AGENTS.md` 뒤에 추가, 카파시 지침 → `~/.codex/AGENTS.md` 뒤에 추가, 훅 → `~/.codex/hooks.json`, git 작성자가 비어 있으면 전역 설정에 채움. 전역 경로가 읽기 전용이면 그 단계만 경고하고 계속해(출력에 `경고:`가 있는지 봐).
- 경로가 다른 구버전 Codex는 `CODEX_SKILLS_DIR=~/.codex/skills bash /tmp/h/install.sh .`로 실행해.
- 과제가 준 `AGENTS.md`는 보존하고 뒤에 덧붙여. 이미 설치했으면 덮어쓰지 않아. 규칙이 바뀌었으면 직접 갱신해.
- 훅은 `node_modules`, `.git`, 캐시, 스킬 폴더와 `.env`(`.env.example` 같은 견본 제외)를 읽는 명령을 막아. 패치 본문, `npm`·`npx`·`node`·`Test-Path` 구간, `'!node_modules'` 같은 제외 글롭, `find -not -path`·`--exclude-dir` 같은 제외 표현, `dist`는 막지 않아. Codex에서 `/hooks`로 신뢰 승인해야 켜져. 목록에 없으면 훅 없이 진행해도 돼. `hooks.json`이 이미 있으면 건너뛰니 직접 합쳐.

## 사용

- 진행 순서. 한 단계씩 직접 실행해:
  1. `$to-questionnaire` → 제공 데이터 예외·패턴 집계 + 실무자 질문지(`docs/QUESTIONS.md`). 나온 메시지를 실무자에게 보내.
  2. `$to-questionnaire` + 실무자 답 붙여 넣기 → 답 반영. 후속 질문이 나오면 한 번 더 보내.
  3. `$to-spec` → `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/mockup.html`. 목업과 스택·폴더 추천안을 보고 확정해. 화면은 `skills/to-spec/DESIGN.md`(색·간격 변수와 카드·표·배지 CSS)를 따라.
  4. "서버 뼈대 띄워줘(로그인 있으면 로그인까지)" → Browser 미리보기에서 확인.
  5. "핵심 흐름(입력→처리→결과) 끝까지 연결해" → 미리보기에서 확인.
  6. "ARCHITECTURE 구현 순서대로 나머지 붙여".
  7. `$run-e2e` → 제출 전 E2E 실행, 실패한 것만 고쳐서 재실행.
- E2E 워크플로우(`$to-e2e` → `$run-e2e`)는 언제 쓰나:
  - `$to-e2e`: 3단계(`$to-spec`) 직후, 구현 전에 실행해. 기대값을 구현 출력이 아니라 PRD·ARCHITECTURE·손계산으로 정하려는 거야. 화면 라벨은 목업 기준이라 구현하면서 라벨이 바뀌면 "E2E 시나리오 라벨 갱신해"로 맞춰.
  - `$run-e2e E01`처럼 시나리오 ID를 줘: 5단계 핵심 흐름이 연결된 뒤부터, 기능을 하나 붙일 때마다 관련 시나리오만 돌려. 결과(실제값·판정·증거)는 `docs/E2E_SCENARIOS.md`에 기록돼.
  - `$run-e2e`(ID 없이 미실행 묶음) 또는 "E2E 전체 실행해": 제출 전에 한 번. 실패는 앱 문제인지 스펙 문제인지 나눠서 보고하니 앱 수정은 따로 시켜.
  - 쓰지 마: 화면이 없는 과제(CLI·API만), 인터넷이 막혀 Playwright 설치가 안 될 때(미실행으로만 기록돼).
- 새 작업공간에서 첫 요청을 하면 `link` 스킬이 자동으로 돌아서 각 폴더의 `AGENTS.md`에 폴더 역할과 문서 링크·읽을 시점을 정리해. 모든 폴더(`.git`·의존성·빌드 결과·캐시 제외)에 문서가 없어도 `AGENTS.md`를 만들어. 데이터·제공 파일은 이름 패턴이 같은 것끼리 glob으로 묶어 용도를 한 줄씩 적어. 루트에는 루트 문서와 바로 아래 폴더의 역할, 하위 `AGENTS.md` 링크를 둬. 수동 실행은 `$link`.
- 나머지 스킬은 자동 호출이 꺼져 있어. `$이름`으로 부를 때만 동작해.

| 용도 | 스킬 |
|---|---|
| 요구사항 정리 | `$to-questionnaire`(실무자 질문지, 해커톤용으로 수정), `$grill-me`, `$grill-with-docs` |
| 설계 | `$to-spec`(사람이 읽는 `docs/PRD.md`와 `docs/ARCHITECTURE.md`(구현 순서 포함), 화면 목업. 해커톤용으로 수정, 트래커 설정 불필요) |
| 무거운 파이프라인 (큰 과제용) | `$setup-matt-pocock-skills`(트래커는 local files) → `$to-tickets` → `$implement` |
| 구현 도구 | `$tdd`, `$diagnosing-bugs`, `$prototype` |
| 검증 | `$to-e2e`(E2E 시나리오 문서), `$run-e2e`(Playwright 실행·기록) |
| 리뷰 | `$ponytail-review`(제출 전 셀프 리뷰), `$code-review` |
| 이해·설명 | `$probe-quiz`(시스템·도메인·AI 활용 이해도 퀴즈), `$eli5 <주제>`, `$teach` |

- `$implement-spec`은 서브에이전트를 병렬로 띄워서 토큰이 4.5~6.5배 들어.
- `$ponytail`을 상시 모드로 쓰면 서버를 `127.0.0.1`에 띄운 적이 있어(3회 중 2회). AGENTS.md의 `0.0.0.0` 규칙을 지우지 마.

## 사람이 지킬 것 (AGENTS.md에 없는 것)

- `/status`로 모델을 확인하고 `/model`에서 6.1 Sol, 5.6 Terra, 6.0 Luna 중 하나를 골라. Astra는 쓰지 마.
- 승인 대기는 기다려도 안 넘어가. 직접 승인하거나 거절해. 서브에이전트의 승인 요청은 그 스레드를 열어야 보여.
- AI가 고치는 파일을 에디터에서 동시에 수정하지 마(저장 충돌).
- 커밋은 자주, push는 안 해. 샌드박스에서 Codex가 커밋 못 하면 직접 해.
- MCP는 플랫폼의 MCP 탭에서 설정해.
- Plan 모드는 쓰지 마. 파일 저장이 막혀.
- 실무자에게 이미 "모름"이라고 들은 걸 Codex가 다시 물으려 하면 `docs/QUESTIONS.md`를 보라고 해.

## 출처

외부 스킬을 가져왔어: [ponytail](https://github.com/DietrichGebert/ponytail), [mattpocock/skills](https://github.com/mattpocock/skills), [caveman](https://github.com/JuliusBrussee/caveman), [claude-plugins-community](https://github.com/anthropics/claude-plugins-community), [andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)(`karpathy.md`). 일부는 수정했어.
