---
name: to-spec
description: "Turn the current conversation into a PRD and an architecture doc and write them to docs/PRD.md and docs/ARCHITECTURE.md: synthesis of what you've already discussed; asks the user when a decision is needed."
disable-model-invocation: true
---

This skill takes the current conversation context and codebase understanding and produces a spec. Synthesize what you already know. 대화·문서에 답이 없는 판단(규칙 빈칸, README 입출력 형식과의 충돌, 스택·구조 선택)은 직접 정하지 말고 추천안을 붙여 모아서 사용자에게 묻고, 답을 받은 뒤 문서를 쓴다(AGENTS.md "기록" 절).

Write the spec as two human-readable documents: `docs/PRD.md` (what and why) and `docs/ARCHITECTURE.md` (how). Do not publish them to an issue tracker. If the assignment already provides a PRD or ARCHITECTURE document, fill that one instead of creating a new file.

## Process

0. 실무자 확인 (문서 작성 전)
   - 사용자가 실무자 확인 답을 붙여 넣지 않았으면 확인 메시지만 만들고 **멈춘다**. 문서를 쓰지 않는다. 답변에는 이 메시지만 준다.
   - 재료는 `docs/QUESTIONS.md`의 답·가정, README·제공 문서의 규칙, 지금까지의 대화다. 문서 원문은 보내지 않는다(긴 글은 실무자가 일부만 답한다).
   - 15줄 이내. 번호는 묶음을 넘어 이어 붙여 실무자가 틀린 번호만 답하게 한다.

   <confirm-template>
   구현 전에 이해한 내용이 맞는지 확인 부탁드려요. 틀린 번호만 알려주시면 돼요.

   [규칙] 계산·판정에 쓰는 규칙. 숫자와 경계(같을 때 포함인지)를 적는다
   1. ...
   [가정] 실무자가 모름·미답변이라 사용자가 정한 것. 다시 묻지 않고 알린다
   n. ...
   [운영] 사람이 확정하는 지점, 처리 못 한 대상을 어떻게 보여주는지
   n. ...
   [안 만드는 것]
   n. ...
   [성공 기준] 지금 값 → 목표 값. 측정 위치가 비어 있으면 "어디서 확인하시나요?"를 붙인다
   n. ...

   마지막으로, 위 조건 말고 "이러면 사용자가 결과를 안 쓴다(포기한다)"는 경우가 더 있나요?
   </confirm-template>

   - 사용자가 답을 붙여 넣으면(또는 "확인 생략"이라고 하면) 고친 번호와 새로 나온 조건을 `docs/QUESTIONS.md`(없으면 만든다)에 `C1`, `C2`… 행으로 추가하고 상태를 "확정"으로 둔다. 실무자 답이 기존 사용자 결정과 다르면 사용자에게 알리고, 사용자가 받아들이면 DECISIONS.md를 고친다. 확인 메시지는 다시 보내지 않고 1단계로 넘어간다.

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Check with the user that these seams match their expectations.

3. Write `docs/PRD.md` using the PRD template and `docs/ARCHITECTURE.md` using the architecture template below. Do not repeat the same content in both; link instead.

<prd-template>

# PRD: <제목>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should cover every stated requirement, and nothing beyond them.

## Business Rules

| 규칙 | 기준값 | 예외 | 출처 |
|---|---|---|---|

## Out of Scope

A description of the things that are out of scope for this spec.

## Suggestions (not applied)

| 제안 | 이유 | 영향(작업량·위험) | 승인 |
|---|---|---|---|

## Further Notes

Any further notes about the feature.

</prd-template>

<architecture-template>

# ARCHITECTURE: <제목>

처음 보는 사람이 구조와 그렇게 만든 이유를 알 수 있게 쓴다.

## 스택
- ... (이유 / 버린 대안)

## 폴더
- `src/...`, `tests/...`, `docs/...`

## 구성 요소와 데이터 흐름
ASCII 그림 (예: 입력 데이터 → 적재 → DB → 계산 → 결과 → API → 화면)

## 데이터 모델
테이블(또는 파일)과 핵심 필드

## API
`메서드 경로` → 입력 / 출력 한 줄씩

## 저장·재실행
재시작 후 보존, 실패 시 기존 결과 유지 방식 (README가 요구할 때)

## Implementation Decisions

A list of implementation decisions that were made, beyond what the sections above already show. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Specific interactions

Do NOT include code snippets.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Implementation Order

1. 뼈대: 서버 + 미리보기 확인
2. 핵심 흐름을 끝까지 연결
3. ...
4. (마지막) PRD에서 승인된 Suggestions

각 단계에 "무엇을 / 어떻게 확인"을 한 줄씩.

</architecture-template>

## 화면 목업 (`docs/mockup.html`)

- HTML 파일 하나에 인라인 CSS로 만든다. 외부 리소스(CDN·폰트·이미지 URL) 금지.
- 요구된 화면을 한 페이지에 세로로 이어 붙이거나 상단 탭(앵커 링크)으로 나눈다. JS는 탭 전환 정도만.
- 데이터는 제공 데이터의 실제 컬럼명·값 형식을 본뜬 가짜 값 몇 줄. 개인정보·비밀값은 넣지 않는다.
- 같은 폴더의 `DESIGN.md` CSS를 그대로 넣고 클래스만 붙인다.
- 보여주기: 이미 돌고 있는 개발 서버가 있으면 그 서버로, 없으면 `python3 -m http.server <포트> --bind 0.0.0.0 --directory docs`(python이 없으면 `npx http-server docs -a 0.0.0.0 -p <포트>`)로 띄우고 포트와 경로(`/mockup.html`)를 알려준다.

끝나면 답변에는 사용자 확인이 필요한 것만 적는다: 목업 포트·경로, 스택·폴더 추천안(사용자가 고르기 전에는 DECISIONS.md에 적지 않는다), 적용할지 고를 Suggestions. 구현은 시작하지 않는다.
