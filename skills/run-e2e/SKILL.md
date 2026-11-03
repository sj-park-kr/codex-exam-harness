---
name: run-e2e
description: docs/E2E_SCENARIOS.md의 시나리오를 @playwright/test 스펙으로 만들어 실제 브라우저로 실행하고, 실제값·판정·증거를 문서에 기록한다. 인자로 시나리오 ID(E01, E04~E06)를 받는다.
disable-model-invocation: true
---

# run-e2e (해커톤용)

`docs/E2E_SCENARIOS.md`를 Playwright로 실행하고 결과를 그 문서에 적는다. 앱 코드는 고치지 않는다.

## 0. 범위
- 인자로 받은 시나리오만 실행한다. 인자가 없으면 문서 6절의 우선 실행 순서에서 아직 `미실행`인 첫 묶음을 고르고 답변에 적는다. 전체 실행은 요청받았을 때만.
- `docs/E2E_SCENARIOS.md`가 없으면 "`$to-e2e`를 먼저 실행해"라고 답하고 멈춘다.

## 1. 준비
- `package.json`에 `@playwright/test`가 없으면 `npm i -D @playwright/test` 후 `npx playwright install chromium`. Node 프로젝트가 아니면 `tests/e2e/`에 별도 `package.json`을 두고 거기에 설치한다.
- 설치가 실패하면(오프라인 등) 오류 그대로 문서 해당 시나리오에 `미실행 — Playwright 설치 실패: <오류>`로 적고 멈춘다. 다른 방법으로 합격 처리하지 않는다.
- 최소 `playwright.config.js`(이미 있으면 재사용):
  ```js
  const { defineConfig } = require('@playwright/test');
  const PORT = process.env.E2E_PORT || 3000;
  module.exports = defineConfig({
    testDir: 'tests/e2e',
    workers: 1, // 시나리오가 같은 테스트 DB를 공유
    use: { baseURL: `http://127.0.0.1:${PORT}`, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
    webServer: { command: '<README의 실행 명령>', url: `http://127.0.0.1:${PORT}`, reuseExistingServer: true },
  });
  ```
  서버 자체는 앱 설정대로 `0.0.0.0`에 뜬다. 브라우저 접속 주소만 로컬이다.
- 테스트 데이터: 앱이 지원하는 경로 설정(DB 파일·데이터 폴더)을 `webServer.env`의 임시 환경변수로 테스트 복사본에 돌린다. `.env`는 열거나 고치지 않는다. 지원하는 설정이 없으면 실행 전 기존 DB를 백업하고 끝나면 복원하며, 그래도 위험하면 묻는다. 기존 DB를 삭제하지 않는다.
- 계정 비밀번호는 환경변수(`E2E_ADMIN_PW` 등)로 받는다. 스펙·문서에 적지 않는다.

## 2. 스펙 작성
- 시나리오당 한 파일: `tests/e2e/E04-좌석비용.spec.js`. `test.describe('E04 ...')`로 ID를 이름에 넣는다.
- 셀렉터는 문서의 화면 라벨로 `getByRole`·`getByLabel`·`getByText`. CSS·XPath 셀렉터는 라벨이 없을 때만.
- 역할이 다르면 `browser.newContext()`를 따로 만든다(운영자·직원 세션 분리).
- 업로드는 `setInputFiles`로 `tests/fixtures/e2e/<세트>/` 파일을 쓴다. 다운로드는 `page.waitForEvent('download')`로 받아 내용을 검사한다.
- 기대값은 문서 3·4절에서 그대로 가져온다. 실패했다고 앱 출력에 맞춰 기대값을 바꾸지 않는다.
- 조건 비교 항목은 규칙(정원 이하, 시간창 안 등)으로 assert하고, 생성 ID·시각은 `test.info().annotations`에 실제값으로 남긴다.
- 실패해도 나머지 비교를 보려면 `expect.soft`를 쓴다.

## 3. 실행
```
npx playwright test tests/e2e/E04 --reporter=list
```
- 실패하면 먼저 스펙 문제(라벨 오타, 대기 부족)인지 앱 문제인지 `test-results/`의 스크린샷·trace로 가른다. 스펙 문제만 고쳐서 재실행한다. 앱 문제는 고치지 않는다.
- 재시작 보존처럼 브라우저 밖 조작이 필요하면 스펙 안에서 서버를 다시 띄우지 말고, 단계별로 나눠 실행하고 사이에 서버를 재시작한다. 자동화 못 하면 `수동 검증 필요`로 적는다.

## 4. 기록
문서의 해당 시나리오 기록 양식을 채운다.
- 실행 ID(`YYYYMMDD-HHMM`), 실행 일시, `git rev-parse --short HEAD`, 브라우저(chromium 버전), 자료 세트, 생성 ID.
- 시스템 실제값: 화면에서 읽은 값. 기대값 칸은 건드리지 않는다.
- 판정: `합격 / 실패 / 선행 실패로 차단 / 미실행`. 실패면 차이와 원인(앱 버그 / 스펙 문제 / 문서 기대값 오류 의심)을 적는다. 문서 기대값이 틀려 보이면 고치지 말고 근거와 함께 답변에 올린다.
- 증거 위치: 스펙 파일 경로, `test-results/` 경로. 개인정보·세션값이 담긴 trace·HAR은 커밋하지 않는다(`test-results/`, `playwright-report/`를 `.gitignore`에 추가).
- 문서 머리 상태를 갱신한다(예: `E01~E05 실행, 4 합격 1 실패`).

## 5. 답변
실행한 시나리오별 판정 한 줄씩, 실패는 원인 분류와 증거 경로. 마지막 줄에 미실행·수동 검증 남은 것.
