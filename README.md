# codex-harness

Codex로 실무형 과제를 풀 때 쓰는 하네스야. AGENTS.md 규칙, 스킬, 훅이 들어 있어.

## 설치 (작업공간 터미널에서)

```bash
git clone https://github.com/<github-id>/codex-harness /tmp/h
bash /tmp/h/install.sh .
codex   # 이미 켜져 있으면 재시작 후 /skills 로 확인
```

- 스킬 → `~/.agents/skills`, 규칙 → `./AGENTS.md` 뒤에 추가, 카파시 지침 → `~/.codex/AGENTS.md` 뒤에 추가, 훅 → `~/.codex/hooks.json`.
- 경로가 다른 구버전 Codex는 `CODEX_SKILLS_DIR=~/.codex/skills bash /tmp/h/install.sh .`로 실행해.
- 과제가 준 `AGENTS.md`는 보존하고 뒤에 덧붙여. 이미 설치했으면 덮어쓰지 않아. 규칙이 바뀌었으면 직접 갱신해.
- 훅은 `node_modules`, `.git`, 캐시, 스킬 폴더를 읽는 명령을 막아. Codex에서 `/hooks`로 신뢰 승인해야 켜져. `hooks.json`이 이미 있으면 건너뛰니 직접 합쳐.

## 사용

- 새 작업공간에서 첫 요청을 하면 `link` 스킬이 자동으로 돌아서 각 폴더의 `AGENTS.md`에 문서 링크와 읽을 시점을 정리해. 루트에는 루트 문서와 주요 폴더의 역할, 하위 `AGENTS.md` 링크를 둬. 수동 실행은 `$link`.
- 나머지 스킬은 자동 호출이 꺼져 있어. `$이름`으로 부를 때만 동작해.

| 용도 | 스킬 |
|---|---|
| 요구사항 정리 | `$grill-me`, `$to-questionnaire`, `$grill-with-docs` |
| 구현 파이프라인 | `$setup-matt-pocock-skills`(트래커는 local files) → `$to-spec` → `$to-tickets` → `$implement` |
| 구현 도구 | `$tdd`, `$diagnosing-bugs`, `$prototype` |
| 리뷰 | `$ponytail-review`(제출 전 셀프 리뷰), `$code-review` |
| 이해·설명 | `$probe-quiz`(프로젝트 이해도 퀴즈), `$eli5 <주제>`, `$teach` |

- `$implement-spec`은 서브에이전트를 병렬로 띄워서 토큰이 4.5~6.5배 들어.
- `$ponytail`을 상시 모드로 쓰면 서버를 `127.0.0.1`에 띄운 적이 있어(3회 중 2회). AGENTS.md의 `0.0.0.0` 규칙을 지우지 마.

## 사람이 지킬 것 (AGENTS.md에 없는 것)

- `/status`로 모델을 확인하고 `/model`에서 6.1 Sol, 5.6 Terra, 6.0 Luna 중 하나를 골라. Astra는 쓰지 마.
- 승인 대기는 기다려도 안 넘어가. 직접 승인하거나 거절해. 서브에이전트의 승인 요청은 그 스레드를 열어야 보여.
- AI가 고치는 파일을 에디터에서 동시에 수정하지 마(저장 충돌).
- 커밋은 자주, push는 안 해. 샌드박스에서 Codex가 커밋 못 하면 직접 해.
- MCP는 플랫폼의 MCP 탭에서 설정해.

## 출처

외부 스킬을 가져왔어: [ponytail](https://github.com/DietrichGebert/ponytail), [mattpocock/skills](https://github.com/mattpocock/skills), [caveman](https://github.com/JuliusBrussee/caveman), [claude-plugins-community](https://github.com/anthropics/claude-plugins-community), [andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)(`karpathy.md`). 일부는 수정했어.
