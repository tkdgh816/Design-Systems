'use strict';

const works = [
  {
    id: 'jar',
    name: '백자 항아리',
    en: 'White Porcelain Jar',
    era: '조선',
    date: '18세기',
    material: '백자',
    code: '1983.28',
    alt: '낮은 입과 넓은 어깨를 가진 유백색 항아리',
    intro:
      '둥근 몸체를 따라 내려오면 양쪽 어깨의 기울기가 조금씩 다릅니다. 빛이 닿는 자리에서 유약의 옅은 푸른 기운을 찾아보세요.',
  },
  {
    id: 'bowl',
    name: '청자 어문 완',
    en: 'Bowl with Fish and Waves',
    era: '고려',
    date: '12–13세기',
    material: '청자',
    code: '1918.445',
    alt: '안쪽에 물고기와 물결 무늬가 낮게 솟은 청자 그릇',
    intro:
      '그릇의 안쪽을 천천히 따라가 보세요. 유약 아래로 물고기와 물결 무늬가 드러납니다. 낮은 부조 위에 빛이 머무는 자리가 보입니다.',
  },
  {
    id: 'ewer',
    name: '청자 죽순문 주자',
    en: 'Wine Ewer with Bamboo Design',
    era: '고려',
    date: '12세기',
    material: '청자',
    code: '1928.179',
    alt: '죽순 무늬를 새긴 청자 주전자',
    intro:
      '몸체에 새긴 죽순 무늬에서 주둥이와 손잡이까지 시선을 옮겨 보세요. 서로 다른 곡선이 하나의 실루엣을 만듭니다.',
  },
];
const main = document.querySelector('main');
const media = matchMedia('(prefers-color-scheme: dark)');
const storageKey = 'ondo.preview.v1';
const prefs = { theme: 'system', accent: 'clay', notes: [], viewed: [] };
let canSave = true;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey)) ?? {};
  if (['system', 'light', 'dark'].includes(saved.theme)) prefs.theme = saved.theme;
  if (['clay', 'sage'].includes(saved.accent)) prefs.accent = saved.accent;
  if (Array.isArray(saved.notes))
    prefs.notes = saved.notes.filter(
      (n) =>
        n &&
        works.some((w) => w.id === n.work) &&
        typeof n.body === 'string' &&
        typeof n.date === 'string',
    );
  if (Array.isArray(saved.viewed))
    prefs.viewed = saved.viewed.filter((id) => works.some((w) => w.id === id));
} catch {
  canSave = false;
}
function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(prefs));
    canSave = true;
  } catch {
    canSave = false;
  }
}
function applyTheme() {
  const root = document.documentElement;
  root.dataset.theme = prefs.theme === 'system' ? (media.matches ? 'dark' : 'light') : prefs.theme;
  root.dataset.accent = prefs.accent;
}
media.addEventListener('change', applyTheme);
applyTheme();
const esc = (v) =>
  String(v).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const img = (w) => `<img src="../assets/${w.id}.jpg" alt="${w.alt}">`;
const cap = (w) => `${w.era} · ${w.date} · ${w.material}`;
const link = (w) => '#work/' + w.id;
const source = (w) => 'https://www.clevelandart.org/art/' + w.code;
const go = (route, label) =>
  `<a class="button" href="#${route}">${label}<span aria-hidden="true">↗</span></a>`;
const viewWork = (id) => works.find((w) => w.id === id);
const announce = (msg) => {
  document.querySelector('#status').textContent = msg;
};
function section(label, title, desc = '') {
  return `<header class="section-head"><p class="kicker">${label}</p><h1>${title}</h1>${desc ? '<p>' + desc + '</p>' : ''}</header>`;
}
function tile(w) {
  return `<a class="tile" href="${link(w)}"><div class="tile-photo">${img(w)}</div><small>${cap(w)}</small><h3>${w.name}<span aria-hidden="true">↗</span></h3></a>`;
}
let plate = 0;
function exhibit(w) {
  return `<a href="${link(w)}" class="hero-photo" aria-label="${w.name} 상세 보기">${img(w)}</a>
  <figcaption><span><span class="fig-no">FIG. 0${plate + 1}</span> ${w.name} <small> / ${w.date}</small></span>
  <span class="pager"><button data-step="-1" aria-label="이전 도판">←</button><button data-step="1" aria-label="다음 도판">→</button></span></figcaption>`;
}
function home() {
  return `<section class="hero"><div class="hero-intro"><p class="kicker"><i></i> 기획 소장선 &nbsp; / &nbsp; 한국의 도자기</p>
  <h1>흙이 남긴 <br>곡선<span class="period">.</span></h1><p class="serif subtitle" lang="en">Studies in Clay</p>
  <p class="lede">한 점의 그릇을 천천히 들여다보세요.<br>고려와 조선의 도자 세 점을 함께 읽습니다.</p>
  ${go('archive', '소장품 둘러보기')}</div><figure class="plate">${exhibit(works[plate])}</figure></section>
  <section class="shelf"><div class="shelf-head"><div><p class="kicker">상설 소장선</p><h2>세 점의 도자</h2></div><a href="#archive">전체 보기 →</a></div>
  <div class="tiles">${works.map(tile).join('')}</div></section>`;
}
let filter = '전체';
function archive() {
  const shown = works.filter((w) => filter === '전체' || w.era === filter);
  return (
    section('Collection index', '소장품 목록', '시대를 골라 형태와 쓰임을 비교해 보세요.') +
    `<div class="toolbar"><div class="filters" aria-label="시대별 필터" role="group">${['전체', '고려', '조선'].map((f) => `<button data-filter="${f}" aria-pressed="${f === filter}">${f}</button>`).join('')}</div><span>${shown.length}점</span></div>
    <div class="inventory">${shown.map((w) => `<a class="inventory-row" href="${link(w)}">${img(w)}<span><small>${w.en}</small><strong>${w.name}</strong></span><span>${w.era} · ${w.date}</span><span aria-hidden="true">↗</span></a>`).join('')}</div>`
  );
}
function detail(w) {
  if (!prefs.viewed.includes(w.id)) {
    prefs.viewed.push(w.id);
    persist();
  }
  return `<a class="back" href="#archive">← 소장품 목록</a><article class="object"><figure>${img(w)}<figcaption>The Cleveland Museum of Art · CC0</figcaption></figure>
  <div class="object-copy"><p class="kicker">소장품 해설</p><h1>${w.name}</h1><p class="serif">${w.en}</p><p class="reading">${w.intro}</p>
  <dl><div><dt>시대</dt><dd>${w.era} · ${w.date}</dd></div><div><dt>재질</dt><dd>${w.material}</dd></div><div><dt>소장 번호</dt><dd><a href="${source(w)}">${w.code} ↗</a></dd></div></dl>
  ${go('write/' + w.id, '감상 기록 쓰기')}</div></article>`;
}
function desk() {
  const last = prefs.notes[0];
  const next = works.find((w) => !prefs.viewed.includes(w.id));
  return (
    section('Reading desk', '나의 감상실', '살펴본 작품과 남긴 문장을 이곳에서 이어 읽으세요.') +
    `<div class="desk"><aside><h2>감상 현황</h2><div class="metric"><b>${prefs.viewed.length}<small> / 3</small></b><span>살펴본 작품</span></div>
    <div class="meter" aria-hidden="true"><i style="width:${(prefs.viewed.length / 3) * 100}%"></i></div><p class="muted">${last ? '최근 기록 ' + esc(last.date) : '첫 기록을 기다리고 있어요.'}</p>${go('write', '새 기록 쓰기')}
    ${next ? `<div class="next-work"><small>다음 감상 작품</small>${tile(next)}</div>` : ''}</aside>
    <section class="journal"><div class="shelf-head"><h2>감상 기록</h2><span>${prefs.notes.length}편</span></div>
    ${
      prefs.notes.length
        ? prefs.notes
            .map(
              (n) =>
                `<article><small>${esc(n.date)} · <a href="${link(viewWork(n.work))}">${viewWork(n.work).name}</a></small><p class="note-text">${esc(n.body)}</p></article>`,
            )
            .join('')
        : `<div class="empty"><h3>아직 남긴 기록이 없습니다.</h3><p>눈길이 머문 작품을 골라 첫인상을 적어 보세요.</p><a href="#archive">작품 고르기 →</a></div>`
    }</section></div>`
  );
}
function form(w) {
  return (
    `<a class="back" href="#desk">← 나의 감상실</a>` +
    section('Field notes', '감상 기록 쓰기') +
    `<div class="writing"><form id="note-form" novalidate><label for="work">작품</label><select id="work" required>${works.map((o) => `<option value="${o.id}" ${o.id === w.id ? 'selected' : ''}>${o.name}</option>`).join('')}</select>
    <label for="note">관찰한 점 <small>필수</small></label><textarea id="note" rows="6" required maxlength="600" aria-describedby="hint error count" placeholder="어디에 시선이 가장 오래 머물렀나요?"></textarea>
    <div class="hint"><small id="hint">문장 하나로 시작해도 좋습니다.</small><small id="count">0 / 600</small></div><p id="error" class="error" role="alert"></p>
    <div class="form-actions"><button class="button" type="submit">기록 저장</button><a href="#desk">취소</a></div></form><aside id="work-ref">${formRef(w)}</aside></div>`
  );
}
function formRef(w) {
  return `${img(w)}<h3>${w.name}</h3><small>${cap(w)}</small>`;
}
function radio(name, value, label, current) {
  return `<label class="choice"><input type="radio" name="${name}" value="${value}" ${current === value ? 'checked' : ''}><span>${label}</span></label>`;
}
function settings() {
  return (
    section('Preferences', '화면 설정', '선택한 설정은 이 브라우저에 저장됩니다.') +
    `<div class="preferences"><fieldset><legend>화면 밝기</legend><p>사용 환경에 맞춰 바탕과 글자색을 조정합니다.</p>
    <div class="choices">${[
      ['system', '기기 설정'],
      ['light', '라이트'],
      ['dark', '다크'],
    ]
      .map(([v, l]) => radio('theme', v, l, prefs.theme))
      .join('')}</div></fieldset>
    <fieldset><legend>포인트 색상</legend><p>주요 동작과 선택 표시의 색을 고릅니다.</p><div class="choices">${radio('accent', 'clay', '테라코타', prefs.accent)}${radio('accent', 'sage', '세이지', prefs.accent)}</div></fieldset>
    <div class="sample"><span>선택한 색상 미리보기</span>${go('archive', '소장품 열기')}</div>
    <button class="restore" id="reset-view" ${prefs.theme === 'system' && prefs.accent === 'clay' ? 'disabled' : ''}>화면 설정 초기화</button></div>`
  );
}
function render(focus = false) {
  const [route, id] = (location.hash.slice(1) || 'home').split('/');
  let page, title;
  switch (route) {
    case 'archive':
      page = archive();
      title = '소장품 목록';
      break;
    case 'work':
      if (viewWork(id)) {
        page = detail(viewWork(id));
        title = viewWork(id).name;
      }
      break;
    case 'write':
      page = form(viewWork(id) || works[0]);
      title = '감상 기록 쓰기';
      break;
    case 'desk':
      page = desk();
      title = '나의 감상실';
      break;
    case 'settings':
      page = settings();
      title = '화면 설정';
      break;
    case 'home':
      page = home();
      title = '전시실';
      break;
  }
  main.innerHTML =
    page ?? section('Ondo', '화면을 찾을 수 없습니다.') + go('home', '전시실로 이동');
  document.title = (title ?? '화면 찾기') + ' · Ondo 온도';
  const active = { work: 'archive', write: 'desk' }[route] ?? route;
  document.querySelectorAll('.top a').forEach((a) => {
    if (a.hash === '#' + active && !a.classList.contains('brand'))
      a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  if (focus) {
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}
window.addEventListener('hashchange', () => render(true));
document.querySelector('.skip').addEventListener('click', (e) => {
  e.preventDefault();
  main.focus();
});
main.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;
  if (button.id === 'reset-view') {
    prefs.theme = 'system';
    prefs.accent = 'clay';
    applyTheme();
    persist();
    render();
    main.querySelector('[name="theme"]:checked').focus();
    announce('기기 밝기와 테라코타 색상으로 복원했습니다.');
  }
  if (button.dataset.step) {
    plate = (plate + Number(button.dataset.step) + works.length) % works.length;
    main.querySelector('.plate').innerHTML = exhibit(works[plate]);
    main.querySelector('[data-step="' + button.dataset.step + '"]').focus({ preventScroll: true });
    announce(works[plate].name);
  }
  if (button.dataset.filter) {
    filter = button.dataset.filter;
    render();
    main.querySelector('[data-filter="' + filter + '"]').focus({ preventScroll: true });
    announce(filter + ' 작품 ' + main.querySelectorAll('.inventory-row').length + '점');
  }
});
main.addEventListener('change', (e) => {
  const input = e.target;
  if (input.id === 'work')
    main.querySelector('#work-ref').innerHTML = formRef(viewWork(input.value));
  if (input.type === 'radio') {
    prefs[input.name] = input.value;
    applyTheme();
    persist();
    document.querySelector('#reset-view').disabled =
      prefs.theme === 'system' && prefs.accent === 'clay';
    announce(
      canSave
        ? '화면 설정을 저장했습니다.'
        : '이번 화면에 설정을 적용했습니다. 브라우저 저장소를 사용할 수 없습니다.',
    );
  }
});
main.addEventListener('input', (e) => {
  if (e.target.id === 'note') {
    document.querySelector('#count').textContent = e.target.value.length + ' / 600';
    if (e.target.value.trim()) {
      e.target.removeAttribute('aria-invalid');
      document.querySelector('#error').textContent = '';
    }
  }
});
main.addEventListener('submit', (e) => {
  e.preventDefault();
  const field = document.querySelector('#note');
  if (!field.value.trim()) {
    field.setAttribute('aria-invalid', 'true');
    document.querySelector('#error').textContent = '관찰한 점을 한 글자 이상 입력해 주세요.';
    field.focus();
    return;
  }
  prefs.notes.unshift({
    work: document.querySelector('#work').value,
    body: field.value.trim(),
    date: new Intl.DateTimeFormat('ko', { dateStyle: 'medium' }).format(new Date()),
  });
  persist();
  location.hash = 'desk';
  announce(
    canSave
      ? '감상 기록을 저장했습니다.'
      : '이번 화면에 기록을 보관합니다. 브라우저 저장소를 사용할 수 없습니다.',
  );
});
render();
