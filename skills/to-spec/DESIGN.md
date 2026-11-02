# UI 디자인 가이드

목표: 날것 HTML 말고 깔끔한 대시보드처럼 보이게. 디자인에 시간 쓰지 않는다. 아래 CSS를 복사하고 클래스만 붙인다.

## 규칙
1. 아래 CSS를 그대로 `<style>`(구현에서는 전역 CSS)에 넣는다. 고치거나 늘리지 않는다. Tailwind 등이 이미 있는 스택이면 그걸 쓰되 색은 같게.
2. 내용은 전부 `.card` 안에. 순서: `.page-head`(제목+주요 버튼) → `.stats`(요약 숫자) → 표 카드.
3. 상태는 `.badge ok/warn/err`, 숫자 칸은 `.num`(오른쪽 정렬, 천 단위 쉼표).
4. 오류는 `.alert`에 원인과 다음 행동. `alert()` 금지. 표가 비면 `.empty`에 이유 한 줄.
5. 인라인 style, 외부 폰트·CDN 금지.

## CSS
```css
:root{--bg:#f6f7f9;--card:#fff;--line:#e5e7eb;--text:#111827;--muted:#6b7280;--primary:#4f46e5;--soft:#eef2ff;--r:10px;font:14px/1.5 system-ui,"Segoe UI","Apple SD Gothic Neo","Malgun Gothic",sans-serif}
*{box-sizing:border-box} body{margin:0;background:var(--bg);color:var(--text)}
h1{font-size:22px;margin:0} h2{font-size:16px;margin:0 0 12px} p{margin:4px 0 0;color:var(--muted)}
.topbar{display:flex;align-items:center;gap:24px;height:56px;padding:0 24px;background:#fff;border-bottom:1px solid var(--line);font-weight:700}
.topbar a{color:var(--muted);font-weight:500;text-decoration:none} .topbar a.active{color:var(--primary)}
.container{max-width:1200px;margin:0 auto;padding:32px 24px;display:grid;gap:20px}
.page-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.stats{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}
.stats .card b{display:block;font-size:26px;margin-top:4px}
.btn{height:36px;padding:0 14px;border:1px solid var(--line);border-radius:6px;background:#fff;font:inherit;font-weight:500;cursor:pointer}
.btn:hover{background:var(--bg)} .btn.primary{background:var(--primary);border-color:var(--primary);color:#fff}
.btn:disabled{opacity:.5;cursor:not-allowed}
.input{height:36px;padding:0 12px;border:1px solid var(--line);border-radius:6px;font:inherit}
.input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px var(--soft)}
label{display:grid;gap:6px;font-size:13px;font-weight:500}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:12px;color:var(--muted);background:#f9fafb;padding:10px 12px;border-bottom:1px solid var(--line)}
td{padding:12px;border-bottom:1px solid var(--line)} tbody tr:hover{background:#fafafa}
.num{text-align:right;font-variant-numeric:tabular-nums}
.badge{padding:2px 10px;border-radius:99px;font-size:12px;font-weight:500;background:var(--bg);color:var(--muted)}
.ok{background:#ecfdf5;color:#047857} .warn{background:#fffbeb;color:#b45309} .err{background:#fef2f2;color:#b91c1c}
.alert{padding:12px 16px;border-radius:var(--r);border:1px solid currentColor}
.empty{text-align:center;padding:40px;color:var(--muted)}
```

## 뼈대
```html
<header class="topbar">서비스명 <a class="active" href="#">대시보드</a><a href="#">목록</a></header>
<main class="container">
  <div class="page-head"><div><h1>주문 현황</h1><p>오늘 주문과 처리 상태</p></div><button class="btn primary">+ 새 주문</button></div>
  <div class="stats"><div class="card"><p>전체 주문</p><b>1,284</b></div><div class="card"><p>처리 대기</p><b>37</b></div></div>
  <div class="card"><h2>주문 목록</h2>
    <table><thead><tr><th>주문번호</th><th>상태</th><th class="num">금액</th></tr></thead>
    <tbody><tr><td>A-1042</td><td><span class="badge ok">완료</span></td><td class="num">32,000</td></tr></tbody></table>
  </div>
</main>
```
