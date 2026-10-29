# codex-exam-harness

Codex로 실무형 과제를 풀 때 쓰는 하네스입니다. AGENTS.md 규칙과 스킬이 들어 있습니다(SK하이닉스 AI 해커톤 2026 2차 예선 대비).

## 설치 (작업공간 터미널에서)

```bash
git clone https://github.com/<github-id>/codex-exam-harness /tmp/h
bash /tmp/h/install.sh .        # 스킬 → ~/.agents/skills, 하네스 규칙 → ./AGENTS.md 뒤에 추가, 카파시 지침 → ~/.codex/AGENTS.md 뒤에 추가
codex                           # 이미 켜져 있으면 재시작 후 /skills 로 확인
```

- 스킬은 작업공간 밖(`~/.agents/skills`)에 설치됩니다. 구버전 Codex라 경로가 다르면 `CODEX_SKILLS_DIR=~/.codex/skills bash /tmp/h/install.sh .`처럼 바꿔서 실행하세요.
- 과제가 준 `AGENTS.md`는 그대로 두고 뒤에 덧붙입니다. 여러 번 실행해도 한 번만 들어갑니다.
- 설치 후 새 작업공간에서 `$init`을 호출해 폴더별 `AGENTS.md`와 문서 링크를 정리하세요.
- 이미 하네스를 설치한 작업공간은 재설치해도 기존 `AGENTS.md`를 덮어쓰지 않습니다. 기존 문서 안내 규칙은 새 버전에 맞게 직접 갱신하세요.

## 스킬 (모두 자동 호출 꺼짐, `$이름`으로 부를 때만 동작)

| 용도 | 스킬 |
|---|---|
| 작업공간 초기화 | `$init`(폴더 탐색, 폴더별 안내와 문서 링크 정리) |
| 요구사항 정리 | `$grill-me`(계획 검증 인터뷰), `$to-questionnaire`(실무자에게 물을 질문지), `$grill-with-docs` |
| 구현 파이프라인 (Pocock) | `$setup-matt-pocock-skills`(트래커는 local files 선택) → `$to-spec` → `$to-tickets` → `$implement`(tdd + code-review) |
| 구현 도구 | `$tdd`, `$diagnosing-bugs`, `$prototype`, `$codebase-design`, `$domain-modeling` |
| 리뷰 | `$ponytail-review`(제출 전 셀프 리뷰), `$code-review`, `$ponytail-audit` |
| 이해·설명 | `$probe-quiz`(서술형 대비 퀴즈), `$probe-quiz 리허설`, `$probe-quiz 설명`, `$eli5 <주제>`, `$teach`, `$wait-what` |
| 말투 | `$caveman`(짧게), `$ponytail`(최소 변경 모드) |
| 기타 | `$handoff`, `$research`, `$retro`, `$ask-matt`, `$improve-codebase-architecture`, `$implement-spec`, `$pr`, `$triage`, `$wayfinder`, `$wizard`, `$writing-for-agents`, `$ponytail-debt`, `$ponytail-gain`, `$ponytail-help` |

- `$implement-spec`은 서브에이전트를 병렬로 띄워 토큰이 많이 듭니다. 로컬 실험에서 직접 처리보다 4.5~6.5배였습니다.
- `$ponytail`을 상시 모드로 쓰면 서버를 `127.0.0.1`에 띄운 적이 있습니다(3회 중 2회). AGENTS.md의 `0.0.0.0` 규칙을 지우지 마세요.

## 사람이 지킬 것 (AGENTS.md에 없는 것)

- `/status`로 모델을 확인하고, `/model`에서 6.1 Sol, 5.6 Terra, 6.0 Luna 중 하나를 고릅니다. Astra는 쓰지 않습니다.
- **승인 대기는 기다려도 넘어가지 않습니다.** 직접 승인하거나 거절하세요. 서브에이전트의 승인 요청은 그 스레드를 열어야 보입니다.
- AI가 고치는 파일을 에디터에서 동시에 수정하지 마세요(저장 충돌).
- 커밋은 자주 하고, push는 하지 않습니다. 샌드박스에서 Codex가 커밋하지 못하면 직접 커밋하세요.
- MCP는 플랫폼의 MCP 탭에서 설정합니다.
- 마감 30분 전에 기능 추가를 멈추고, 20분 전에 `$probe-quiz 리허설`을 하고, 10분 전에 제출을 시작합니다.
- 서술형(6문항 × 5분, AI와 복붙 금지)은 "결론 → 근거(파일·함수) → 검증 → 한계" 순서로 3~5문장을 씁니다. 질문의 전제가 틀렸으면 차이부터 밝힙니다.

## 출처

외부 스킬을 가져왔습니다: [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail), [mattpocock/skills](https://github.com/mattpocock/skills), [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman), [anthropics/claude-plugins-community](https://github.com/anthropics/claude-plugins-community), [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)(`karpathy.md`). 일부는 `agents/openai.yaml`을 추가하는 등 수정했습니다.
