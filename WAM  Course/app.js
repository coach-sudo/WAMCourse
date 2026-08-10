(() => {
  'use strict';

  const COURSE = window.WAM_COURSE;
  const REFERENCE = window.WAM_REFERENCE;
  const MASTERY = window.WAM_MASTERY;
  const STORAGE_KEY = 'wamInstructorLabState-v1';
  const DB_NAME = 'wamInstructorLabDB';
  const DB_STORE = 'recordings';

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const esc = (s='') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const clamp = (n,min,max) => Math.min(max,Math.max(min,n));
  const shuffle = (arr) => [...arr].sort(() => Math.random() - .5);

  const defaultState = () => ({
    version: COURSE.version,
    view: 'dashboard',
    currentModule: COURSE.modules[0].id,
    currentActivity: null,
    completed: {},
    notes: {},
    quiz: {},
    classify: {},
    sortOrders: {},
    revealTried: {},
    checklist: {},
    randomTeach: {},
    practiceIndex: 0,
    practiceTimer: 60,
    mastery: {
      activeWorkshop: null,
      gauntletActive: false,
      gauntletStartedAt: null,
      practiceTestWorkshop: null,
      referencePeeks: 0,
      workshops: {}
    },
    learnerName: COURSE.defaultLearner,
    settings: {
      coachMode: true,
      speechRate: 0.98,
      voiceName: '',
      naturalVoice: true,
      reducedMotion: false,
      highContrast: false
    }
  });

  let state = loadState();
  let activeGuided = null;
  let activePracticeTimer = null;
  let currentRecorder = null;
  let mediaStream = null;
  let mediaChunks = [];
  let recordingTimer = null;
  let recordingSeconds = 0;
  let voices = [];
  let toastTimer = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const saved = JSON.parse(raw);
      return deepMerge(defaultState(), saved);
    } catch (e) {
      console.warn('Could not load state', e);
      return defaultState();
    }
  }

  function deepMerge(base, saved) {
    const out = {...base};
    Object.keys(saved || {}).forEach(k => {
      if (saved[k] && typeof saved[k] === 'object' && !Array.isArray(saved[k]) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) {
        out[k] = deepMerge(base[k], saved[k]);
      } else out[k] = saved[k];
    });
    return out;
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { /* Standalone/file contexts may deny storage; the in-memory session still works. */ }
    updateHeaderStats();
  }

  function allActivities() {
    return COURSE.modules.flatMap(m => m.activities.map(a => ({...a,moduleId:m.id,moduleTitle:m.title})));
  }

  function findActivity(id) {
    for (const m of COURSE.modules) {
      const a = m.activities.find(x => x.id === id);
      if (a) return {activity:a,module:m};
    }
    return null;
  }

  function moduleComplete(id) {
    const m = COURSE.modules.find(x => x.id === id);
    return !!m && m.activities.every(a => state.completed[a.id]);
  }

  function completionStats() {
    const acts = allActivities();
    const completedActs = acts.filter(a => state.completed[a.id]);
    const minutes = completedActs.reduce((sum,a) => sum + a.minutes,0);
    const percent = Math.round((minutes / COURSE.totalMinutes) * 100);
    return {minutes,percent,count:completedActs.length,total:acts.length};
  }

  function getXP() {
    let xp = 0;
    for (const {activity:a} of allActivities().map(x => ({activity:x}))) {
      if (state.completed[a.id]) xp += a.xp || 25;
      if ((a.type === 'quiz' || a.type === 'classify') && state.quiz[a.id]?.best != null) {
        xp += Math.round((state.quiz[a.id].best / 100) * 25);
      }
      if (a.type === 'classify' && state.classify[a.id]?.best != null) {
        xp += Math.round((state.classify[a.id].best / 100) * 25);
      }
    }
    return xp;
  }

  function currentLevel() {
    const xp = getXP();
    return [...COURSE.levels].reverse().find(l => xp >= l.min) || COURSE.levels[0];
  }

  function finalExamScore() {
    return state.quiz['prac-final']?.best || 0;
  }

  function masteryState(id) {
    state.mastery = state.mastery || defaultState().mastery;
    state.mastery.workshops = state.mastery.workshops || {};
    if (!state.mastery.workshops[id]) {
      state.mastery.workshops[id] = {order:null,recallAnswers:{},sequenceScore:0,precision:{answers:{},score:0},rubric:{},recorded:false,exerciseRecorded:false,exerciseRubric:{},certified:false,attempts:0};
    }
    return state.mastery.workshops[id];
  }

  function masteryCertifiedCount() {
    return MASTERY.workshops.filter(w => masteryState(w.id).practicePassed || masteryState(w.id).certified).length;
  }

  function masteryReady() {
    const started=Number(state.mastery.gauntletStartedAt || 0);
    return started > 0
      && MASTERY.workshops.every(w => gauntletCertificationValid(masteryState(w.id)))
      && COURSE.modules.every(m => moduleComplete(m.id))
      && finalExamScore() >= MASTERY.passThreshold
      && (state.mastery.referencePeeks || 0) === 0;
  }

  function earnedBadges() {
    const earned = [];
    const anyRecord = allActivities().some(a => a.type === 'record' && state.completed[a.id]);
    if (anyRecord) earned.push('first-take');
    if (moduleComplete('voice')) earned.push('instrument');
    if (moduleComplete('pressure')) earned.push('cartographer');
    if (moduleComplete('listening')) earned.push('partner');
    if (moduleComplete('camera')) earned.push('camera');
    if (moduleComplete('rehearsal')) earned.push('rehearsal');
    if (masteryReady()) earned.push('wam-ready');
    return earned;
  }

  function markComplete(id, silent=false) {
    if (!state.completed[id]) {
      state.completed[id] = Date.now();
      const found = findActivity(id);
      if (!silent && found) toast(`+${found.activity.xp || 25} XP · ${found.activity.title}`);
    }
    saveState();
  }

  function toast(msg) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  function applySettings() {
    document.documentElement.classList.toggle('reduced-motion', !!state.settings.reducedMotion);
    document.documentElement.classList.toggle('high-contrast', !!state.settings.highContrast);
  }

  function updateHeaderStats() {
    const stats = completionStats();
    const xp = getXP();
    const level = currentLevel();
    const xpEl = $('#header-xp');
    const prEl = $('#header-progress');
    const lvEl = $('#header-level');
    if (xpEl) xpEl.textContent = `${xp} XP`;
    if (prEl) prEl.textContent = `${stats.percent}%`;
    if (lvEl) lvEl.textContent = level.name;
  }

  function voiceQualityScore(v) {
    const n=(v?.name||'').toLowerCase();
    const l=(v?.lang||'').toLowerCase();
    let score=0;
    if(l.startsWith('en-us')) score+=35; else if(l.startsWith('en')) score+=20;
    if(/natural|neural|online|enhanced|premium/.test(n)) score+=60;
    if(/aria|jenny|ava|andrew|guy|samantha|google us english|microsoft/.test(n)) score+=25;
    if(v?.localService) score+=4;
    return score;
  }

  function bestNaturalVoice() {
    return [...voices].filter(v => /^en/i.test(v.lang||'')).sort((a,b)=>voiceQualityScore(b)-voiceQualityScore(a))[0] || voices[0] || null;
  }

  function initVoices() {
    voices = speechSynthesis?.getVoices?.() || [];
    const select = $('#voice-select');
    if (select) populateVoiceSelect(select);
  }
  if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = initVoices;
    setTimeout(initVoices, 200);
  }

  function speechChunks(text) {
    const cleaned=String(text)
      .replace(/→/g,' then ')
      .replace(/•/g,', ')
      .replace(/\s+/g,' ')
      .trim();
    const sentences=cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleaned];
    const chunks=[];
    for(const sentence of sentences){
      const parts=sentence.trim().split(/(?<=[,;:])\s+/);
      let current='';
      for(const part of parts){
        if((current+' '+part).trim().length>180 && current){chunks.push(current.trim());current=part;}
        else current=(current+' '+part).trim();
      }
      if(current)chunks.push(current);
    }
    return chunks.filter(Boolean);
  }

  function speak(text, opts={}) {
    if (!('speechSynthesis' in window)) {
      toast('Text-to-speech is not available in this browser.');
      return;
    }
    speechSynthesis.cancel();
    const chunks=speechChunks(text);
    if(!chunks.length)return;
    const selected = voices.find(v => v.name === state.settings.voiceName) || (state.settings.naturalVoice ? bestNaturalVoice() : null);
    let i=0;
    const base=opts.rate || Number(state.settings.speechRate || .98);
    const next=()=>{
      if(i>=chunks.length)return;
      const u=new SpeechSynthesisUtterance(chunks[i]);
      if(selected)u.voice=selected;
      const drift=(i%3===1?0.015:i%3===2?-0.01:0);
      u.rate=clamp(base+drift,.75,1.25);
      u.pitch=clamp(1+(i%4===3?-0.015:0),.9,1.1);
      u.volume=1;
      u.onend=()=>{i++;setTimeout(next, i<chunks.length ? 90 : 0);};
      u.onerror=()=>{i++;setTimeout(next,30);};
      speechSynthesis.speak(u);
    };
    next();
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  function navigate(view, extras={}) {
    stopSpeaking();
    stopGuided();
    state.view = view;
    Object.assign(state, extras);
    saveState();
    render();
    window.scrollTo({top:0,behavior: state.settings.reducedMotion ? 'auto' : 'smooth'});
  }

  function resumeCourse() {
    for (const m of COURSE.modules) {
      const a = m.activities.find(x => !state.completed[x.id]);
      if (a) return navigate('activity',{currentModule:m.id,currentActivity:a.id});
    }
    navigate('dashboard');
  }

  function render() {
    applySettings();
    renderNav();
    updateHeaderStats();
    const main = $('#app');
    if (!main) return;
    switch (state.view) {
      case 'course': main.innerHTML = renderCourseMap(); break;
      case 'module': main.innerHTML = renderModule(state.currentModule); break;
      case 'activity': main.innerHTML = renderActivityView(state.currentActivity); break;
      case 'mastery': main.innerHTML = renderMasteryHome(); break;
      case 'mastery-workshop': main.innerHTML = renderMasteryWorkshop(state.mastery.activeWorkshop); break;
      case 'gauntlet': main.innerHTML = renderGauntlet(); break;
      case 'practice': main.innerHTML = renderPractice(); break;
      case 'reference': main.innerHTML = renderReference(); break;
      case 'research': main.innerHTML = renderResearch(); break;
      case 'settings': main.innerHTML = renderSettings(); break;
      case 'certificate': main.innerHTML = renderCertificate(); break;
      default: main.innerHTML = renderDashboard();
    }
    bindViewEvents();
    maybeCoachRead();
  }

  function renderNav() {
    const nav = $('#main-nav');
    if (!nav) return;
    $$('.nav-btn', nav).forEach(btn => btn.classList.toggle('active', btn.dataset.view === state.view || (state.view === 'activity' || state.view === 'module') && btn.dataset.view === 'course' || (state.view === 'mastery-workshop' || state.view === 'gauntlet') && btn.dataset.view === 'mastery'));
  }

  function icon(name) {
    const icons = {
      play:'▶', check:'✓', mic:'●', book:'▤', flask:'✦', gear:'⚙', trophy:'◆', arrow:'→', clock:'◷', camera:'▣', speaker:'◖', lock:'◇', spark:'✧'
    };
    return `<span class="icon" aria-hidden="true">${icons[name] || '•'}</span>`;
  }

  function renderDashboard() {
    const stats = completionStats();
    const xp = getXP();
    const level = currentLevel();
    const badges = earnedBadges();
    const next = allActivities().find(a => !state.completed[a.id]);
    return `
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">FINAL PRODUCTION · v${esc(COURSE.version)}</p>
          <h1>Know the WAM curriculum well enough to <em>teach it cold.</em></h1>
          <p class="lede">A six-hour active instructor course plus a closed-book mastery gate. You study the architecture, rehearse the exercises, diagnose teaching problems, and then prove you can reconstruct and teach every workshop without the lesson plan in front of you.</p>
          <div class="hero-actions">
            <button class="btn primary" data-action="resume">${icon('play')} ${next ? 'Resume training' : 'Review completed course'}</button>
            <button class="btn ghost" data-nav="course">View course map</button>
          </div>
          <div class="hero-note">Core training: <strong>6:00 hours</strong> · The final no-notes gauntlet is built into the practicum. Extra remediation only appears when a mastery gate is missed.</div>
        </div>
        <div class="score-card">
          <div class="score-ring" style="--p:${stats.percent}"><span>${stats.percent}%</span></div>
          <div>
            <strong>${stats.minutes} / ${COURSE.totalMinutes} min</strong>
            <span>${stats.count} of ${stats.total} activities complete</span>
          </div>
          <div class="score-row"><span>XP</span><strong>${xp}</strong></div>
          <div class="score-row"><span>Level</span><strong>${esc(level.name)}</strong></div>
          <div class="score-row"><span>No-notes workshops</span><strong>${MASTERY.workshops.filter(w=>gauntletCertificationValid(masteryState(w.id))).length}/${MASTERY.workshops.length}</strong></div>
          <div class="score-row"><span>Final exam</span><strong>${finalExamScore() || '—'}${finalExamScore() ? '%' : ''}</strong></div>
        </div>
      </section>

      <section class="mastery-callout">
        <div><p class="eyebrow">NEW · NO-NOTES CERTIFICATION</p><h2>Completion is not the same thing as being ready to teach.</h2><p>The Mastery Lab makes you reconstruct each workshop, pass precision checks, and record yourself teaching it without notes. Your certificate stays locked until all twelve authored WAM workshop maps clear a clean gauntlet and the final exam is at least ${MASTERY.passThreshold}%.</p></div>
        <button class="btn primary" data-nav="mastery">Open Mastery Lab ${icon('arrow')}</button>
      </section>

      <section class="section-block">
        <div class="section-heading"><div><p class="eyebrow">COURSE MAP</p><h2>Eight modules. One cumulative system.</h2></div><button class="text-btn" data-nav="course">Open full map ${icon('arrow')}</button></div>
        <div class="module-grid compact">
          ${COURSE.modules.map(m => moduleCard(m)).join('')}
        </div>
      </section>

      <section class="split-section">
        <div class="panel">
          <p class="eyebrow">MASTERY</p>
          <h2>Your instructor tracks</h2>
          ${COURSE.modules.slice(2,7).map(m => masteryRow(m)).join('')}
        </div>
        <div class="panel">
          <p class="eyebrow">BADGES</p>
          <h2>Earned by doing</h2>
          <div class="badge-grid">
            ${COURSE.badges.map(b => `<div class="badge ${badges.includes(b.id)?'earned':''}" title="${esc(b.desc)}"><span>${badges.includes(b.id)?'◆':'◇'}</span><div><strong>${esc(b.name)}</strong><small>${esc(b.desc)}</small></div></div>`).join('')}
          </div>
        </div>
      </section>

      ${badges.includes('wam-ready') ? `<section class="completion-callout"><div><p class="eyebrow">COURSE COMPLETE</p><h2>You cleared the WAM Instructor Lab and the no-notes gauntlet.</h2><p>You demonstrated the full workshop architecture from memory, cleared the precision checks, recorded the teach-backs, and passed the final exam. Use Practice Lab for brief refreshers before WAM.</p></div><button class="btn primary" data-nav="certificate">${icon('trophy')} Open certificate</button></section>` : ''}
    `;
  }

  function masteryRow(m) {
    const done = m.activities.filter(a => state.completed[a.id]).length;
    const pct = Math.round(done / m.activities.length * 100);
    return `<div class="mastery-row"><div><strong>${esc(m.title)}</strong><span>${done}/${m.activities.length} activities</span></div><div class="mini-progress"><span style="width:${pct}%"></span></div><b>${pct}%</b></div>`;
  }

  function moduleCard(m) {
    const done = m.activities.filter(a => state.completed[a.id]).length;
    const pct = Math.round(done / m.activities.length * 100);
    return `<button class="module-card" data-module="${m.id}">
      <div class="module-card-top"><span class="module-no">${esc(m.number)}</span><span class="minutes">${icon('clock')} ${m.minutes} min</span></div>
      <h3>${esc(m.title)}</h3>
      <p>${esc(m.objective)}</p>
      <div class="module-progress"><span style="width:${pct}%"></span></div>
      <div class="module-meta"><span>${done}/${m.activities.length} complete</span><strong>${pct}% ${icon('arrow')}</strong></div>
    </button>`;
  }

  function renderCourseMap() {
    const stats = completionStats();
    return `
      ${pageHeader('Course map','Six hours, deliberately weighted toward doing','Every required activity below contributes to the 360-minute active course plan. You can jump around, but the sequence is designed to reactivate prior learning before adding complexity.')}
      <div class="course-summary-bar"><span><strong>${stats.minutes}</strong> min complete</span><span><strong>${getXP()}</strong> XP</span><span><strong>${stats.percent}%</strong> course</span></div>
      <div class="module-grid">
        ${COURSE.modules.map(m => moduleCard(m)).join('')}
      </div>
      <section class="method-strip">
        <div><strong>Recall</strong><span>Retrieve before rereading.</span></div>
        <div><strong>Rehearse</strong><span>Say it, lead it, record it.</span></div>
        <div><strong>Diagnose</strong><span>Choose the teacher move.</span></div>
        <div><strong>Repeat</strong><span>Try again after feedback.</span></div>
      </section>
    `;
  }

  function pageHeader(kicker,title,desc) {
    return `<section class="page-header"><p class="eyebrow">${esc(kicker)}</p><h1>${esc(title)}</h1><p>${esc(desc)}</p></section>`;
  }

  function moduleMasteryIds(moduleId) {
    return ({
      voice:['voice-thu','voice-fri','voice-sat','voice-sun'],
      pressure:['pressure-1','pressure-2','pressure-3'],
      listening:['listening-1','listening-2'],
      camera:['camera-1','camera-2'],
      rehearsal:['rehearse']
    })[moduleId] || [];
  }

  function renderModule(moduleId) {
    const m = COURSE.modules.find(x => x.id === moduleId) || COURSE.modules[0];
    const done = m.activities.filter(a => state.completed[a.id]).length;
    const pct = Math.round(done / m.activities.length * 100);
    return `
      <button class="back-link" data-nav="course">← Course map</button>
      <section class="module-hero">
        <div><p class="eyebrow">MODULE ${esc(m.number)} · ${m.minutes} MIN</p><h1>${esc(m.title)}</h1><p>${esc(m.objective)}</p></div>
        <div class="module-big-progress"><strong>${pct}%</strong><span>${done}/${m.activities.length} activities</span></div>
      </section>
      ${moduleMasteryIds(m.id).length?`<section class="module-mastery-strip"><div><p class="eyebrow">DEEP TEACHING MAPS</p><h2>Learn the actual workshops, then close the notes.</h2><p>These labs contain the full sequence, exercise purposes, facilitator language, traps, recovery moves, and the no-notes certification checks for this module.</p></div><div class="module-mastery-links">${moduleMasteryIds(m.id).map(id=>{const w=masteryWorkshop(id);return `<button class="small-btn" data-open-mastery="${id}">${esc(w.label)} →</button>`}).join('')}</div></section>`:''}
      <div class="activity-list">
        ${m.activities.map((a,i) => activityRow(a,i,m)).join('')}
      </div>
      <div class="module-tools">
        <button class="btn ghost" data-nav="reference">${icon('book')} Open lesson-plan reference</button>
        ${done < m.activities.length ? `<button class="btn primary" data-open-activity="${(m.activities.find(a=>!state.completed[a.id])||m.activities[0]).id}">${icon('play')} Continue module</button>` : `<button class="btn primary" data-nav="course">Module complete ${icon('check')}</button>`}
      </div>
    `;
  }

  function activityRow(a,i,m) {
    const done = !!state.completed[a.id];
    const label = typeLabel(a.type);
    return `<button class="activity-row ${done?'done':''}" data-open-activity="${a.id}">
      <span class="activity-index">${done?'✓':String(i+1).padStart(2,'0')}</span>
      <span class="activity-copy"><strong>${esc(a.title)}</strong><small>${esc(label)} · ${a.minutes} min · ${a.xp || 25} XP</small></span>
      <span class="activity-arrow">→</span>
    </button>`;
  }

  function typeLabel(type) {
    return ({brief:'Listen / read',record:'Teach-back',quiz:'Decision challenge',sort:'Sequence challenge',classify:'Classification game',guided:'Guided doing',reflection:'Write / self-explain',checklist:'Commitment',reveal:'Retrieval challenge',do:'Say / do',randomTeach:'Cold teach'})[type] || 'Activity';
  }

  function renderActivityView(activityId) {
    const found = findActivity(activityId);
    if (!found) return renderCourseMap();
    const {activity:a,module:m} = found;
    const index = m.activities.findIndex(x => x.id === a.id);
    const prev = index > 0 ? m.activities[index-1] : null;
    const next = index < m.activities.length - 1 ? m.activities[index+1] : null;
    const done = !!state.completed[a.id];
    return `
      <div class="activity-shell">
        <aside class="activity-rail">
          <button class="back-link" data-module="${m.id}">← ${esc(m.title)}</button>
          <div class="rail-progress"><span>Module ${m.number}</span><strong>${m.activities.filter(x=>state.completed[x.id]).length}/${m.activities.length}</strong></div>
          <div class="rail-list">${m.activities.map((x,i)=>`<button class="rail-item ${x.id===a.id?'current':''} ${state.completed[x.id]?'done':''}" data-open-activity="${x.id}"><span>${state.completed[x.id]?'✓':i+1}</span>${esc(x.title)}</button>`).join('')}</div>
        </aside>
        <article class="activity-main">
          <div class="activity-header">
            <div><p class="eyebrow">${esc(typeLabel(a.type).toUpperCase())} · ${a.minutes} MIN · ${a.xp || 25} XP</p><h1>${esc(a.title)}</h1></div>
            <span class="status-pill ${done?'complete':''}">${done?'Complete':'In progress'}</span>
          </div>
          ${renderActivityBody(a)}
          <div class="activity-footer">
            <button class="btn ghost" ${prev?`data-open-activity="${prev.id}"`:'disabled'}>← Previous</button>
            <div class="footer-center">${done ? '<span class="completion-note">✓ Activity logged</span>' : ''}</div>
            ${next ? `<button class="btn primary" data-open-activity="${next.id}">Next →</button>` : `<button class="btn primary" data-module="${m.id}">Module overview →</button>`}
          </div>
        </article>
      </div>
    `;
  }

  function renderActivityBody(a) {
    switch(a.type) {
      case 'brief': return renderBrief(a);
      case 'record': return renderRecord(a);
      case 'quiz': return renderQuiz(a);
      case 'sort': return renderSort(a);
      case 'classify': return renderClassify(a);
      case 'guided': return renderGuided(a);
      case 'reflection': return renderReflection(a);
      case 'checklist': return renderChecklist(a);
      case 'reveal': return renderReveal(a);
      case 'do': return renderDo(a);
      case 'randomTeach': return renderRandomTeach(a);
      default: return '<p>Activity unavailable.</p>';
    }
  }

  function renderBrief(a) {
    return `<section class="activity-card">
      <div class="listen-bar"><span>${icon('speaker')} Coach read-aloud available</span><div><button class="small-btn" data-speak="${encodeURIComponent(a.coachScript || a.body.join(' '))}">Read aloud</button><button class="small-btn" data-stop-speech>Stop</button></div></div>
      <div class="prose">${a.body.map(p=>`<p>${esc(p)}</p>`).join('')}</div>
      ${completeButton(a.id)}
    </section>`;
  }

  function renderRecord(a) {
    return `<section class="activity-card">
      <div class="prompt-box"><p class="eyebrow">YOUR TASK</p><p>${esc(a.prompt)}</p></div>
      ${a.readerPrompts ? `<div class="reader-prompt-box"><button class="btn ghost" data-reader-prompt="${a.id}">${icon('speaker')} Read a random partner prompt</button><span id="reader-prompt-text">Use this after you are framed and ready.</span></div>`:''}
      <div class="recording-panel" data-recorder="${a.id}">
        <div class="record-status"><span class="record-dot"></span><strong id="record-status-${a.id}">Ready to record ${a.mode==='video'?'video':'audio'}</strong><span id="record-time-${a.id}">0:00</span></div>
        ${a.mode==='video'?`<video id="preview-${a.id}" class="camera-preview" playsinline muted></video>`:''}
        <div class="record-controls">
          <button class="btn primary" data-record-start="${a.id}" data-mode="${a.mode || 'audio'}">${icon('mic')} Start recording</button>
          <button class="btn danger" data-record-stop="${a.id}" disabled>Stop</button>
          <button class="btn ghost" data-record-play="${a.id}" disabled>Play saved take</button>
        </div>
        <audio id="playback-${a.id}" controls hidden></audio>
        ${a.mode==='video'?`<video id="playback-video-${a.id}" class="camera-preview playback" controls hidden playsinline></video>`:''}
        <p class="privacy-note">Recordings are stored only in this browser using local device storage. Nothing is uploaded by this app.</p>
      </div>
      <details class="rubric"><summary>Self-score rubric after your take</summary><ul>${a.rubric.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>
      ${completeButton(a.id,'I recorded and reviewed a take')}
    </section>`;
  }

  function completeButton(id,label='Mark activity complete') {
    if (state.completed[id]) return `<button class="btn complete-btn" disabled>${icon('check')} Complete</button>`;
    return `<button class="btn primary complete-btn" data-complete="${id}">${icon('check')} ${esc(label)}</button>`;
  }

  function ensureQuizState(a) {
    if (!state.quiz[a.id]) state.quiz[a.id] = {index:0,answers:[],finished:false,best:0,streak:0};
    return state.quiz[a.id];
  }

  function renderQuiz(a) {
    const qst = ensureQuizState(a);
    const qIndex = clamp(qst.index,0,a.questions.length-1);
    const q = a.questions[qIndex];
    if (qst.finished) {
      const score = qst.lastScore ?? qst.best;
      const threshold = a.final ? MASTERY.passThreshold : 80;
      return `<section class="activity-card quiz-card">
        <div class="result-hero ${score>=threshold?'pass':''}"><span>${score}%</span><div><p class="eyebrow">${a.final?'FINAL EXAM':'CHALLENGE COMPLETE'}</p><h2>${score>=threshold?'Strong pass':'Run it again'}</h2><p>Best score: <strong>${qst.best}%</strong>${a.final ? ` · ${MASTERY.passThreshold}% required for WAM Ready certification.` : ''}</p></div></div>
        <div class="quiz-actions"><button class="btn ghost" data-quiz-restart="${a.id}">Retry challenge</button>${completeButton(a.id, score>=threshold || !a.final ? 'Log this challenge' : 'Log attempt and continue')}</div>
      </section>`;
    }
    const prior = qst.answers[qIndex];
    return `<section class="activity-card quiz-card">
      <div class="quiz-top"><span>Question ${qIndex+1} / ${a.questions.length}</span><span>Streak: ${qst.streak || 0}</span></div>
      <div class="quiz-meter"><span style="width:${(qIndex/a.questions.length)*100}%"></span></div>
      <h2 class="question">${esc(q.q)}</h2>
      <div class="choice-list">
        ${q.choices.map((c,i)=>{
          let cls='';
          if (prior) {
            if (i===q.answer) cls='correct';
            else if (i===prior.choice && !prior.correct) cls='wrong';
          }
          return `<button class="choice ${cls}" data-quiz-choice="${i}" data-quiz-id="${a.id}" ${prior?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${esc(c)}</button>`;
        }).join('')}
      </div>
      ${prior ? `<div class="feedback ${prior.correct?'good':'bad'}"><strong>${prior.correct?'Correct.':'Not quite.'}</strong><p>${esc(q.why)}</p></div><button class="btn primary" data-quiz-next="${a.id}">${qIndex===a.questions.length-1?'Finish challenge':'Next question →'}</button>` : `<p class="microcopy">Choose before rereading. Immediate feedback is part of the training.</p>`}
    </section>`;
  }

  function renderSort(a) {
    if (!state.sortOrders[a.id]) state.sortOrders[a.id] = shuffle(a.items);
    const order = state.sortOrders[a.id];
    const correct = JSON.stringify(order) === JSON.stringify(a.correct);
    return `<section class="activity-card">
      <div class="prompt-box"><p class="eyebrow">SEQUENCE CHALLENGE</p><p>${esc(a.prompt)}</p></div>
      <div class="sort-list">
        ${order.map((item,i)=>`<div class="sort-item"><span class="grab">${i+1}</span><strong>${esc(item)}</strong><div><button aria-label="Move up" data-sort-up="${a.id}" data-index="${i}" ${i===0?'disabled':''}>↑</button><button aria-label="Move down" data-sort-down="${a.id}" data-index="${i}" ${i===order.length-1?'disabled':''}>↓</button></div></div>`).join('')}
      </div>
      <div id="sort-feedback-${a.id}"></div>
      <button class="btn primary" data-sort-check="${a.id}">Check sequence</button>
      ${state.completed[a.id] ? `<div class="feedback good"><strong>Mastered.</strong><p>${esc(a.why)}</p></div>`:''}
    </section>`;
  }

  function ensureClassifyState(a) {
    if (!state.classify[a.id]) state.classify[a.id] = {index:0,answers:[],finished:false,best:0,streak:0};
    return state.classify[a.id];
  }

  function renderClassify(a) {
    const cs = ensureClassifyState(a);
    if (cs.finished) {
      return `<section class="activity-card quiz-card"><div class="result-hero ${cs.lastScore>=80?'pass':''}"><span>${cs.lastScore}%</span><div><p class="eyebrow">CLASSIFICATION COMPLETE</p><h2>${cs.lastScore>=80?'You can see the pattern.':'Mix it again.'}</h2><p>Best score: <strong>${cs.best}%</strong></p></div></div><div class="quiz-actions"><button class="btn ghost" data-classify-restart="${a.id}">Shuffle and retry</button>${completeButton(a.id,'Log classification round')}</div></section>`;
    }
    const c = a.cases[cs.index];
    const prior = cs.answers[cs.index];
    return `<section class="activity-card quiz-card">
      <div class="quiz-top"><span>Case ${cs.index+1} / ${a.cases.length}</span><span>Streak: ${cs.streak||0}</span></div>
      <div class="quiz-meter"><span style="width:${(cs.index/a.cases.length)*100}%"></span></div>
      <h2 class="case-text">${esc(c.text)}</h2>
      <div class="category-grid">${a.categories.map(cat=>`<button class="category-btn ${prior && cat===c.answer?'correct':''} ${prior && cat===prior.choice && !prior.correct?'wrong':''}" data-classify-choice="${esc(cat)}" data-classify-id="${a.id}" ${prior?'disabled':''}>${esc(cat)}</button>`).join('')}</div>
      ${prior?`<div class="feedback ${prior.correct?'good':'bad'}"><strong>${prior.correct?'Correct.':`Best answer: ${esc(c.answer)}`}</strong><p>${esc(c.why)}</p></div><button class="btn primary" data-classify-next="${a.id}">${cs.index===a.cases.length-1?'Finish round':'Next case →'}</button>`:''}
    </section>`;
  }

  function renderGuided(a) {
    const g = activeGuided?.id === a.id ? activeGuided : null;
    const phase = g ? a.phases[g.phaseIndex] : a.phases[0];
    return `<section class="activity-card guided-card">
      <div class="prompt-box"><p class="eyebrow">GET OUT OF THE CHAIR</p><p>${esc(a.intro)}</p></div>
      <div class="guided-stage ${g?'running':''}">
        <div class="guided-label">${esc(phase.label)}</div>
        <div class="guided-time" id="guided-time">${formatTime(g ? g.remaining : phase.seconds)}</div>
        <p id="guided-script">${esc(phase.script)}</p>
        <div class="guided-controls">
          ${!g ? `<button class="btn primary" data-guided-start="${a.id}">${icon('play')} Start guided run</button>` : `<button class="btn danger" data-guided-stop>Stop</button><button class="btn ghost" data-guided-skip="${a.id}">Next phase →</button>`}
          <button class="btn ghost" data-speak="${encodeURIComponent(phase.script)}">${icon('speaker')} Read this phase</button>
        </div>
      </div>
      <details class="debrief"><summary>Debrief questions</summary><ul>${a.debrief.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>
      ${completeButton(a.id,'I did the guided run and debriefed it')}
    </section>`;
  }

  function renderReflection(a) {
    const value = state.notes[a.id] || '';
    return `<section class="activity-card"><div class="prompt-box"><p class="eyebrow">SELF-EXPLANATION</p><p>${esc(a.prompt)}</p></div>
      <textarea class="reflection" data-note="${a.id}" placeholder="${esc(a.placeholder || 'Write your answer here…')}">${esc(value)}</textarea>
      ${a.checklist?`<ul class="criteria-list">${a.checklist.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
      ${completeButton(a.id,'Save reflection and continue')}
    </section>`;
  }

  function renderChecklist(a) {
    const checks = state.checklist[a.id] || {};
    const all = a.items.every((_,i)=>checks[i]);
    return `<section class="activity-card"><div class="checklist">${a.items.map((item,i)=>`<label><input type="checkbox" data-checklist="${a.id}" data-index="${i}" ${checks[i]?'checked':''}><span>${esc(item)}</span></label>`).join('')}</div>${all?completeButton(a.id,'Lock in the contract'):`<p class="microcopy">Check every item before logging this activity.</p>`}</section>`;
  }

  function renderReveal(a) {
    const tried = !!state.revealTried[a.id];
    return `<section class="activity-card">
      <div class="prompt-box"><p class="eyebrow">RETRIEVE FIRST</p><p>${esc(a.prompt)}</p></div>
      <label class="try-check"><input type="checkbox" data-reveal-tried="${a.id}" ${tried?'checked':''}><span>I actually tried it before revealing.</span></label>
      ${tried?`<details class="reveal-panel" open><summary>Model answer</summary><ol>${a.reveal.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></details>${completeButton(a.id,'I compared my recall to the model')}`:`<div class="locked-reveal">Say it out loud first. Then check the box.</div>`}
    </section>`;
  }

  function renderDo(a) {
    const text = [...(a.instructions||[]),...(a.prompts||[])].join(' ');
    return `<section class="activity-card"><div class="prompt-box"><p class="eyebrow">DO IT OUT LOUD</p>${a.instructions.map(x=>`<p>${esc(x)}</p>`).join('')}</div>
      ${a.prompts?`<div class="spoken-stack">${a.prompts.map(p=>`<button class="spoken-line" data-speak="${encodeURIComponent(p)}"><span>${icon('speaker')}</span>${esc(p)}</button>`).join('')}</div>`:''}
      <button class="btn ghost" data-speak="${encodeURIComponent(text)}">Read full activity aloud</button>
      ${completeButton(a.id,'I said and rehearsed the prompts')}
    </section>`;
  }

  function renderRandomTeach(a) {
    if (!state.randomTeach[a.id]) state.randomTeach[a.id] = a.workshops[Math.floor(Math.random()*a.workshops.length)];
    const draw = state.randomTeach[a.id];
    const fauxRecord = {...a,type:'record',mode:'audio',maxSeconds:300,prompt:`YOUR DRAW: ${draw}. ${a.prompt}`};
    return `<section class="activity-card random-draw"><p class="eyebrow">YOUR RANDOM DRAW</p><div class="draw-title">${esc(draw)}</div><button class="small-btn" data-redraw="${a.id}">Draw a different workshop</button></section>${renderRecord(fauxRecord)}`;
  }

  function masteryWorkshop(id) {
    return MASTERY.workshops.find(w => w.id === id) || MASTERY.workshops[0];
  }

  function gauntletCertificationValid(ms) {
    const started = Number(state.mastery.gauntletStartedAt || 0);
    return !!ms.certified && !!ms.certifiedAt && started > 0 && ms.certifiedAt >= started;
  }

  function workshopMasteryPercent(w) {
    const ms=masteryState(w.id);
    let points=0;
    if(ms.sequenceScore===100) points+=30;
    if((ms.precision?.score||0)>=MASTERY.passThreshold) points+=30;
    if(ms.recorded) points+=10;
    if(ms.exerciseRecorded) points+=10;
    const rubricCount=MASTERY.teachbackRubric.filter((_,i)=>ms.rubric?.[i]).length;
    const exRubricCount=exerciseRubric().filter((_,i)=>ms.exerciseRubric?.[i]).length;
    points+=Math.round((rubricCount/MASTERY.teachbackRubric.length)*10);
    points+=Math.round((exRubricCount/exerciseRubric().length)*10);
    return clamp(points,0,100);
  }

  function masteryPrecisionQuestions(w) {
    const others=MASTERY.workshops.filter(x=>x.id!==w.id);
    const idx=MASTERY.workshops.findIndex(x=>x.id===w.id);
    const otherA=others[idx % others.length];
    const otherB=others[(idx*3+2) % others.length];
    const middle=w.steps[Math.floor(w.steps.length/2)] || w.steps[0];
    const first=w.steps[0], last=w.steps[w.steps.length-1];
    return [
      {q:'What is the central teaching job of this workshop?',choices:[w.mission,otherA.mission,otherB.mission],answer:0,why:w.mission},
      {q:'Which opening frame belongs to this workshop?',choices:[otherA.opening,w.opening,otherB.opening],answer:1,why:w.opening},
      {q:`Which step comes first?`,choices:[middle?.title||'',last?.title||'',first?.title||''],answer:2,why:`The workshop opens with “${first?.title||''}.”`},
      {q:`What is the purpose of “${middle?.title||''}”?`,choices:[otherA.steps[Math.min(1,otherA.steps.length-1)]?.purpose||otherA.mission,middle?.purpose||w.mission,otherB.steps[Math.min(2,otherB.steps.length-1)]?.purpose||otherB.mission],answer:1,why:middle?.purpose||w.mission},
      {q:'Which teacher move is a trap here?',choices:[w.rescue[0],w.watch[0],w.rescue[1]||w.rescue[0]],answer:1,why:w.watch[0]}
    ];
  }

  function renderMasteryHome() {
    const certified=masteryCertifiedCount();
    const active=!!state.mastery.gauntletActive;
    const valid=MASTERY.workshops.filter(w=>gauntletCertificationValid(masteryState(w.id))).length;
    return `
      ${pageHeader('No-notes mastery','Know the workshops well enough to teach them, not merely recognize them','Study the complete instructor map, then close it. Rebuild the sequence, pass a precision check, and teach the workshop aloud. The final gauntlet makes you do this without the lesson-plan library.')}
      <section class="mastery-hero ${active?'gauntlet-live':''}">
        <div>
          <p class="eyebrow">${active?'GAUNTLET LIVE · NOTES LOCKED':'INSTRUCTOR CERTIFICATION'}</p>
          <h2>${active?`${valid} / ${MASTERY.workshops.length} workshops cleared this run`:`${certified} / ${MASTERY.workshops.length} workshop practice passes`}</h2>
          <p>${active?'Finish every workshop without opening the lesson-plan library. If you need the notes, end the attempt, review, and start clean.':'Use Study Mode as much as you need. When the maps feel available, start the no-notes gauntlet. A clean run is the evidence standard for the WAM Ready certificate.'}</p>
        </div>
        <div class="mastery-hero-actions">
          ${active
            ? `<button class="btn danger" data-end-gauntlet>End attempt</button><button class="btn primary" data-nav="gauntlet">Open gauntlet board</button>`
            : `<button class="btn primary" data-start-gauntlet>${icon('lock')} Start no-notes gauntlet</button>`}
        </div>
      </section>

      <section class="cert-standard panel">
        <p class="eyebrow">THE STANDARD</p>
        <h2>“I can teach it” means four different things.</h2>
        <div class="standard-grid">
          <div><strong>1. Map</strong><span>Rebuild every major workshop segment in exact order.</span></div>
          <div><strong>2. Explain</strong><span>Know why the workshop and its exercises exist.</span></div>
          <div><strong>3. Diagnose</strong><span>Recognize common teacher traps and useful corrections.</span></div>
          <div><strong>4. Deliver</strong><span>Teach the map aloud, from memory, without hiding behind the document.</span></div>
        </div>
        <p class="fine-print">${esc(MASTERY.certification.disclaimer)}</p>
      </section>

      <div class="mastery-card-grid">
        ${MASTERY.workshops.map(w=>renderMasteryCard(w,active)).join('')}
      </div>

      <section class="panel memory-rule">
        <p class="eyebrow">HOW TO USE THIS</p>
        <h2>Do not reread until you have tried to retrieve.</h2>
        <p>When a workshop feels fuzzy, first say everything you remember out loud. Then open Study Mode and compare. Correct one missing piece. Close the notes. Rebuild it again. The app is intentionally designed to make forgetting visible before it gives you the answer.</p>
      </section>
    `;
  }

  function renderMasteryCard(w, locked=false) {
    const ms=masteryState(w.id);
    const pct=workshopMasteryPercent(w);
    const gauntletPass=gauntletCertificationValid(ms);
    return `<article class="mastery-card ${gauntletPass?'certified':''}">
      <div class="mastery-card-head"><span class="category-pill">${esc(w.category)}</span><span>${esc(w.duration)}</span></div>
      <h3>${esc(w.label)}</h3>
      ${locked?'':`<p>${esc(w.mission)}</p><div class="memory-cue"><small>MEMORY SPINE</small><strong>${esc(w.memory)}</strong></div>`}
      <div class="mastery-meter"><span style="width:${pct}%"></span></div>
      <div class="mastery-status-row">
        <span>Sequence ${ms.sequenceScore||0}%</span><span>Precision ${ms.precision?.score||0}%</span><span>${ms.recorded?'Map saved':'Map needed'}</span><span>${ms.exerciseRecorded?'Exercise rep saved':'Exercise rep needed'}</span>
      </div>
      <button class="btn ${gauntletPass?'ghost':'primary'}" data-open-mastery="${w.id}">${locked?'Test from memory':gauntletPass?'Review / retest':'Study & certify'} ${icon('arrow')}</button>
    </article>`;
  }

  function renderMasteryWorkshop(id) {
    const w=masteryWorkshop(id);
    const ms=masteryState(w.id);
    const inGauntlet=!!state.mastery.gauntletActive;
    const locked=inGauntlet || state.mastery.practiceTestWorkshop===w.id;
    ensureMasteryOrder(w);
    return `
      <button class="back-link" data-nav="${locked?'gauntlet':'mastery'}">← ${locked?'Gauntlet board':'Mastery'}</button>
      <section class="mastery-workshop-hero ${locked?'closed-book':''}">
        <div><p class="eyebrow">${locked?'CLOSED BOOK · CERTIFICATION ATTEMPT':'DEEP INSTRUCTOR LAB'}</p><h1>${esc(w.label)}</h1><p>${esc(w.mission)}</p></div>
        <div class="mastery-scorebox"><strong>${workshopMasteryPercent(w)}%</strong><span>current mastery</span></div>
      </section>
      ${locked ? renderClosedBookWorkshop(w,ms,inGauntlet) : renderStudyWorkshop(w,ms)}
    `;
  }

  function renderStudyWorkshop(w,ms) {
    return `
      <section class="coach-room panel">
        <div class="coach-avatar">D</div>
        <div><p class="eyebrow">YOUR COACH</p><h2>Here is the teaching story.</h2><p>${esc(w.coach)}</p><div class="coach-actions"><button class="btn ghost" data-speak="${encodeURIComponent(w.coach)}">${icon('speaker')} Hear this coaching</button><button class="small-btn" data-stop-speech>Stop</button></div></div>
      </section>

      <section class="panel opening-language">
        <p class="eyebrow">SAY THIS OUT LOUD</p>
        <h2>Your opening frame</h2>
        <blockquote>${esc(w.opening)}</blockquote>
        <p>Say it once exactly as written. Then say it again in your own words without changing the idea. You are training meaning, not memorized copy.</p>
        <button class="btn ghost" data-speak="${encodeURIComponent(w.opening)}">${icon('speaker')} Hear the model</button>
      </section>

      <section class="memory-spine-panel">
        <p class="eyebrow">MEMORY SPINE</p>
        <h2>${esc(w.memory)}</h2>
        <p>This is the shortest usable map of the workshop. Learn the spine first. The detail hangs on it.</p>
      </section>

      <section class="section-block">
        <div class="section-heading"><div><p class="eyebrow">FULL TEACHING MAP</p><h2>Know what happens, why it happens, and what you actually say.</h2></div></div>
        <div class="teaching-step-list">
          ${w.steps.map((step,i)=>renderTeachingStep(w,step,i)).join('')}
        </div>
      </section>

      <section class="split-section teacher-traps">
        <div class="panel"><p class="eyebrow">WATCH FOR THIS</p><h2>Ways you can accidentally break the class</h2><ul class="clean-list">${w.watch.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
        <div class="panel"><p class="eyebrow">ROOM RECOVERY</p><h2>What to do when it goes sideways</h2><ul class="clean-list">${w.rescue.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      </section>

      <section class="retrieval-launch panel">
        <div><p class="eyebrow">CLOSE THE NOTES</p><h2>Now prove the map is in you.</h2><p>The next view hides the teaching plan. Rebuild the sequence, answer five precision questions, record a three-minute no-notes teach-back, and self-audit against the rubric.</p></div>
        <button class="btn primary" data-start-workshop-test="${w.id}">${icon('lock')} Start closed-book check</button>
      </section>
      ${ms.sequenceScore===100 && (ms.precision?.score||0)>=MASTERY.passThreshold ? `<section class="panel"><p class="eyebrow">CURRENT PRACTICE PASS</p><p>You have already cleared the knowledge checks for this workshop. Do it again inside the final gauntlet to count toward WAM Ready certification.</p></section>`:''}
    `;
  }

  function renderTeachingStep(w,step,i) {
    const talk = [step.title, step.purpose, ...step.directions, ...step.prompts.map(p=>'Facilitator prompt: '+p)].filter(Boolean).join('. ');
    return `<article class="teaching-step">
      <div class="step-time"><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(step.time)}</strong></div>
      <div class="step-body">
        <h3>${esc(step.title)}</h3>
        ${step.purpose?`<p class="purpose-callout"><strong>Why this exists:</strong> ${esc(step.purpose)}</p>`:''}
        <div class="step-columns">
          <div><p class="ref-label">WHAT YOU DO</p><ul>${step.directions.map(x=>`<li>${esc(x)}</li>`).join('') || '<li>Use the workshop frame and transition cleanly.</li>'}</ul></div>
          <div><p class="ref-label">WHAT YOU CAN SAY</p>${step.prompts.length?`<ul>${step.prompts.map(x=>`<li>“${esc(x)}”</li>`).join('')}</ul>`:`<p>Use plain language. State the task, then let the actors work before adding more explanation.</p>`}</div>
        </div>
        <div class="step-actions"><button class="small-btn" data-speak="${encodeURIComponent(talk)}">${icon('speaker')} Coach me through this step</button><button class="small-btn" data-step-rep="${w.id}:${i}">60-second direction rep</button></div>
        <div class="step-rep-box" id="step-rep-${w.id}-${i}" hidden><strong>Close the card with your eyes or scroll away.</strong><p>Out loud: explain this step’s purpose, setup, directions, what you are watching for, and how you transition out of it. Then reopen the card and compare.</p></div>
      </div>
    </article>`;
  }

  function memoryKeys(w) {
    return String(w.memory||'').split('→').map(x=>x.trim()).filter(Boolean);
  }

  function recallTokens(text) {
    return String(text||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().split(/\s+/).filter(x=>x && !['the','and','a','an','to','of','vs','with'].includes(x));
  }

  function tokenNear(a,b) {
    if(a===b)return true;
    if(a.length>=4 && b.length>=4 && a.slice(0,4)===b.slice(0,4))return true;
    return a.includes(b) || b.includes(a);
  }

  function recallCueMatches(input,key) {
    const got=recallTokens(input), need=recallTokens(key);
    if(!got.length||!need.length)return false;
    const hits=need.filter(n=>got.some(g=>tokenNear(g,n))).length;
    return hits >= Math.max(1,Math.ceil(need.length*.55));
  }

  function ensureMasteryOrder(w,force=false) {
    const ms=masteryState(w.id);
    if(force || !Array.isArray(ms.order) || ms.order.length!==w.steps.length){
      const ids=w.steps.map((_,i)=>i);
      let mixed=shuffle(ids);
      if(mixed.every((x,i)=>x===ids[i]) && mixed.length>1) [mixed[0],mixed[1]]=[mixed[1],mixed[0]];
      ms.order=mixed;
      saveState();
    }
  }

  function exerciseRubric() {
    return [
      'I stated what this exercise/segment is training.',
      'I gave enough setup that actors would know where to stand, what to use, or how to begin.',
      'I gave the actor task in playable, behavioral language rather than a desired emotional result.',
      'I named at least one thing I would watch for or correct before moving on.'
    ];
  }

  function renderClosedBookWorkshop(w,ms,inGauntlet=false) {
    const qs=masteryPrecisionQuestions(w);
    const rubricDone=MASTERY.teachbackRubric.filter((_,i)=>ms.rubric?.[i]).length;
    const exRubricDone=exerciseRubric().filter((_,i)=>ms.exerciseRubric?.[i]).length;
    const canPass=ms.sequenceScore===100 && (ms.precision?.score||0)>=MASTERY.passThreshold && ms.recorded && ms.exerciseRecorded && rubricDone===MASTERY.teachbackRubric.length && exRubricDone===exerciseRubric().length;
    const exIndex=(MASTERY.workshops.findIndex(x=>x.id===w.id)*2+1)%w.steps.length;
    const exStep=w.steps[exIndex];
    return `
      <section class="closed-book-banner"><strong>${inGauntlet?'Notes are locked. Good.':'Closed-book practice.'}</strong><span>Do not open the lesson plan until you have finished this attempt.</span></section>

      <section class="panel test-section">
        <p class="eyebrow">1 · REBUILD THE WORKSHOP</p><h2>Write the memory spine from a blank screen.</h2>
        <p>One cue per box, in order. The app accepts close wording, but it does not show you the step names first. This is retrieval, not recognition.</p>
        <div class="free-recall-grid">
          ${memoryKeys(w).map((_,pos)=>`<label class="recall-slot"><span>${pos+1}</span><input type="text" autocomplete="off" data-mastery-recall="${w.id}:${pos}" value="${esc(ms.recallAnswers?.[pos]||'')}" placeholder="What comes here?"></label>`).join('')}
        </div>
        <div class="test-result-row"><button class="btn primary" data-check-mastery-sequence="${w.id}">Check free recall</button><button class="btn ghost" data-clear-mastery-recall="${w.id}">Clear & retry</button><strong>${ms.sequenceScore?`${ms.sequenceScore}%`:''}</strong></div>
        ${ms.sequenceScore && ms.sequenceScore<100?`<p class="retrieval-feedback">${memoryKeys(w).filter((k,i)=>!recallCueMatches(ms.recallAnswers?.[i],k)).length} cue(s) are still missing or out of position. The app will not reveal them during a closed-book attempt.</p>`:''}
      </section>

      <section class="panel test-section">
        <p class="eyebrow">2 · PRECISION CHECK</p><h2>Know the purpose, not just the order.</h2>
        <div class="mastery-questions">
          ${qs.map((q,qi)=>`<fieldset class="mastery-question"><legend><span>${qi+1}</span>${esc(q.q)}</legend>${q.choices.map((c,ci)=>`<label><input type="radio" name="mq-${w.id}-${qi}" data-mastery-answer="${w.id}:${qi}:${ci}" ${Number(ms.precision?.answers?.[qi])===ci?'checked':''}><span>${esc(c)}</span></label>`).join('')}</fieldset>`).join('')}
        </div>
        <div class="test-result-row"><button class="btn primary" data-check-mastery-precision="${w.id}">Score precision</button><strong>${ms.precision?.score?`${ms.precision.score}%`:''}</strong></div>
      </section>

      <section class="panel test-section">
        <p class="eyebrow">3 · 90-SECOND WORKSHOP MAP</p><h2>Teach the architecture aloud. No notes.</h2>
        <p>Imagine another instructor asked, “How do I teach this?” In 90 seconds, state the purpose, walk through every major segment in order, name the central exercises, and give at least one coaching principle. This is the compressed map you should be able to retrieve even when the room is moving fast.</p>
        ${renderStandaloneRecorder(`mastery-${w.id}`,90,ms.recorded)}
      </section>

      <section class="panel test-section exercise-sprint">
        <p class="eyebrow">4 · RANDOM EXERCISE DIRECTION</p><h2>${esc(exStep.title)}</h2>
        <p>You drew one exercise/segment from this workshop. In 45 seconds, teach the directions as if the actors are waiting for you: purpose, setup, actor task, what you watch for, and how you know when to move on. Do not open the notes.</p>
        ${renderStandaloneRecorder(`mastery-ex-${w.id}`,45,ms.exerciseRecorded)}
        <div class="rubric-grid compact-rubric">${exerciseRubric().map((r,i)=>`<label class="rubric-item"><input type="checkbox" data-mastery-ex-rubric="${w.id}:${i}" ${ms.exerciseRubric?.[i]?'checked':''}><span>${esc(r)}</span></label>`).join('')}</div>
      </section>

      <section class="panel test-section">
        <p class="eyebrow">5 · WATCH YOUR WORKSHOP MAP</p><h2>Self-audit like an instructor, not a student trying to pass.</h2>
        <p>Check an item only if it was actually present in the recording you just reviewed.</p>
        <div class="rubric-grid">${MASTERY.teachbackRubric.map((r,i)=>`<label class="rubric-item"><input type="checkbox" data-mastery-rubric="${w.id}:${i}" ${ms.rubric?.[i]?'checked':''}><span>${esc(r)}</span></label>`).join('')}</div>
      </section>

      <section class="mastery-submit ${canPass?'ready':''}">
        <div><p class="eyebrow">WORKSHOP GATE</p><h2>${canPass?'You have the evidence.':'Not cleared yet.'}</h2><p>${canPass?'Submit this workshop. In a live gauntlet, this stamps the pass into the current no-notes run.':'You need 100% sequence, at least 90% precision, both recordings saved, and every rubric item honestly satisfied.'}</p></div>
        <button class="btn primary" data-submit-workshop="${w.id}" ${canPass?'':'disabled'}>${inGauntlet?'Clear workshop':'Log practice pass'}</button>
      </section>
      ${!inGauntlet?`<div class="center-actions"><button class="btn ghost" data-open-mastery-study="${w.id}">${icon('book')} Review the full teaching map</button></div>`:''}
    `;
  }

  function renderStandaloneRecorder(id,maxSeconds,recorded=false) {
    return `<div class="recording-panel mastery-recorder" data-recorder="${id}">
      <div class="record-status"><span class="record-dot"></span><strong id="record-status-${id}">${recorded?'Take saved locally':'Ready to record audio'}</strong><span id="record-time-${id}">0:00</span></div>
      <div class="record-controls"><button class="btn primary" data-record-start="${id}" data-mode="audio">${icon('mic')} Start recording</button><button class="btn danger" data-record-stop="${id}" disabled>Stop</button><button class="btn ghost" data-record-play="${id}" ${recorded?'':'disabled'}>Play saved take</button></div>
      <audio id="playback-${id}" controls hidden></audio>
      <p class="privacy-note">Your recording stays on this device. Aim for clarity and command, not polish.</p>
    </div>`;
  }

  function renderGauntlet() {
    const active=!!state.mastery.gauntletActive;
    if(!active){
      return `${pageHeader('No-notes gauntlet','No active certification run','Study any workshop you need, then start a clean attempt from the Mastery page.')}<div class="center-actions"><button class="btn primary" data-nav="mastery">Return to Mastery</button></div>`;
    }
    const valid=MASTERY.workshops.filter(w=>gauntletCertificationValid(masteryState(w.id))).length;
    const clean=(state.mastery.referencePeeks||0)===0;
    return `
      ${pageHeader('Certification run','The No-Notes Gauntlet','The lesson-plan library is locked until you end or invalidate this run. Clear every workshop, then finish the final mastery exam at 90% or better.')}
      <section class="gauntlet-scoreboard">
        <div><span>Workshops</span><strong>${valid}/${MASTERY.workshops.length}</strong></div>
        <div><span>Reference peeks</span><strong class="${clean?'':'bad'}">${state.mastery.referencePeeks||0}</strong></div>
        <div><span>Final exam</span><strong>${finalExamScore()||0}%</strong></div>
        <div><span>Status</span><strong>${masteryReady()?'WAM READY':clean?'LIVE':'INVALIDATED'}</strong></div>
      </section>
      <div class="mastery-card-grid gauntlet-grid">${MASTERY.workshops.map(w=>renderMasteryCard(w,true)).join('')}</div>
      <section class="panel gauntlet-rules"><p class="eyebrow">RULES</p><ul class="clean-list"><li>Every workshop must be cleared during this attempt, even if you passed it in Study Mode.</li><li>Sequence must be 100%. Precision must be at least ${MASTERY.passThreshold}%.</li><li>You must record and review a teach-back for each workshop.</li><li>Opening the lesson-plan reference invalidates the run. End, review, and start again.</li><li>The course final exam must be ${MASTERY.passThreshold}% or higher.</li></ul></section>
      <div class="gauntlet-actions"><button class="btn danger" data-end-gauntlet>End attempt & unlock notes</button>${masteryReady()?`<button class="btn primary" data-nav="certificate">${icon('trophy')} Open WAM Ready certificate</button>`:''}</div>
    `;
  }


  function renderPractice() {
    const drill = COURSE.practiceDrills[state.practiceIndex % COURSE.practiceDrills.length];
    return `
      ${pageHeader('Practice Lab','Cold reps after the six-hour course','Optional. These drills do not add required course minutes. Use them before a teaching day to make retrieval fast and automatic.')}
      <section class="practice-stage">
        <p class="eyebrow">RANDOM DRILL</p>
        <h2>${esc(drill.title)}</h2>
        <p>${esc(drill.text)}</p>
        <div class="practice-clock" id="practice-clock">${formatTime(state.practiceTimer || 60)}</div>
        <div class="practice-actions"><button class="btn primary" data-practice-start>${icon('play')} Start 60 seconds</button><button class="btn ghost" data-practice-new>New drill</button><button class="btn ghost" data-speak="${encodeURIComponent(drill.text)}">${icon('speaker')} Read prompt</button></div>
      </section>
      <section class="panel"><h2>Suggested use</h2><p>Do one drill from memory. Open the relevant lesson-plan reference only after the timer. Identify one missing piece, then do the same prompt again in half the time. That second rep is where the retrieval practice becomes useful teaching fluency.</p></section>
    `;
  }

  function renderReference() {
    if(state.mastery?.gauntletActive){
      return `
        ${pageHeader('Lesson plans locked','You are in a no-notes certification run','Opening the reference now would turn the test back into study. That is useful when you need it, but it means this attempt no longer proves closed-book retrieval.')}
        <section class="reference-lock panel"><div class="lock-glyph">◇</div><h2>Need the notes? Use them.</h2><p>There is no penalty for studying. The only rule is that certification must happen on a fresh attempt after the notes are closed again.</p><button class="btn danger" data-break-gauntlet>End attempt & unlock lesson plans</button><button class="btn ghost" data-nav="gauntlet">Return to gauntlet</button></section>`;
    }
    return `
      ${pageHeader('Lesson-plan reference','The complete WAM workshop plans, separated by topic','Use this to check accuracy after retrieval or while planning. The course intentionally does not require you to read all of this straight through.')}
      <div class="reference-toolbar"><input id="reference-search" type="search" placeholder="Search exercises, prompts, terms…"><button class="btn ghost" data-reference-clear>Clear</button></div>
      <div id="reference-list" class="reference-list">${Object.values(REFERENCE).map(renderReferencePlan).join('')}</div>
    `;
  }

  function renderReferencePlan(plan) {
    return `<details class="reference-plan" data-ref-plan="${plan.id}">
      <summary><div><strong>${esc(plan.title)}</strong><span>${esc(plan.duration)}</span></div><span>+</span></summary>
      <div class="reference-lines">${plan.lines.map(line=>formatReferenceLine(line)).join('')}</div>
    </details>`;
  }

  function formatReferenceLine(line) {
    if (/^\d+:\d+-/.test(line) || /^\d+:\d+–/.test(line)) return `<h4>${esc(line)}</h4>`;
    if (/^Purpose:/.test(line)) return `<p class="purpose"><strong>Purpose:</strong>${esc(line.replace(/^Purpose:/,''))}</p>`;
    if (line === 'Facilitator prompts') return `<p class="ref-label">FACILITATOR PROMPTS</p>`;
    if (line === 'Sources & online resources') return `<p class="ref-label">SOURCES & ONLINE RESOURCES</p>`;
    if (/^Core question:|^Central question:/.test(line)) return `<div class="core-question">${esc(line)}</div>`;
    if (/^Cohort structure:/.test(line)) return `<p class="cohort">${esc(line)}</p>`;
    if (/^Internal source update:/.test(line)) return `<div class="source-update">${esc(line)}</div>`;
    return `<p>${esc(line)}</p>`;
  }

  function renderResearch() {
    return `
      ${pageHeader('Research basis','Evidence underneath the learning design','“Evidence-based” does not mean every interface choice is proven in isolation. The app uses well-supported learning mechanisms, then uses gamification as an engagement layer rather than pretending XP itself causes mastery.')}
      <div class="research-grid">${COURSE.research.map(r=>`<article class="research-card"><p class="eyebrow">${esc(r.title)}</p><h3>${esc(r.use)}</h3><p>${esc(r.evidence)}</p><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.source)} →</a></article>`).join('')}</div>
      <section class="section-block"><div class="section-heading"><div><p class="eyebrow">WAM SOURCE LAYER</p><h2>Current Pressure Dynamics materials</h2></div></div><div class="link-list">${COURSE.wamSources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener"><span><strong>${esc(s.title)}</strong><small>${esc(s.type)}</small></span><b>↗</b></a>`).join('')}</div></section>
      <section class="section-block"><div class="section-heading"><div><p class="eyebrow">VERIFIED ONLINE RESOURCES</p><h2>Actor-training references used by WAM</h2></div></div><div class="link-list">${COURSE.externalResources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener"><span><strong>${esc(s.title)}</strong><small>${esc(s.topic)}</small></span><b>↗</b></a>`).join('')}</div></section>
    `;
  }

  function renderSettings() {
    return `
      ${pageHeader('Settings','Make the lab work like you work','Progress stays on this device unless you export it. Audio/video recordings stay in browser storage and are never uploaded by this app.')}
      <section class="settings-grid">
        <div class="panel"><h2>Learner</h2><label class="field"><span>Name for certificate</span><input id="learner-name" value="${esc(state.learnerName)}"></label></div>
        <div class="panel"><h2>Studio coach voice</h2>
          <p>The app now speaks in shorter thought-sized chunks and automatically prefers higher-quality English voices exposed by your browser.</p>
          <label class="toggle"><input id="coach-mode" type="checkbox" ${state.settings.coachMode?'checked':''}><span>Automatically coach me aloud when a spoken activity opens</span></label>
          <label class="toggle"><input id="natural-voice" type="checkbox" ${state.settings.naturalVoice?'checked':''}><span>Automatically use the best available natural-sounding voice when no manual voice is selected</span></label>
          <label class="field"><span>Manual voice override</span><select id="voice-select"></select></label>
          <label class="field"><span>Speech rate <b id="rate-value">${state.settings.speechRate}</b></span><input id="speech-rate" type="range" min="0.75" max="1.2" step="0.01" value="${state.settings.speechRate}"></label>
          <button class="btn ghost" data-speak="${encodeURIComponent('Alright. Here is the thing I want you to remember. Receive the change before you decide what it should look like. Let the actor reorganize. Then let the response become available. We are repeating the process, not chasing yesterday’s result.')} ">${icon('speaker')} Test studio coach</button>
          <small id="best-voice-note">${esc(bestNaturalVoice()?.name ? `Auto pick: ${bestNaturalVoice().name}` : 'Your browser has not exposed its voice list yet.')}</small>
        </div>
        <div class="panel"><h2>Accessibility</h2>
          <label class="toggle"><input id="reduced-motion" type="checkbox" ${state.settings.reducedMotion?'checked':''}><span>Reduce interface motion</span></label>
          <label class="toggle"><input id="high-contrast" type="checkbox" ${state.settings.highContrast?'checked':''}><span>Extra-high contrast</span></label>
        </div>
        <div class="panel"><h2>Progress data</h2><p>Export a portable JSON backup or reset the course.</p><div class="button-stack"><button class="btn ghost" data-export>Export progress</button><label class="btn ghost file-btn">Import progress<input id="import-state" type="file" accept="application/json" hidden></label><button class="btn danger" data-reset>Reset course</button></div></div>
      </section>
    `;
  }

  function populateVoiceSelect(select) {
    const best=bestNaturalVoice();
    select.innerHTML = `<option value="">Auto / ${esc(best?.name || 'browser best')}</option>` + [...voices].sort((a,b)=>voiceQualityScore(b)-voiceQualityScore(a)).map(v=>`<option value="${esc(v.name)}" ${v.name===state.settings.voiceName?'selected':''}>${esc(v.name)} (${esc(v.lang)})${voiceQualityScore(v)>=60?' · natural':''}</option>`).join('');
    const note=$('#best-voice-note');if(note)note.textContent=best?`Auto pick: ${best.name} (${best.lang})`:'Your browser has not exposed its voice list yet.';
  }

  function renderCertificate() {
    const ready = earnedBadges().includes('wam-ready');
    return `
      <div class="certificate-wrap ${ready?'':'locked-cert'}">
        ${!ready?`<button class="back-link" data-nav="dashboard">← Dashboard</button><div class="panel"><h1>Certificate locked</h1><p>Complete the six-hour course, score at least 90% on the final mastery exam, and clear every workshop in a clean no-notes gauntlet.</p><button class="btn primary" data-nav="course">Return to course</button></div>`:`
        <section class="certificate" id="certificate">
          <div class="cert-mark">WAM</div>
          <p class="cert-kicker">WORKING ACTOR MASTERCLASS</p>
          <h1>Instructor Lab<br>No-Notes Certification</h1>
          <p class="cert-copy">This certifies that</p>
          <h2>${esc(state.learnerName || COURSE.defaultLearner)}</h2>
          <p class="cert-copy">completed the six-hour active WAM instructor-training course and cleared the closed-book workshop gauntlet, demonstrating recall of the teaching sequence, exercise purpose, coaching language, common failure modes, and no-notes delivery across the authored WAM curriculum.</p>
          <div class="cert-score"><span>No-notes workshops</span><strong>${MASTERY.workshops.length}/${MASTERY.workshops.length}</strong></div><div class="cert-score"><span>Final mastery exam</span><strong>${finalExamScore()}%</strong></div>
          <div class="cert-footer"><span>WAM Instructor Lab · v${esc(COURSE.version)}</span><span>${new Date().toLocaleDateString()}</span></div>
        </section>
        <div class="cert-actions"><button class="btn ghost" data-nav="dashboard">← Dashboard</button><button class="btn primary" data-print>Print / Save PDF</button></div>`}
      </div>
    `;
  }

  function maybeCoachRead() {
    if (!state.settings.coachMode || state.view !== 'activity') return;
    const found = findActivity(state.currentActivity);
    if (!found) return;
    const a = found.activity;
    const text = a.coachScript || (a.type==='brief' ? a.body?.join(' ') : null);
    if (text) setTimeout(() => speak(text), 150);
  }

  function bindViewEvents() {
    $$('[data-view]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.view)));
    $$('[data-nav]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.nav)));
    $$('[data-module]').forEach(el => el.addEventListener('click', () => navigate('module',{currentModule:el.dataset.module,currentActivity:null})));
    $$('[data-open-activity]').forEach(el => el.addEventListener('click', () => {
      const f = findActivity(el.dataset.openActivity); if (f) navigate('activity',{currentModule:f.module.id,currentActivity:f.activity.id});
    }));
    $$('[data-action="resume"]').forEach(el => el.addEventListener('click', resumeCourse));
    $$('[data-speak]').forEach(el => el.addEventListener('click', () => speak(decodeURIComponent(el.dataset.speak.trim()))));
    $$('[data-stop-speech]').forEach(el => el.addEventListener('click', stopSpeaking));
    $$('[data-complete]').forEach(el => el.addEventListener('click', () => { markComplete(el.dataset.complete); render(); }));

    bindQuiz();
    bindClassify();
    bindSort();
    bindGuided();
    bindInputs();
    bindRecorders();
    bindMastery();
    bindPractice();
    bindReference();
    bindSettings();

    $$('[data-reader-prompt]').forEach(el => el.addEventListener('click', () => {
      const f = findActivity(el.dataset.readerPrompt); if (!f) return;
      const prompts = f.activity.readerPrompts || [];
      const p = prompts[Math.floor(Math.random()*prompts.length)];
      const t = $('#reader-prompt-text'); if (t) t.textContent = p;
      speak(p);
    }));
    $$('[data-redraw]').forEach(el => el.addEventListener('click', () => {
      const f = findActivity(el.dataset.redraw); if (!f) return;
      const arr = f.activity.workshops;
      let next = arr[Math.floor(Math.random()*arr.length)];
      if (arr.length > 1) while (next === state.randomTeach[f.activity.id]) next = arr[Math.floor(Math.random()*arr.length)];
      state.randomTeach[f.activity.id] = next; saveState(); render();
    }));
    $$('[data-print]').forEach(el => el.addEventListener('click', () => window.print()));
  }

  function bindQuiz() {
    $$('[data-quiz-choice]').forEach(btn => btn.addEventListener('click', () => {
      const id = btn.dataset.quizId;
      const f = findActivity(id); if (!f) return;
      const a = f.activity; const qs = ensureQuizState(a); const qi = qs.index; const q = a.questions[qi];
      const choice = Number(btn.dataset.quizChoice); const correct = choice === q.answer;
      qs.answers[qi] = {choice,correct};
      qs.streak = correct ? (qs.streak||0)+1 : 0;
      saveState(); render();
    }));
    $$('[data-quiz-next]').forEach(btn => btn.addEventListener('click', () => {
      const id = btn.dataset.quizNext; const f = findActivity(id); if (!f) return;
      const a=f.activity, qs=ensureQuizState(a);
      if (qs.index < a.questions.length-1) qs.index++;
      else finishQuiz(a,qs);
      saveState(); render();
    }));
    $$('[data-quiz-restart]').forEach(btn => btn.addEventListener('click', () => {
      const id=btn.dataset.quizRestart; const best=state.quiz[id]?.best||0;
      state.quiz[id]={index:0,answers:[],finished:false,best,streak:0}; saveState(); render();
    }));
  }

  function finishQuiz(a, qs) {
    const correct = qs.answers.filter(x=>x?.correct).length;
    const score = Math.round(correct / a.questions.length * 100);
    qs.finished = true; qs.lastScore = score; qs.best = Math.max(qs.best||0, score);
    if (!a.final || score >= MASTERY.passThreshold) markComplete(a.id,true);
    toast(`${score}% · ${a.final && score<MASTERY.passThreshold?`${MASTERY.passThreshold}% needed to clear final`:'challenge complete'}`);
  }

  function bindClassify() {
    $$('[data-classify-choice]').forEach(btn => btn.addEventListener('click', () => {
      const id=btn.dataset.classifyId; const f=findActivity(id); if(!f)return; const a=f.activity, cs=ensureClassifyState(a); const c=a.cases[cs.index]; const choice=btn.dataset.classifyChoice; const correct=choice===c.answer;
      cs.answers[cs.index]={choice,correct}; cs.streak=correct?(cs.streak||0)+1:0; saveState(); render();
    }));
    $$('[data-classify-next]').forEach(btn => btn.addEventListener('click', () => {
      const id=btn.dataset.classifyNext; const f=findActivity(id); if(!f)return; const a=f.activity, cs=ensureClassifyState(a);
      if(cs.index<a.cases.length-1) cs.index++; else {
        const score=Math.round(cs.answers.filter(x=>x?.correct).length/a.cases.length*100); cs.finished=true; cs.lastScore=score; cs.best=Math.max(cs.best||0,score); if(score>=70) markComplete(id,true); toast(`${score}% classification score`);
      }
      saveState(); render();
    }));
    $$('[data-classify-restart]').forEach(btn => btn.addEventListener('click', () => {const id=btn.dataset.classifyRestart; const best=state.classify[id]?.best||0; state.classify[id]={index:0,answers:[],finished:false,best,streak:0}; saveState(); render();}));
  }

  function bindSort() {
    $$('[data-sort-up]').forEach(btn=>btn.addEventListener('click',()=>moveSort(btn.dataset.sortUp,Number(btn.dataset.index),-1)));
    $$('[data-sort-down]').forEach(btn=>btn.addEventListener('click',()=>moveSort(btn.dataset.sortDown,Number(btn.dataset.index),1)));
    $$('[data-sort-check]').forEach(btn=>btn.addEventListener('click',()=>{
      const id=btn.dataset.sortCheck; const f=findActivity(id); if(!f)return; const a=f.activity; const ok=JSON.stringify(state.sortOrders[id])===JSON.stringify(a.correct); const box=$(`#sort-feedback-${CSS.escape(id)}`);
      if(ok){markComplete(id,true); if(box)box.innerHTML=`<div class="feedback good"><strong>Correct.</strong><p>${esc(a.why)}</p></div>`; toast(`Sequence locked · +${a.xp||25} XP`);} else if(box)box.innerHTML='<div class="feedback bad"><strong>Not yet.</strong><p>Something is out of order. Move the blocks and try again.</p></div>';
      saveState();
    }));
  }
  function moveSort(id,index,delta){const arr=state.sortOrders[id]; if(!arr)return; const j=index+delta;if(j<0||j>=arr.length)return;[arr[index],arr[j]]=[arr[j],arr[index]];saveState();render();}

  function bindGuided() {
    $$('[data-guided-start]').forEach(btn=>btn.addEventListener('click',()=>startGuided(btn.dataset.guidedStart)));
    $$('[data-guided-stop]').forEach(btn=>btn.addEventListener('click',stopGuided));
    $$('[data-guided-skip]').forEach(btn=>btn.addEventListener('click',()=>advanceGuided(btn.dataset.guidedSkip)));
  }

  function startGuided(id) {
    const f=findActivity(id); if(!f)return; stopGuided(); activeGuided={id,phaseIndex:0,remaining:f.activity.phases[0].seconds,interval:null}; speak(f.activity.phases[0].script); runGuidedTick(); render();
  }
  function runGuidedTick(){
    if(!activeGuided)return;
    activeGuided.interval=setInterval(()=>{
      if(!activeGuided)return;
      activeGuided.remaining--;
      const el=$('#guided-time'); if(el)el.textContent=formatTime(activeGuided.remaining);
      if(activeGuided.remaining<=0) advanceGuided(activeGuided.id,false);
    },1000);
  }
  function advanceGuided(id,rerender=true){
    const f=findActivity(id); if(!f||!activeGuided)return; clearInterval(activeGuided.interval); activeGuided.phaseIndex++;
    if(activeGuided.phaseIndex>=f.activity.phases.length){activeGuided=null; toast('Guided run complete. Debrief it before logging the activity.'); if(rerender)render(); return;}
    const p=f.activity.phases[activeGuided.phaseIndex]; activeGuided.remaining=p.seconds; speak(p.script); runGuidedTick(); if(rerender)render();
  }
  function stopGuided(){if(activeGuided?.interval)clearInterval(activeGuided.interval); activeGuided=null;}

  function bindInputs() {
    $$('[data-note]').forEach(el=>el.addEventListener('input',()=>{state.notes[el.dataset.note]=el.value;saveState();}));
    $$('[data-checklist]').forEach(el=>el.addEventListener('change',()=>{const id=el.dataset.checklist;state.checklist[id]=state.checklist[id]||{};state.checklist[id][el.dataset.index]=el.checked;saveState();render();}));
    $$('[data-reveal-tried]').forEach(el=>el.addEventListener('change',()=>{state.revealTried[el.dataset.revealTried]=el.checked;saveState();render();}));
  }

  async function openDB() {
    return new Promise((resolve,reject)=>{
      const req=indexedDB.open(DB_NAME,1);
      req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(DB_STORE))db.createObjectStore(DB_STORE,{keyPath:'id'});};
      req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
    });
  }
  async function saveRecording(id, blob, mime) {
    try {const db=await openDB(); await new Promise((res,rej)=>{const tx=db.transaction(DB_STORE,'readwrite');tx.objectStore(DB_STORE).put({id,blob,mime,updated:Date.now()});tx.oncomplete=res;tx.onerror=()=>rej(tx.error);});} catch(e){console.warn('save recording failed',e);}
  }
  async function getRecording(id) {
    try {const db=await openDB();return await new Promise((res,rej)=>{const tx=db.transaction(DB_STORE,'readonly');const r=tx.objectStore(DB_STORE).get(id);r.onsuccess=()=>res(r.result||null);r.onerror=()=>rej(r.error);});} catch(e){return null;}
  }

  function bindRecorders() {
    $$('[data-record-start]').forEach(btn=>btn.addEventListener('click',()=>startRecording(btn.dataset.recordStart,btn.dataset.mode)));
    $$('[data-record-stop]').forEach(btn=>btn.addEventListener('click',stopRecording));
    $$('[data-record-play]').forEach(btn=>btn.addEventListener('click',()=>playSavedRecording(btn.dataset.recordPlay)));
    $$('[data-recorder]').forEach(async panel=>{const id=panel.dataset.recorder; const saved=await getRecording(id); if(saved){const play=$(`[data-record-play="${CSS.escape(id)}"]`);if(play)play.disabled=false;}});
  }

  async function startRecording(id,mode='audio') {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {toast('Recording is not supported in this browser.');return;}
    try {
      if(currentRecorder) stopRecording();
      const constraints = mode==='video'?{audio:true,video:{facingMode:'user'}}:{audio:true};
      mediaStream=await navigator.mediaDevices.getUserMedia(constraints);
      const preview=$(`#preview-${CSS.escape(id)}`); if(preview){preview.srcObject=mediaStream;preview.play().catch(()=>{});}
      mediaChunks=[];
      const preferred=mode==='video'?'video/webm;codecs=vp8,opus':'audio/webm;codecs=opus';
      const options=MediaRecorder.isTypeSupported(preferred)?{mimeType:preferred}:{};
      currentRecorder=new MediaRecorder(mediaStream,options); currentRecorder.__id=id; currentRecorder.__mode=mode;
      currentRecorder.ondataavailable=e=>{if(e.data.size)mediaChunks.push(e.data);};
      currentRecorder.onstop=async()=>{
        const mime=currentRecorder?.mimeType || (mode==='video'?'video/webm':'audio/webm');
        const blob=new Blob(mediaChunks,{type:mime}); await saveRecording(id,blob,mime); cleanupMedia();
        if(id.startsWith('mastery-ex-')){const wid=id.replace(/^mastery-ex-/,'');const ms=masteryState(wid);ms.exerciseRecorded=true;saveState();}
        else if(id.startsWith('mastery-')){const wid=id.replace(/^mastery-/,'');const ms=masteryState(wid);ms.recorded=true;saveState();}
        const play=$(`[data-record-play="${CSS.escape(id)}"]`);if(play)play.disabled=false;
        const status=$(`#record-status-${CSS.escape(id)}`);if(status)status.textContent='Take saved locally'; toast('Take saved locally. Review it, then self-score.');
        currentRecorder=null;
      };
      currentRecorder.start(250); recordingSeconds=0;
      const startBtn=$(`[data-record-start="${CSS.escape(id)}"]`), stopBtn=$(`[data-record-stop="${CSS.escape(id)}"]`); if(startBtn)startBtn.disabled=true;if(stopBtn)stopBtn.disabled=false;
      const status=$(`#record-status-${CSS.escape(id)}`);if(status)status.textContent='Recording…';
      recordingTimer=setInterval(()=>{recordingSeconds++;const t=$(`#record-time-${CSS.escape(id)}`);if(t)t.textContent=formatTime(recordingSeconds);},1000);
    } catch(e){console.warn(e);toast('Camera/microphone permission was not granted. You can still complete the course with an external recorder.');}
  }

  function stopRecording() {if(currentRecorder && currentRecorder.state!=='inactive') currentRecorder.stop();}
  function cleanupMedia(){clearInterval(recordingTimer);recordingTimer=null;if(mediaStream){mediaStream.getTracks().forEach(t=>t.stop());mediaStream=null;}}
  async function playSavedRecording(id){const saved=await getRecording(id);if(!saved){toast('No saved take yet.');return;}const url=URL.createObjectURL(saved.blob);const isVideo=(saved.mime||'').startsWith('video');const el=$(isVideo?`#playback-video-${CSS.escape(id)}`:`#playback-${CSS.escape(id)}`);if(el){el.hidden=false;el.src=url;el.play().catch(()=>{});} }

  function resetWorkshopAttempt(w) {
    const ms=masteryState(w.id);
    ms.order=null;
    ms.recallAnswers={};
    ms.sequenceScore=0;
    ms.precision={answers:{},score:0};
    ms.rubric={};
    ms.recorded=false;
    ms.exerciseRecorded=false;
    ms.exerciseRubric={};
    ms.certified=false;
    ms.certifiedAt=null;
    ensureMasteryOrder(w,true);
  }

  function startGauntlet() {
    state.mastery.gauntletActive=true;
    state.mastery.gauntletStartedAt=Date.now();
    state.mastery.practiceTestWorkshop=null;
    state.mastery.referencePeeks=0;
    MASTERY.workshops.forEach(w=>resetWorkshopAttempt(w));
    saveState();
    navigate('gauntlet');
    toast('No-notes gauntlet started. Lesson plans are locked.');
  }

  function endGauntlet() {
    state.mastery.gauntletActive=false;
    state.mastery.gauntletStartedAt=null;
    state.mastery.practiceTestWorkshop=null;
    state.mastery.referencePeeks=0;
    saveState();
    navigate('mastery');
    toast('Attempt ended. Notes are unlocked.');
  }

  function breakGauntletForReference() {
    state.mastery.referencePeeks=(state.mastery.referencePeeks||0)+1;
    state.mastery.gauntletActive=false;
    state.mastery.gauntletStartedAt=null;
    state.mastery.practiceTestWorkshop=null;
    saveState();
    navigate('reference');
    toast('Certification attempt invalidated. Review what you need, then start clean.');
  }

  function bindMastery() {
    $$('[data-open-mastery]').forEach(el=>el.addEventListener('click',()=>{
      state.mastery.activeWorkshop=el.dataset.openMastery;
      if(state.mastery.gauntletActive) state.mastery.practiceTestWorkshop=null;
      saveState();
      navigate('mastery-workshop');
    }));
    $$('[data-start-workshop-test]').forEach(el=>el.addEventListener('click',()=>{
      const w=masteryWorkshop(el.dataset.startWorkshopTest);
      state.mastery.activeWorkshop=w.id;
      state.mastery.practiceTestWorkshop=w.id;
      resetWorkshopAttempt(w);
      saveState();
      render();
      window.scrollTo({top:0,behavior:'smooth'});
    }));
    $$('[data-open-mastery-study]').forEach(el=>el.addEventListener('click',()=>{
      state.mastery.activeWorkshop=el.dataset.openMasteryStudy;
      state.mastery.practiceTestWorkshop=null;
      saveState();render();window.scrollTo({top:0,behavior:'smooth'});
    }));
    $$('[data-start-gauntlet]').forEach(el=>el.addEventListener('click',startGauntlet));
    $$('[data-end-gauntlet]').forEach(el=>el.addEventListener('click',()=>{
      if(confirm('End this no-notes attempt and unlock the lesson plans? Any gauntlet stamps from this run will no longer count toward certification.')) endGauntlet();
    }));
    $$('[data-break-gauntlet]').forEach(el=>el.addEventListener('click',()=>{
      if(confirm('Opening the lesson plans invalidates this certification attempt. Continue?')) breakGauntletForReference();
    }));
    $$('[data-step-rep]').forEach(el=>el.addEventListener('click',()=>{
      const [id,i]=el.dataset.stepRep.split(':');
      const box=$(`#step-rep-${CSS.escape(id)}-${i}`);
      if(box) box.hidden=!box.hidden;
    }));
    $$('[data-mastery-move]').forEach(el=>el.addEventListener('click',()=>{
      const [id,posRaw,deltaRaw]=el.dataset.masteryMove.split(':');
      const ms=masteryState(id);const pos=Number(posRaw),delta=Number(deltaRaw),next=pos+delta;
      if(!Array.isArray(ms.order)||next<0||next>=ms.order.length)return;
      [ms.order[pos],ms.order[next]]=[ms.order[next],ms.order[pos]];
      ms.sequenceScore=0;saveState();render();
    }));
    $$('[data-shuffle-mastery]').forEach(el=>el.addEventListener('click',()=>{
      const w=masteryWorkshop(el.dataset.shuffleMastery);const ms=masteryState(w.id);ms.sequenceScore=0;ensureMasteryOrder(w,true);saveState();render();
    }));
    $$('[data-mastery-recall]').forEach(el=>el.addEventListener('input',()=>{
      const [id,pos]=el.dataset.masteryRecall.split(':');const ms=masteryState(id);ms.recallAnswers=ms.recallAnswers||{};ms.recallAnswers[pos]=el.value;ms.sequenceScore=0;saveState();
    }));
    $$('[data-clear-mastery-recall]').forEach(el=>el.addEventListener('click',()=>{
      const ms=masteryState(el.dataset.clearMasteryRecall);ms.recallAnswers={};ms.sequenceScore=0;saveState();render();
    }));
    $$('[data-check-mastery-sequence]').forEach(el=>el.addEventListener('click',()=>{
      const w=masteryWorkshop(el.dataset.checkMasterySequence);const ms=masteryState(w.id);const keys=memoryKeys(w);
      const hits=keys.filter((key,i)=>recallCueMatches(ms.recallAnswers?.[i],key)).length;
      ms.sequenceScore=Math.round(hits/keys.length*100);saveState();render();
      toast(ms.sequenceScore===100?'Free recall locked. The whole spine is available.':`${hits}/${keys.length} cues retrieved in the right position. Do not peek. Try again.`);
    }));
    $$('[data-mastery-answer]').forEach(el=>el.addEventListener('change',()=>{
      const [id,q,c]=el.dataset.masteryAnswer.split(':');const ms=masteryState(id);
      ms.precision=ms.precision||{answers:{},score:0};ms.precision.answers=ms.precision.answers||{};ms.precision.answers[q]=Number(c);ms.precision.score=0;saveState();
    }));
    $$('[data-check-mastery-precision]').forEach(el=>el.addEventListener('click',()=>{
      const w=masteryWorkshop(el.dataset.checkMasteryPrecision);const ms=masteryState(w.id);const qs=masteryPrecisionQuestions(w);
      const hits=qs.filter((q,i)=>Number(ms.precision?.answers?.[i])===q.answer).length;
      ms.precision=ms.precision||{answers:{},score:0};ms.precision.score=Math.round(hits/qs.length*100);saveState();render();
      toast(ms.precision.score>=MASTERY.passThreshold?'Precision cleared.':'Not yet. Retrieve again before reviewing notes.');
    }));
    $$('[data-mastery-rubric]').forEach(el=>el.addEventListener('change',()=>{
      const [id,i]=el.dataset.masteryRubric.split(':');const ms=masteryState(id);ms.rubric=ms.rubric||{};ms.rubric[i]=el.checked;saveState();
    }));
    $$('[data-mastery-ex-rubric]').forEach(el=>el.addEventListener('change',()=>{
      const [id,i]=el.dataset.masteryExRubric.split(':');const ms=masteryState(id);ms.exerciseRubric=ms.exerciseRubric||{};ms.exerciseRubric[i]=el.checked;saveState();
    }));
    $$('[data-submit-workshop]').forEach(el=>el.addEventListener('click',()=>{
      const w=masteryWorkshop(el.dataset.submitWorkshop);const ms=masteryState(w.id);
      const rubricDone=MASTERY.teachbackRubric.every((_,i)=>!!ms.rubric?.[i]);
      const exRubricDone=exerciseRubric().every((_,i)=>!!ms.exerciseRubric?.[i]);
      const pass=ms.sequenceScore===100 && (ms.precision?.score||0)>=MASTERY.passThreshold && ms.recorded && ms.exerciseRecorded && rubricDone && exRubricDone;
      if(!pass){toast('This workshop has not met the mastery gate yet.');return;}
      ms.attempts=(ms.attempts||0)+1;
      if(state.mastery.gauntletActive){ms.certified=true;ms.certifiedAt=Date.now();toast(`${w.label} cleared in the no-notes run.`);navigate('gauntlet');}
      else {ms.practicePassed=true;state.mastery.practiceTestWorkshop=null;toast(`${w.label} practice pass logged.`);navigate('mastery');}
      saveState();
    }));
  }


  function bindPractice(){
    $('[data-practice-new]')?.addEventListener('click',()=>{state.practiceIndex=(state.practiceIndex+1)%COURSE.practiceDrills.length;state.practiceTimer=60;saveState();render();});
    $('[data-practice-start]')?.addEventListener('click',()=>{clearInterval(activePracticeTimer);state.practiceTimer=60;const el=$('#practice-clock');activePracticeTimer=setInterval(()=>{state.practiceTimer--;if(el)el.textContent=formatTime(state.practiceTimer);if(state.practiceTimer<=0){clearInterval(activePracticeTimer);activePracticeTimer=null;toast('Time. Check the reference, then repeat the drill.');}},1000);});
  }

  function bindReference(){
    const input=$('#reference-search');
    if(input) input.addEventListener('input',()=>filterReference(input.value));
    $('[data-reference-clear]')?.addEventListener('click',()=>{if(input)input.value='';filterReference('');});
  }
  function filterReference(q){const term=q.trim().toLowerCase();$$('[data-ref-plan]').forEach(el=>{const show=!term||el.textContent.toLowerCase().includes(term);el.hidden=!show;if(show&&term)el.open=true;});}

  function bindSettings(){
    const name=$('#learner-name');if(name)name.addEventListener('input',()=>{state.learnerName=name.value;saveState();});
    const coach=$('#coach-mode');if(coach)coach.addEventListener('change',()=>{state.settings.coachMode=coach.checked;saveState();});
    const voice=$('#voice-select');if(voice){populateVoiceSelect(voice);voice.addEventListener('change',()=>{state.settings.voiceName=voice.value;saveState();});}
    const natural=$('#natural-voice');if(natural)natural.addEventListener('change',()=>{state.settings.naturalVoice=natural.checked;saveState();});
    const rate=$('#speech-rate');if(rate)rate.addEventListener('input',()=>{state.settings.speechRate=Number(rate.value);const rv=$('#rate-value');if(rv)rv.textContent=rate.value;saveState();});
    const rm=$('#reduced-motion');if(rm)rm.addEventListener('change',()=>{state.settings.reducedMotion=rm.checked;saveState();applySettings();});
    const hc=$('#high-contrast');if(hc)hc.addEventListener('change',()=>{state.settings.highContrast=hc.checked;saveState();applySettings();});
    $('[data-export]')?.addEventListener('click',exportState);
    $('#import-state')?.addEventListener('change',importState);
    $('[data-reset]')?.addEventListener('click',()=>{if(confirm('Reset all course progress, scores, notes, and settings on this device? Recordings in browser storage will remain unless you clear site data.')){state=defaultState();saveState();render();toast('Course progress reset.');}});
  }

  function exportState(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='wam-instructor-lab-progress.json';a.click();URL.revokeObjectURL(url);}
  async function importState(e){const file=e.target.files?.[0];if(!file)return;try{const imported=JSON.parse(await file.text());state=deepMerge(defaultState(),imported);saveState();render();toast('Progress imported.');}catch(err){toast('That progress file could not be read.');}}

  function formatTime(sec){sec=Math.max(0,Number(sec)||0);const m=Math.floor(sec/60),s=sec%60;return `${m}:${String(s).padStart(2,'0')}`;}

  document.addEventListener('DOMContentLoaded', () => {
    applySettings();
    render();
    initVoices();
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
  });

  window.addEventListener('beforeunload',()=>{stopSpeaking();stopGuided();cleanupMedia();});
})();
