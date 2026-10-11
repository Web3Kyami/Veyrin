(() => {
  const DEFAULT_CASE_ID = 'nvda-2026-q2-fy27';
  const SESSION_KEY = 'veyrin-session-v1';
  const sourceLabel = id => ({
    NVDA_PRE_IR_Q1: 'NVIDIA Q1 results',
    NVDA_PRE_SEC_10Q: 'SEC Form 10-Q',
    NVDA_PRE_CALENDAR: 'NVIDIA event schedule',
    NVDA_PRE_SP_GLOBAL: 'S&P Global preview',
    TSLA_PRE_Q1_UPDATE: 'Tesla Q1 update',
    TSLA_PRE_SEC_10Q: 'SEC Form 10-Q',
    TSLA_PRE_DELIVERY_CONSENSUS: 'Tesla delivery consensus',
    TSLA_PRE_DELIVERIES: 'Tesla Q2 deliveries',
    TSLA_PRE_EARNINGS_CONSENSUS: 'Tesla earnings consensus',
    BITGET_PRE_CANDLE: 'Bitget pre-cutoff candle'
  }[id] || id);
  const state = {
    caseId: null,
    readiness: null,
    preToken: null,
    atlasToken: null,
    vexToken: null,
    sealToken: null,
    reveal: null,
    lastFailedRole: null,
    revealRequestActive: false
  };

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const text = (selector, value) => { const node = $(selector); if (node) node.textContent = value == null ? '' : String(value); };
  const announce = value => text('#global-announcer', value);

  function caseIdFromPath(path = location.pathname) {
    const match = path.replace(/\/$/, '').match(/^\/chamber\/([^/]+)(?:\/reveal)?$/);
    return match && window.VEYRIN_CASES && window.VEYRIN_CASES[match[1]] ? match[1] : null;
  }

  function casePath(caseId = state.caseId || DEFAULT_CASE_ID) {
    return `/chamber/${caseId}`;
  }

  function sessionKey(caseId) {
    return `${SESSION_KEY}:${caseId}`;
  }

  function caseMetadata(caseId = state.caseId) {
    return window.VEYRIN_CASES?.[caseId] || window.VEYRIN_CASES?.[DEFAULT_CASE_ID];
  }

  async function api(path, body) {
    const response = await fetch(path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? { accept: 'application/json' } : { 'content-type': 'application/json', accept: 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store'
    });
    let result;
    try { result = await response.json(); }
    catch { throw new Error('The server returned an unreadable response.'); }
    if (!response.ok) throw new Error(result.message || result.error || `Request failed (${response.status}).`);
    return result;
  }

  function saveSession() {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        caseId: state.caseId,
        preToken: state.preToken,
        atlasToken: state.atlasToken,
        vexToken: state.vexToken,
        sealToken: state.sealToken,
        reveal: state.reveal
      }));
      sessionStorage.setItem(sessionKey(state.caseId), sessionStorage.getItem(SESSION_KEY));
    } catch { /* The live page remains usable when browser storage is unavailable. */ }
  }

  function restoreSession() {
    try {
      const scopedKey = sessionKey(state.caseId);
      let saved = JSON.parse(sessionStorage.getItem(scopedKey) || 'null');
      if (!saved && state.caseId === DEFAULT_CASE_ID) saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (saved && saved.caseId === state.caseId) Object.assign(state, saved);
    } catch { sessionStorage.removeItem(SESSION_KEY); }
  }

  function resetCaseState(caseId) {
    state.caseId = caseId;
    state.readiness = null;
    state.preToken = null;
    state.atlasToken = null;
    state.vexToken = null;
    state.sealToken = null;
    state.reveal = null;
    state.lastFailedRole = null;
    state.revealRequestActive = false;
    restoreSession();
  }

  function currentView() {
    const path = location.pathname.replace(/\/$/, '') || '/';
    if (path === '/proof') return 'proof';
    if (path === '/sample') return 'sample';
    if (path === '/chamber') return 'case';
    if (caseIdFromPath(path) && path.endsWith('/reveal')) return 'reveal';
    if (caseIdFromPath(path)) return 'investigation';
    return 'landing';
  }

  function renderRoute({ loadReveal = true } = {}) {
    const routeCaseId = caseIdFromPath();
    if (routeCaseId && routeCaseId !== state.caseId) resetCaseState(routeCaseId);
    const view = currentView();
    $$('[data-view]').forEach(node => { node.hidden = node.dataset.view !== view; });
    $$('.site-nav [data-route]').forEach(link => {
      const current = view === 'case' || view === 'investigation' || view === 'reveal' ? '/chamber' : view === 'proof' ? '/proof' : view === 'sample' ? '/sample' : '';
      if (link.getAttribute('href') === current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (view === 'case') renderCaseSelection();
    if (view === 'investigation') renderInvestigationState();
    if (view === 'reveal' && loadReveal) renderRevealState();
    if (view === 'proof') renderProofState();
    if (view === 'investigation') renderWorkflow();
    if (view === 'investigation') renderInvestigationHeader();
    document.body.dataset.currentView = view;
    renderNavigation();
    closeMenu();
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  function navigate(path) {
    if (location.pathname !== path) history.pushState({}, '', path);
    renderRoute();
    const heading = $('[data-view]:not([hidden]) h1');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
  }

  function formatTime(value) {
    if (!value) return 'Timestamp unavailable';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? String(value) : `${parsed.toISOString().replace('.000Z', 'Z')} · UTC`;
  }

  function setStatus(node, label, status) {
    node.textContent = label;
    node.classList.remove('status-good', 'status-wait', 'status-bad');
    if (status) node.classList.add(`status-${status}`);
  }

  async function refreshReadiness() {
    setStatus($('#model-readiness'), 'Checking configuration…', 'wait');
    setStatus($('#bitget-readiness'), 'Checking instrument…', 'wait');
    try {
      state.readiness = await api(`/api/readiness?caseId=${encodeURIComponent(state.caseId || DEFAULT_CASE_ID)}`);
      renderReadiness();
      text('#availability-note', state.readiness?.model?.configured && state.readiness?.bitget?.ready ? `Ready · ${state.readiness.model.provider === 'openrouter' ? 'OpenRouter' : state.readiness.model.provider} · ${state.readiness.model.modelId}. Begin when you choose.` : 'The investigation is not available yet. You can still inspect the sources.');
    } catch (error) {
      state.readiness = { model: { configured: false }, bitget: { ready: false, error: error.message } };
      renderReadiness();
      text('#availability-note', 'Availability could not be checked. No investigation was started.');
    }
  }

  function renderReadiness() {
    const readiness = state.readiness;
    if (!readiness) return;
    const model = readiness.model || {};
    const bitget = readiness.bitget || {};
    setStatus($('#model-readiness'), model.configured ? 'Configured' : 'Preview variables required', model.configured ? 'good' : 'wait');
    const providerName = model.provider === 'openrouter' ? 'OpenRouter' : model.provider === 'google-ai-studio' ? 'Google AI Studio' : 'AI provider';
    const missingVariables = Array.isArray(model.requiredVariables) ? model.requiredVariables.join(' + ') : 'Preview model variables';
    text('#model-detail', model.configured ? `${providerName} · ${model.modelId || 'available'}` : missingVariables);
    setStatus($('#bitget-readiness'), bitget.ready ? `Verified · ${bitget.symbol}` : 'Not verified', bitget.ready ? 'good' : 'bad');
    text('#bitget-detail', bitget.ready ? `${formatTime(bitget.timestamp)} · close ${bitget.close} ${bitget.quoteCurrency}` : `Runtime response · ${bitget.error || 'unavailable'}`);
    const complete = Boolean(model.configured && bitget.ready);
    setStatus($('#case-readiness'), complete ? 'READY TO ENTER' : 'FEASIBILITY CHECK', complete ? 'good' : 'wait');
    text('#case-readiness-detail', complete
      ? 'Model configured · Bitget cutoff verified'
      : `${model.configured ? 'Model configured' : 'Model unavailable'} · ${bitget.ready ? 'Bitget verified' : 'Bitget not verified'}`);
    const runButton = $('#run-investigation');
    if (runButton && !state.atlasToken) runButton.disabled = !complete;
    const canRun = $('#investigation-view');
    if (canRun) canRun.dataset.ready = String(complete);
  }

  function renderSources(sources) {
    const list = $('#case-source-list');
    const ledger = $('#evidence-ledger');
    if (!Array.isArray(sources)) return;
    if (list) {
      list.replaceChildren();
      const title = document.createElement('div');
      title.className = 'source-list-title';
      title.textContent = 'Publication dates and precision';
      list.append(title);
    }
    if (ledger) ledger.replaceChildren();
    for (const source of sources) {
      const row = document.createElement('div');
      row.className = 'source-row';
      const anchor = document.createElement('a');
      anchor.href = source.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.textContent = source.title;
      const publisher = document.createElement('span');
      publisher.textContent = source.publisher;
      const timing = document.createElement('span');
      timing.textContent = `${source.publishedAt} · ${source.timestampPrecision}`;
      const eligibility = document.createElement('span');
      eligibility.className = 'source-state';
      eligibility.textContent = source.eligibility === 'CATALOGUED' ? 'Listed' : source.eligibility === 'VERIFIED_PRE' ? 'Pre-cutoff checked' : source.eligibility || 'Pre-cutoff checked';
      row.append(anchor, publisher, timing, eligibility);
      list?.append(row);

      const item = document.createElement('article');
      item.className = 'ledger-item';
      const itemHead = document.createElement('div');
      const itemName = document.createElement('strong');
      itemName.textContent = source.publisher;
      const itemState = document.createElement('span');
      itemState.textContent = source.eligibility === 'CATALOGUED' ? 'Listed' : source.eligibility === 'VERIFIED_PRE' ? 'Checked' : source.eligibility || 'Checked';
      itemHead.append(itemName, itemState);
      const itemLink = document.createElement('a');
      itemLink.href = source.url;
      itemLink.target = '_blank';
      itemLink.rel = 'noopener noreferrer';
      itemLink.textContent = source.title;
      const itemTime = document.createElement('small');
      const dateOnly = new Date(`${String(source.publishedAt).slice(0, 10)}T00:00:00Z`);
      itemTime.textContent = Number.isNaN(dateOnly.getTime()) ? source.publishedAt : `Published ${dateOnly.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}`;
      const itemSummary = document.createElement('p');
      itemSummary.textContent = source.summary;
      const disclosure = document.createElement('details');
      disclosure.className = 'source-summary';
      const summary = document.createElement('summary');
      summary.textContent = 'Source details';
      const sourceMetadata = document.createElement('p');
      sourceMetadata.textContent = `${source.id} · ${source.publishedAt} · ${source.timestampPrecision}`;
      disclosure.append(summary, itemSummary, sourceMetadata);
      item.append(itemHead, itemLink, itemTime, disclosure);
      ledger?.append(item);
    }
    const documentCount = sources.filter(source => source.id !== 'BITGET_PRE_CANDLE').length;
    text('#source-count', `${documentCount} documents`);
    text('#mobile-source-count', `${documentCount} sources`);
    const cutoff = caseMetadata()?.cutoffAt;
    text('#evidence-cutoff', cutoff ? `${cutoff.slice(0, 10)} · ${cutoff.slice(11, 16)} UTC` : 'Selected case');
  }

  function renderInvestigationHeader() {
    const meta = caseMetadata();
    if (!meta) return;
    text('#investigation-subtitle', `${meta.company} · ${meta.eventTitle}`);
    const cutoff = meta.cutoffAt;
    text('#evidence-cutoff', `${cutoff.slice(0, 10)} · ${cutoff.slice(11, 16)} UTC`);
  }

  function renderCaseSelection() {
    const list = $('#case-list');
    if (!list || !window.VEYRIN_CASES) return;
    list.replaceChildren();
    for (const meta of Object.values(window.VEYRIN_CASES)) {
      const article = document.createElement('article');
      article.className = 'case-canvas';
      const identity = document.createElement('div');
      identity.className = 'case-identity';
      const company = document.createElement('span');
      company.className = 'eyebrow';
      company.textContent = `${meta.company} · ${meta.ticker}`;
      const event = document.createElement('h2');
      event.textContent = meta.eventTitle;
      const date = document.createElement('p');
      date.textContent = meta.eventDate;
      const chip = document.createElement('span');
      chip.className = 'quiet-chip';
      chip.textContent = 'Historical reconstruction';
      identity.append(company, event, date, chip);

      const context = document.createElement('div');
      context.className = 'case-context';
      const facts = document.createElement('dl');
      for (const [label, value] of [
        ['Evidence cutoff', `${meta.cutoffAt.slice(0, 10)} · ${meta.cutoffAt.slice(11, 16)} UTC`],
        ['Source material', `${meta.sources.length} dated documents`],
        ['Market comparison', meta.marketLabel]
      ]) {
        const row = document.createElement('div');
        const term = document.createElement('dt'); term.textContent = label;
        const description = document.createElement('dd'); description.textContent = value;
        row.append(term, description); facts.append(row);
      }
      const disclosure = document.createElement('details');
      disclosure.className = 'case-source-details';
      const summary = document.createElement('summary');
      summary.textContent = `Browse ${meta.sources.length} dated sources`;
      disclosure.append(summary);
      for (const source of meta.sources) {
        const sourceItem = document.createElement('div');
        sourceItem.className = 'case-source-item';
        const sourceLink = document.createElement('a');
        sourceLink.href = source.url; sourceLink.target = '_blank'; sourceLink.rel = 'noopener noreferrer'; sourceLink.textContent = source.title;
        const publisher = document.createElement('small'); publisher.textContent = `${source.publisher} · ${source.publishedAt} · ${source.timestampPrecision}`;
        const summaryText = document.createElement('p'); summaryText.textContent = source.summary;
        sourceItem.append(sourceLink, publisher, summaryText); disclosure.append(sourceItem);
      }
      const open = document.createElement('a');
      open.className = 'button button-primary'; open.href = casePath(meta.caseId); open.dataset.route = casePath(meta.caseId);
      open.textContent = 'Open case ↗';
      const caseActions = document.createElement('div');
      caseActions.className = 'case-enter';
      const note = document.createElement('div'); note.className = 'case-readiness';
      const noteTitle = document.createElement('strong'); noteTitle.textContent = 'Sources available to inspect';
      const noteCopy = document.createElement('p'); noteCopy.textContent = 'Check the cutoff and Bitget window before starting the research passes.';
      note.append(noteTitle, noteCopy); caseActions.append(note, open);
      context.append(facts, disclosure, caseActions);
      article.append(identity, context); list.append(article);
    }
  }

  function renderWorkflow(activeRole) {
    let current = 0;
    if (state.atlasToken) current = 2;
    else if (state.preToken) current = 1;
    if (state.vexToken) current = 3;
    if (state.sealToken) current = 4;
    if (activeRole === 'ATLAS') current = 1;
    if (activeRole === 'VEX') current = 2;
    if (activeRole === 'SEAL') current = 3;
    $$('.workspace-steps > div').forEach((node, index) => {
      node.classList.toggle('current', index === current);
      node.classList.toggle('complete', index < current);
      if (index === current) node.setAttribute('aria-current', 'step');
      else node.removeAttribute('aria-current');
    });
  }

  function setRole(role, status, active = false) {
    if (active) selectRole(role);
    const seat = $(`[data-role="${role}"]`);
    if (!seat) return;
    seat.classList.toggle('is-active', active);
    if (active && status === 'RUNNING') renderWorkflow(role.toUpperCase());
    seat.classList.toggle('is-complete', status === 'COMPLETE');
    text(`[data-role="${role}"] .agent-state`, status);
  }

  function addCitations(parent, citations, sources) {
    if (!Array.isArray(citations) || citations.length === 0) return;
    const links = document.createElement('div');
    links.className = 'citation-links';
    for (const citation of citations) {
      const source = sources.find(item => item.id === citation.sourceId);
      if (!source) continue;
      const excerpt = typeof citation.relevantQuote === 'string' ? citation.relevantQuote.trim() : '';
      if (excerpt) {
        const note = document.createElement('details');
        note.className = 'citation-note';
        const summary = document.createElement('summary');
        summary.textContent = 'Source: ' + sourceLabel(citation.sourceId);
        const quote = document.createElement('p');
        quote.className = 'citation-quote';
        quote.textContent = excerpt;
        const caveat = document.createElement('small');
        caveat.textContent = 'Model-supplied citation text · check against the original document';
        const anchor = document.createElement('a');
        anchor.href = source.url || '#pre-market-panel';
        anchor.target = source.url ? '_blank' : '_self';
        if (source.url) anchor.rel = 'noopener noreferrer';
        anchor.textContent = 'Open original source ↗';
        note.append(summary, quote, caveat, anchor);
        links.append(note);
      } else {
        const link = document.createElement('a');
        link.href = source.url || '#pre-market-panel';
        link.target = source.url ? '_blank' : '_self';
        if (source.url) link.rel = 'noopener noreferrer';
        link.textContent = 'Source: ' + sourceLabel(citation.sourceId);
        links.append(link);
      }
    }
    if (links.children.length) parent.append(links);
  }

  function renderAtlas(output, sources) {
    const section = document.createElement('details');
    section.open = true;
    const summary = document.createElement('summary');
    summary.textContent = 'ATLAS · Research thesis';
    section.append(summary);
    section.className = 'turn';
    section.dataset.transcriptRole = 'atlas';
    const heading = document.createElement('div');
    heading.className = 'turn-head';
    heading.innerHTML = '<span>Source-linked analysis</span>';
    const thesis = document.createElement('p');
    thesis.className = 'turn-thesis';
    thesis.textContent = output.thesis;
    addCitations(thesis, output.thesisCitations, sources);
    const stance = document.createElement('div');
    stance.className = 'turn-head';
    stance.innerHTML = `<span>Assessment · ${escapeText(output.stance)}</span><span>${output.claims.length} sourced claims</span>`;
    section.append(heading, stance, thesis);
    appendStringList(section, 'Claims', output.claims.map(claim => ({ title: `${claim.id} · ${claim.strength} · ${claim.statement}`, caveat: claim.caveat, citations: claim.citations })), sources);
    appendStringList(section, 'What remains uncertain', output.unknowns.map(value => ({ title: value })), sources);
    appendStringList(section, 'What could change the assessment', [...output.falsifiers, ...output.watchItems].map(value => ({ title: value })), sources);
    $('#transcript-content').append(section);
  }

  function appendStringList(parent, title, values, sources) {
    const heading = document.createElement('h3');
    heading.textContent = title;
    const list = document.createElement('ul');
    for (const item of values) {
      const li = document.createElement('li');
      if (typeof item === 'string') li.textContent = item;
      else {
        const strong = document.createElement('strong');
        strong.textContent = item.title;
        li.append(strong);
        if (item.caveat) {
          const caveat = document.createElement('p');
          caveat.textContent = item.caveat;
          li.append(caveat);
        }
        addCitations(li, item.citations, sources);
      }
      list.append(li);
    }
    if (list.children.length) parent.append(heading, list);
  }

  function renderVex(output, sources) {
    const section = document.createElement('details');
    section.open = true;
    const summary = document.createElement('summary');
    summary.textContent = 'VEX · Challenges and counterarguments';
    section.append(summary);
    section.className = 'turn';
    section.dataset.transcriptRole = 'vex';
    const heading = document.createElement('div');
    heading.className = 'turn-head';
    heading.innerHTML = '<span>Challenges tied to specific research claims</span>';
    section.append(heading);
    const challenges = output.challenges.map(challenge => ({ title: `${challenge.targetClaimId} · ${challenge.severity} · ${challenge.critique}`, citations: challenge.citations }));
    appendStringList(section, challenges.length ? 'Challenges raised' : 'No additional supported challenge identified', challenges, sources);
    appendStringList(section, 'Claims VEX accepted', output.concededClaimIds.map(id => ({ title: id })), sources);
    appendStringList(section, 'Missing evidence', output.missingEvidence, sources);
    appendStringList(section, 'Alternative hypotheses', output.alternateHypotheses, sources);
    $('#transcript-content').append(section);
  }

  function renderSealDraft(output, sources) {
    const section = document.createElement('details');
    section.open = true;
    const summary = document.createElement('summary');
    summary.textContent = 'SEAL · Final evidence audit';
    section.append(summary);
    section.className = 'turn';
    section.dataset.transcriptRole = 'seal';
    const heading = document.createElement('div');
    heading.className = 'turn-head';
    heading.innerHTML = '<span>Claim-by-claim assessment</span>';
    const finding = document.createElement('p');
    finding.className = 'turn-thesis';
    finding.textContent = output.executiveFinding;
    const risk = document.createElement('p');
    risk.className = 'turn-thesis';
    risk.textContent = `Key remaining risk: ${output.missedRisk}`;
    section.append(heading, finding, risk);
    appendStringList(section, 'Audit decisions', output.dispositions.map(item => ({ title: `${item.claimId} · ${item.status}`, caveat: item.rationale, citations: item.citations })), sources);
    appendStringList(section, 'What to watch next', output.forwardChecklist, sources);
    $('#transcript-content').append(section);
  }

  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function renderPreMarket(prePack) {
    renderSources([...prePack.sources, prePack.bitgetSource]);
    const market = prePack.bitgetPre;
    text('#pre-market-value', `${market.symbol} · ${market.close} ${market.quoteCoin}`);
    text('#pre-market-time', `${formatTime(market.endAt)} · ${market.baseVolume} tokens · ${market.quoteTurnover} ${market.quoteCoin} turnover`);
  }

  async function requestRole(role, call) {
    const labels = { ATLAS: 'ATLAS is examining the pre-event evidence.', VEX: 'VEX is testing the completed ATLAS claims.', SEAL: 'SEAL is auditing evidence support.' };
    const keys = { ATLAS: 'atlas', VEX: 'vex', SEAL: 'seal' };
    setRole(keys[role], 'RUNNING', true);
    text('#stage-status', labels[role]);
    announce(labels[role]);
    try {
      const result = await call();
      setRole(keys[role], 'COMPLETE', false);
      renderWorkflow();
      return result;
    } catch (error) {
      setRole(keys[role], 'FAILED', false);
      state.lastFailedRole = role;
      text('#stage-status', `${role} failed. No response was recorded.`);
      showRunError(error.message, role);
      announce(`${role} failed. ${error.message}`);
      throw error;
    }
  }

  function showRunError(message, role) {
    const node = $('#run-error');
    node.replaceChildren();
    const p = document.createElement('p');
    p.textContent = message;
    node.append(p);
    if (role) {
      const retry = document.createElement('button');
      retry.className = 'button button-outline';
      retry.type = 'button';
      retry.textContent = `Retry ${role}`;
      retry.addEventListener('click', () => retryRole(role));
      node.append(retry);
    }
    node.hidden = false;
  }

  async function startRun() {
    $('#run-investigation').disabled = true;
    $('#run-error').hidden = true;
    $('#transcript-empty').hidden = true;
    $('#transcript-content').replaceChildren();
    $('#run-controls').hidden = true;
    try {
      const { preToken } = await api('/api/preflight', { caseId: state.caseId });
      state.preToken = preToken;
      renderPreMarket(preToken.payload.prePack);
      saveSession();
      state.atlasToken = await requestRole('ATLAS', () => api('/api/atlas', { preToken, userThesis: $('#user-thesis').value }));
      saveSession();
      renderAtlas(state.atlasToken.payload.output, [...preToken.payload.prePack.sources, preToken.payload.prePack.bitgetSource]);
      state.vexToken = await requestRole('VEX', () => api('/api/vex', { preToken, atlasToken: state.atlasToken }));
      saveSession();
      renderVex(state.vexToken.payload.output, [...preToken.payload.prePack.sources, preToken.payload.prePack.bitgetSource]);
      saveSession();
      text('#stage-status', 'ATLAS and VEX complete. Seal is available.');
      $('#stage-actions').hidden = false;
      text('#stage-action-copy', 'SEAL has not run yet. Continue only when you are ready to commit this transcript.');
      $('#seal-record').disabled = false;
    } catch (error) {
      $('#run-controls').hidden = false;
      $('#run-investigation').disabled = Boolean(state.atlasToken);
      if (!state.atlasToken) $('#transcript-empty').hidden = false;
      const retryRole = state.preToken ? (!state.atlasToken ? 'ATLAS' : !state.vexToken ? 'VEX' : null) : null;
      text('#stage-status', retryRole ? `${retryRole} did not complete. Earlier signed stages remain saved.` : 'The investigation could not start.');
      if ($('#run-error').hidden) showRunError(error.message || 'The interface could not continue this investigation.', retryRole);
    }
  }

  async function retryRole(role) {
    $('#run-error').hidden = true;
    const preToken = state.preToken;
    if (!preToken) return startRun();
    try {
      if (role === 'ATLAS') {
        state.atlasToken = await requestRole('ATLAS', () => api('/api/atlas', { preToken, userThesis: $('#user-thesis').value }));
        saveSession();
        $('#transcript-content').replaceChildren();
        renderAtlas(state.atlasToken.payload.output, [...preToken.payload.prePack.sources, preToken.payload.prePack.bitgetSource]);
        state.vexToken = null;
      }
      if (role === 'VEX') {
        if (!state.atlasToken) throw new Error('ATLAS must complete before VEX can retry.');
        if (!state.vexToken) {
          state.vexToken = await requestRole('VEX', () => api('/api/vex', { preToken, atlasToken: state.atlasToken }));
          saveSession();
        }
        const existingAtlas = state.atlasToken.payload.output;
        $('#transcript-content').replaceChildren();
        renderAtlas(existingAtlas, [...preToken.payload.prePack.sources, preToken.payload.prePack.bitgetSource]);
        renderVex(state.vexToken.payload.output, [...preToken.payload.prePack.sources, preToken.payload.prePack.bitgetSource]);
      }
      if (role === 'SEAL') return sealRecord();
      saveSession();
      if (state.vexToken) {
        $('#stage-actions').hidden = false;
        $('#seal-record').disabled = false;
        text('#stage-action-copy', 'ATLAS and VEX complete. SEAL is available.');
      }
    } catch (error) {
      if ($('#run-error').hidden) showRunError(error.message || `The ${role} result could not be displayed.`, role);
    }
  }

  async function sealRecord() {
    if (!state.preToken || !state.atlasToken || !state.vexToken) return;
    $('#seal-record').disabled = true;
    $('#run-error').hidden = true;
    try {
      const result = await requestRole('SEAL', () => api('/api/seal', { preToken: state.preToken, atlasToken: state.atlasToken, vexToken: state.vexToken }));
      state.sealToken = result.sealToken;
      setRole('seal', 'COMPLETE', false);
      renderSealDraft(state.sealToken.payload.record.stages.seal.payload.output, [...state.preToken.payload.prePack.sources, state.preToken.payload.prePack.bitgetSource]);
      $('#seal-panel').hidden = false;
      $('#stage-actions').hidden = true;
      text('#seal-digest', result.digest);
      text('#seal-time', `${formatTime(result.sealedAt)} · Server signed`);
      text('#reveal-state', 'Receipt is sealed. Verify it or reveal the post-event window.');
      $('#reveal-outcome').disabled = false;
      renderWorkflow();
      renderNavigation();
      saveSession();
      announce('The three roles completed and the pre-event record was sealed.');
    } catch {
      $('#seal-record').disabled = false;
    }
  }

  function renderInvestigationState() {
    renderWorkflow();
    if (state.preToken) {
      for (const role of ['atlas', 'vex', 'seal']) if (state[`${role}Token`]) setRole(role, 'COMPLETE');
      renderPreMarket(state.preToken.payload.prePack);
      $('#run-controls').hidden = Boolean(state.atlasToken);
      $('#transcript-empty').hidden = Boolean(state.atlasToken);
      if (state.atlasToken && $('#transcript-content').children.length === 0) renderAtlas(state.atlasToken.payload.output, [...state.preToken.payload.prePack.sources, state.preToken.payload.prePack.bitgetSource]);
      if (state.vexToken && ![...$('#transcript-content').children].some(node => node.dataset.transcriptRole === 'vex')) renderVex(state.vexToken.payload.output, [...state.preToken.payload.prePack.sources, state.preToken.payload.prePack.bitgetSource]);
      if (state.sealToken) {
        $('#stage-actions').hidden = true;
        $('#seal-panel').hidden = false;
        text('#seal-digest', state.sealToken.payload.digest);
        text('#seal-time', `${formatTime(state.sealToken.payload.sealedAt)} · Server signed`);
        text('#reveal-state', 'Receipt is sealed. Verify it or reveal the post-event window.');
        $('#reveal-outcome').disabled = false;
        if (![...$('#transcript-content').children].some(node => node.dataset.transcriptRole === 'seal')) renderSealDraft(state.sealToken.payload.record.stages.seal.payload.output, [...state.preToken.payload.prePack.sources, state.preToken.payload.prePack.bitgetSource]);
      }
    } else {
      renderSources(caseMetadata()?.sources || []);
      $('#run-controls').hidden = false;
      $('#run-investigation').disabled = !(state.readiness?.model?.configured && state.readiness?.bitget?.ready);
    }
  }

  async function verifyReceipt(token = state.sealToken, statusSelector = '#verify-status') {
    if (!token) return;
    text(statusSelector, 'Checking receipt bytes and signature…');
    try {
      const result = await api('/api/verify', { sealToken: token });
      text(statusSelector, result.valid ? `VERIFIED · ${result.digest}` : 'REJECTED · Receipt signature or digest did not match.');
      if (!result.valid) $(statusSelector).classList.add('status-bad');
      else $(statusSelector).classList.add('status-good');
      return result;
    } catch (error) {
      text(statusSelector, `Verification unavailable · ${error.message}`);
      return null;
    }
  }

  function downloadReceipt() {
    if (!state.sealToken) return;
    const payload = { product: 'VEYRIN — Research Chamber', sealToken: state.sealToken };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `veyrin-${state.caseId}-receipt.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function tamperCheck() {
    if (!state.sealToken) return;
    const altered = structuredClone(state.sealToken);
    altered.payload.record.preEvidence.sources[0].summary += ' [changed byte]';
    const result = await verifyReceipt(altered, '#verify-status');
    if (result && !result.valid) text('#verify-status', 'TAMPER CHECK PASSED · Changed receipt bytes were rejected.');
  }

  async function loadReveal() {
    if (!state.sealToken || state.revealRequestActive) return;
    state.revealRequestActive = true;
    $('#locked-message').hidden = true;
    $('#reveal-error').hidden = true;
    $('#reveal-loading').hidden = false;
    try {
      state.reveal = await api('/api/reveal', { sealToken: state.sealToken });
      saveSession();
      renderRevealData(state.reveal);
    } catch (error) {
      $('#reveal-loading').hidden = true;
      $('#reveal-error').hidden = false;
      text('#reveal-error-copy', error.message);
    } finally { state.revealRequestActive = false; }
  }

  function renderRevealState() {
    if (!state.sealToken) {
      $('#reveal-loading').hidden = true;
      $('#reveal-error').hidden = true;
      $('#reveal-data').hidden = true;
      $('#locked-message').hidden = false;
      $('.reveal-heading h1').textContent = 'Market outcome locked';
      text('#reveal-summary', 'No signed record is available in this browser session.');
      return;
    }
    $('#locked-message').hidden = true;
    if (state.reveal) renderRevealData(state.reveal);
    else {
      $('#locked-message').hidden = false;
      $('.reveal-heading h1').textContent = 'Ready to reveal';
      $('#locked-message h2').textContent = 'The record is sealed. Ready to reveal.';
      text('#reveal-summary', 'Post-event data is loaded only when you explicitly reveal it.');
      const link = $('#locked-message a');
      link.innerHTML = 'Return to the sealed record <span aria-hidden="true">↗</span>';
    }
  }

  function renderRevealData(result) {
    $('.reveal-heading h1').textContent = 'Observed market movement';
    $('#reveal-loading').hidden = true;
    $('#reveal-error').hidden = true;
    $('#reveal-data').hidden = false;
    text('#reveal-summary', 'The sealed receipt was verified before these two completed Bitget market candles were retrieved.');
    text('#reveal-symbol', result.pre.symbol);
    text('#price-before', `${formatPrice(result.pre.close)} ${result.pre.quoteCoin}`);
    text('#price-after', `${formatPrice(result.post.close)} ${result.post.quoteCoin}`);
    text('#time-before', formatWindow(result.pre.startAt, result.pre.endAt));
    text('#time-after', formatWindow(result.post.startAt, result.post.endAt));
    text('#price-change', result.observedChangePercent == null ? 'UNAVAILABLE' : `${result.observedChangePercent < 0 ? '−' : result.observedChangePercent > 0 ? '+' : ''}${Math.abs(result.observedChangePercent).toFixed(4)}%`);
    $('#price-change').classList.toggle('positive-move', result.observedChangePercent > 0);
    text('#volume-before', `PRE TURNOVER · ${formatPrice(result.pre.quoteTurnover)} ${result.pre.quoteCoin}`);
    text('#volume-after', `POST TURNOVER · ${formatPrice(result.post.quoteTurnover)} ${result.post.quoteCoin}`);
    text('#sealed-executive', state.sealToken.payload.record.stages.seal.payload.output.executiveFinding);
    text('#outcome-source-title', result.outcomeSource.title);
    $('#outcome-source-link').href = result.outcomeSource.url;
    text('#reveal-interpretation', result.interpretation);
    const dispositions = $('#dispositions');
    dispositions.replaceChildren();
    for (const item of state.sealToken.payload.record.stages.seal.payload.output.dispositions) {
      const row = document.createElement('div');
      row.className = 'disposition-row';
      const id = document.createElement('strong');
      id.textContent = `${item.claimId} · ${item.status}`;
      const reason = document.createElement('span');
      reason.textContent = item.rationale;
      row.append(id, reason);
      dispositions.append(row);
    }
  }

  function formatWindow(startAt, endAt) {
    const start = new Date(startAt), end = new Date(endAt);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'Timestamp unavailable';
    const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
    const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'UTC' });
    if (day.format(start) === day.format(end)) return `${day.format(start)} · ${time.format(start)}–${time.format(end)} UTC`;
    return `${day.format(start)} ${time.format(start)} – ${day.format(end)} ${time.format(end)} UTC`;
  }

  function formatPrice(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '—';
  }

  async function renderProofState() {
    const hasReceipt = Boolean(state.sealToken);
    $('.proof-receipt').hidden = !hasReceipt;
    $('#proof-download').disabled = !hasReceipt;
    $('#proof-verify').disabled = !hasReceipt;
    text('#proof-session-status', hasReceipt ? `Receipt available · ${state.sealToken.payload.digest}` : 'No sealed record in this session.');

  }

  function renderNavigation() {
    const view = currentView();
    const inApp = ['case', 'investigation', 'reveal'].includes(view);
    const selectedPath = casePath(state.caseId || DEFAULT_CASE_ID);
    $('[data-case-link="research"]').href = selectedPath;
    $('[data-case-link="record"]').href = `${selectedPath}#seal-panel`;
    $('[data-case-link="reveal"]').href = `${selectedPath}/reveal`;
    $('.site-header').classList.toggle('is-app', inApp);
    $('.app-nav').hidden = !inApp;
    $('.site-nav').hidden = inApp;
    $('.header-cta').hidden = inApp;
    $('.menu-toggle').hidden = inApp;
    $('[data-record]').hidden = !state.sealToken;
    $('[data-reveal-nav]').hidden = !state.sealToken;
    $$('.app-nav [data-route]').forEach(link => {
      if (link.pathname === location.pathname) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function closeMenu() {
    $('.site-header').classList.remove('menu-open');
    $('.menu-toggle').setAttribute('aria-expanded', 'false');
    $('.menu-toggle').setAttribute('aria-label', 'Open navigation');
  }

  function selectRole(role) {
    $('.arena').dataset.selectedRole = role;
    $$('[data-select-role]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.selectRole === role)));
    const duties = { atlas: 'Builds the case from dated sources.', vex: 'Questions the assumptions and challenges specific claims.', seal: 'Audits evidence support before the server seals the record.' };
    text('#selected-role-duty', duties[role]);
  }

  function bindEvents() {
    document.addEventListener('click', event => {
      const record = event.target.closest('[data-record]');
      if (record) {
        event.preventDefault();
        navigate(casePath());
        $('#seal-panel').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        return;
      }
      const method = event.target.closest('[data-method]');
      if (method) {
        event.preventDefault();
        if (currentView() !== 'proof') navigate('/proof');
        history.replaceState({}, '', `/proof#${method.dataset.method}`);
        document.getElementById(method.dataset.method).scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        return;
      }
      const how = event.target.closest('[data-how]');
      if (how) {
        event.preventDefault();
        if (currentView() !== 'landing') navigate('/');
        closeMenu();
        $('#how-it-works').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        return;
      }
      const role = event.target.closest('[data-select-role]');
      if (role) selectRole(role.dataset.selectRole);
      const link = event.target.closest('[data-route]');
      if (link) {
        event.preventDefault();
        navigate(link.getAttribute('href'));
      }
    });
    window.addEventListener('popstate', () => renderRoute());
    $('#refresh-readiness').addEventListener('click', refreshReadiness);
    $('#check-availability').addEventListener('click', refreshReadiness);
    $('.menu-toggle').addEventListener('click', () => {
      const open = $('.site-header').classList.toggle('menu-open');
      $('.menu-toggle').setAttribute('aria-expanded', String(open));
      $('.menu-toggle').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && $('.site-header').classList.contains('menu-open')) { closeMenu(); $('.menu-toggle').focus(); } });
    $('#run-investigation').addEventListener('click', startRun);
    $('#seal-record').addEventListener('click', sealRecord);
    $('#reveal-outcome').addEventListener('click', () => { navigate(`${casePath()}/reveal`); if (!state.reveal) loadReveal(); });
    $('#retry-reveal').addEventListener('click', loadReveal);
    $('#download-receipt').addEventListener('click', downloadReceipt);
    $('#proof-download').addEventListener('click', downloadReceipt);
    $('#verify-receipt').addEventListener('click', () => verifyReceipt());
    $('#proof-verify').addEventListener('click', () => verifyReceipt(state.sealToken, '#proof-verify-status'));
    $('#verify-receipt').insertAdjacentText('afterend', ' ');
    const tamperButton = document.createElement('button');
    tamperButton.className = 'text-button';
    tamperButton.type = 'button';
    tamperButton.textContent = 'Test byte tampering';
    tamperButton.addEventListener('click', tamperCheck);
    $('#verify-receipt').parentElement.append(tamperButton);
  }

  function init() {
    resetCaseState(caseIdFromPath() || DEFAULT_CASE_ID);
    restoreSession();
    bindEvents();
    renderRoute({ loadReveal: false });
    if (!state.preToken) renderSources(caseMetadata()?.sources || []);
    const evidenceBreakpoint = matchMedia('(max-width: 600px)');
    $('.evidence-disclosure').open = !evidenceBreakpoint.matches;
    evidenceBreakpoint.addEventListener('change', event => { $('.evidence-disclosure').open = !event.matches; });
    if (currentView() === 'reveal') renderRevealState();
    renderProofState();
  }

  init();
})();
