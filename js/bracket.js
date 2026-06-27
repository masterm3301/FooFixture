// ── FIFA RANKINGS (June 2026, lower = better) ──────────────────────────────
const FIFA = {
    'Argentina':   1,  'France':      2,  'Brazil':      3,  'England':     4,
    'Spain':       5,  'Portugal':    6,  'Germany':     7,  'Netherlands': 8,
    'Colombia':    9,  'Uruguay':    10,  'Belgium':    11,  'USA':        12,
    'Mexico':     13,  'Switzerland':14,  'Morocco':    15,  'Japan':      16,
    'Norway':     17,  'Austria':    18,  'South Korea':19,  'Australia':  20,
    'Egypt':      21,  'Canada':     22,  'Ivory Coast':23,  'Sweden':     24,
    'Croatia':    25,  'Algeria':    26,  'Iran':       27,  'Scotland':   28,
    'Ghana':      29,  'Paraguay':   30,  'Cape Verde': 31,  'DR Congo':   32,
    'South Africa':33
};

// ── BRACKET TREE ────────────────────────────────────────────────────────────
const M = {
    'r32-L1': { teams:[], next:'r16-L1', slot:0 },
    'r32-L2': { teams:[], next:'r16-L1', slot:1 },
    'r32-L3': { teams:[], next:'r16-L2', slot:0 },
    'r32-L4': { teams:[], next:'r16-L2', slot:1 },
    'r32-L5': { teams:[], next:'r16-L3', slot:0 },
    'r32-L6': { teams:[], next:'r16-L3', slot:1 },
    'r32-L7': { teams:[], next:'r16-L4', slot:0 },
    'r32-L8': { teams:[], next:'r16-L4', slot:1 },

    'r32-R1': { teams:[], next:'r16-R1', slot:0 },
    'r32-R2': { teams:[], next:'r16-R1', slot:1 },
    'r32-R3': { teams:[], next:'r16-R2', slot:0 },
    'r32-R4': { teams:[], next:'r16-R2', slot:1 },
    'r32-R5': { teams:[], next:'r16-R3', slot:0 },
    'r32-R6': { teams:[], next:'r16-R3', slot:1 },
    'r32-R7': { teams:[], next:'r16-R4', slot:0 },
    'r32-R8': { teams:[], next:'r16-R4', slot:1 },

    'r16-L1': { sources:['r32-L1','r32-L2'], next:'qf-L1', slot:0 },
    'r16-L2': { sources:['r32-L3','r32-L4'], next:'qf-L1', slot:1 },
    'r16-L3': { sources:['r32-L5','r32-L6'], next:'qf-L2', slot:0 },
    'r16-L4': { sources:['r32-L7','r32-L8'], next:'qf-L2', slot:1 },
    'r16-R1': { sources:['r32-R1','r32-R2'], next:'qf-R1', slot:0 },
    'r16-R2': { sources:['r32-R3','r32-R4'], next:'qf-R1', slot:1 },
    'r16-R3': { sources:['r32-R5','r32-R6'], next:'qf-R2', slot:0 },
    'r16-R4': { sources:['r32-R7','r32-R8'], next:'qf-R2', slot:1 },

    'qf-L1':  { sources:['r16-L1','r16-L2'], next:'sf-L', slot:0 },
    'qf-L2':  { sources:['r16-L3','r16-L4'], next:'sf-L', slot:1 },
    'qf-R1':  { sources:['r16-R1','r16-R2'], next:'sf-R', slot:0 },
    'qf-R2':  { sources:['r16-R3','r16-R4'], next:'sf-R', slot:1 },

    'sf-L':   { sources:['qf-L1','qf-L2'],   next:'final', slot:0 },
    'sf-R':   { sources:['qf-R1','qf-R2'],   next:'final', slot:1 },

    'final':  { sources:['sf-L','sf-R'],      next:null }
};

R32.forEach(f => { if (M[f.id]) M[f.id].teams = [f.t1, f.t2]; });

// ── STATE ───────────────────────────────────────────────────────────────────
let activeL = null, activeR = null, prevActiveL = null, prevActiveR = null;
let fillMode = true;

// manual pick state: matchId → winning team name
const manualPicks = {};

// ── SHARED HELPERS ──────────────────────────────────────────────────────────
function slot(matchId, idx) {
    return document.getElementById(`slot-${matchId}-${idx === 0 ? 'a' : 'b'}`);
}
function matchEl(matchId) {
    return document.getElementById(`match-${matchId}`);
}
function findR32(team) {
    for (const [id, m] of Object.entries(M)) {
        if (m.teams && m.teams.includes(team)) return id;
    }
    return null;
}
function getSide(team) {
    const id = findR32(team);
    if (!id) return null;
    return id.includes('-L') ? 'L' : 'R';
}

// ── PREDICTION MODE HELPERS ─────────────────────────────────────────────────
function best(matchId) {
    const m = M[matchId];
    if (m.teams) {
        const r1 = FIFA[m.teams[0]] || 99, r2 = FIFA[m.teams[1]] || 99;
        if (m.teams[0] === 'TBD' && m.teams[1] === 'TBD') return 'TBD';
        return r1 <= r2 ? m.teams[0] : m.teams[1];
    }
    const t1 = best(m.sources[0]), t2 = best(m.sources[1]);
    if (!t1 || t1 === 'TBD') return t2;
    if (!t2 || t2 === 'TBD') return t1;
    return (FIFA[t1] || 99) <= (FIFA[t2] || 99) ? t1 : t2;
}
function loser(matchId) {
    const m = M[matchId];
    if (m.teams) {
        if (m.teams[0] === 'TBD') return m.teams[1];
        if (m.teams[1] === 'TBD') return m.teams[0];
        const r1 = FIFA[m.teams[0]] || 99, r2 = FIFA[m.teams[1]] || 99;
        return r1 <= r2 ? m.teams[1] : m.teams[0];
    }
    const t1 = best(m.sources[0]), t2 = best(m.sources[1]);
    if (!t1 || t1 === 'TBD') return t2;
    if (!t2 || t2 === 'TBD') return t1;
    return (FIFA[t1] || 99) <= (FIFA[t2] || 99) ? t2 : t1;
}
function fill3rd() {
    const t1 = loser('sf-L'), t2 = loser('sf-R');
    const s1 = document.getElementById('slot-3rd-a'), s2 = document.getElementById('slot-3rd-b');
    const box = document.getElementById('match-3rd');
    if (s1) { s1.textContent = t1 || '?'; s1.classList.add('pred-opponent'); }
    if (s2) { s2.textContent = t2 || '?'; s2.classList.add('pred-opponent'); }
    if (box) box.classList.add('pred-route');
}
function buildRoute(team) {
    const r32Id = findR32(team);
    if (!r32Id) return [];
    const steps = [];
    let cur = r32Id;
    while (M[cur].next) {
        const nextId = M[cur].next;
        const mySlot = M[cur].slot;
        const siblingId = M[nextId].sources[1 - mySlot];
        const opponent = best(siblingId);
        steps.push({ matchId: nextId, mySlot, opponent });
        cur = nextId;
    }
    return steps;
}

const ROUND_LABEL = {
    'r16-L1':'R16','r16-L2':'R16','r16-L3':'R16','r16-L4':'R16',
    'r16-R1':'R16','r16-R2':'R16','r16-R3':'R16','r16-R4':'R16',
    'qf-L1':'QF','qf-L2':'QF','qf-R1':'QF','qf-R2':'QF',
    'sf-L':'SF','sf-R':'SF','final':'Final'
};

// ── PREDICTION MODE RENDERING ───────────────────────────────────────────────
function clearVisuals() {
    document.querySelectorAll('.pred-route').forEach(e => e.classList.remove('pred-route'));
    document.querySelectorAll('.pred-selected').forEach(e => e.classList.remove('pred-selected'));
    document.querySelectorAll('.pred-dim').forEach(e => e.classList.remove('pred-dim'));
    document.querySelectorAll('.pred-opponent').forEach(e => e.classList.remove('pred-opponent'));
    document.querySelectorAll('.pred-fill').forEach(e => e.classList.remove('pred-fill'));
    document.querySelectorAll('.prediction-slot').forEach(e => { e.textContent = ' '; });
}
function clearAll() {
    clearVisuals();
    activeL = activeR = prevActiveL = prevActiveR = null;
    document.getElementById('pred-banner').textContent = 'Click any team to predict their route to the Final';
}
function fillBracket(excludeMatchIds) {
    Object.entries(M).forEach(([matchId, m]) => {
        if (!m.sources || excludeMatchIds.has(matchId)) return;
        const el0 = slot(matchId, 0), el1 = slot(matchId, 1);
        if (el0) { el0.textContent = best(m.sources[0]); el0.classList.add('pred-fill'); }
        if (el1) { el1.textContent = best(m.sources[1]); el1.classList.add('pred-fill'); }
    });
}
function highlightR32(team) {
    const r32Id = findR32(team);
    const r32Box = document.querySelector(`[data-match-id="${r32Id}"]`);
    if (!r32Box) return;
    r32Box.classList.add('pred-route');
    r32Box.querySelectorAll('[data-team]').forEach(el => {
        el.classList.add(el.dataset.team === team ? 'pred-selected' : 'pred-dim');
    });
}
function applySteps(steps, teamName, animate) {
    steps.forEach(({ matchId, mySlot, opponent }, i) => {
        const apply = () => {
            const box = matchEl(matchId);
            if (box) box.classList.add('pred-route');
            const mySlotEl  = slot(matchId, mySlot);
            const oppSlotEl = slot(matchId, 1 - mySlot);
            if (mySlotEl)  { mySlotEl.classList.remove('pred-fill');  mySlotEl.textContent  = teamName; mySlotEl.classList.add('pred-selected'); }
            if (oppSlotEl) { oppSlotEl.classList.remove('pred-fill'); oppSlotEl.textContent = opponent; oppSlotEl.classList.add('pred-opponent'); }
        };
        animate ? setTimeout(apply, i * 180) : apply();
    });
}
function redraw() {
    clearVisuals();
    if (!activeL && !activeR) {
        document.getElementById('pred-banner').textContent = 'Click any team to predict their route to the Final';
        return;
    }
    const pathMatchIds = new Set();
    if (activeL) buildRoute(activeL).forEach(s => pathMatchIds.add(s.matchId));
    if (activeR) buildRoute(activeR).forEach(s => pathMatchIds.add(s.matchId));
    if (fillMode) fillBracket(pathMatchIds);
    const lChanged = activeL !== prevActiveL, rChanged = activeR !== prevActiveR;
    if (!activeL || !activeR) {
        const team = activeL || activeR;
        const animate = lChanged || rChanged;
        highlightR32(team);
        const steps = buildRoute(team);
        const routeParts = steps.map(s => `${ROUND_LABEL[s.matchId]}: vs ${s.opponent}`);
        applySteps(steps, team, animate);
        const bannerDelay = animate ? steps.length * 180 : 0;
        setTimeout(() => {
            document.getElementById('pred-banner').textContent =
                `${team} predicted route → ` + routeParts.join('  →  ');
        }, bannerDelay);
        const thirdDelay = animate ? (steps.length - 1) * 180 + 120 : 0;
        setTimeout(fill3rd, thirdDelay);
        return;
    }
    highlightR32(activeL);
    highlightR32(activeR);
    const stepsL = buildRoute(activeL), stepsR = buildRoute(activeR);
    const preL = stepsL.filter(s => s.matchId !== 'final');
    const preR = stepsR.filter(s => s.matchId !== 'final');
    applySteps(preL, activeL, lChanged);
    applySteps(preR, activeR, rChanged);
    const fBox = matchEl('final');
    if (fBox) fBox.classList.add('pred-route');
    if (!lChanged) { const s = slot('final', 0); if (s) { s.classList.remove('pred-fill'); s.textContent = activeL; s.classList.add('pred-selected'); } }
    if (!rChanged) { const s = slot('final', 1); if (s) { s.classList.remove('pred-fill'); s.textContent = activeR; s.classList.add('pred-selected'); } }
    const finalDelay = Math.max(lChanged ? preL.length : 0, rChanged ? preR.length : 0) * 180;
    setTimeout(() => {
        const slotA = slot('final', 0), slotB = slot('final', 1);
        if (slotA) { slotA.classList.remove('pred-fill'); slotA.textContent = activeL; slotA.classList.add('pred-selected'); }
        if (slotB) { slotB.classList.remove('pred-fill'); slotB.textContent = activeR; slotB.classList.add('pred-selected'); }
        document.getElementById('pred-banner').textContent = `${activeL} vs ${activeR} — predicted to meet in the Final!`;
        setTimeout(fill3rd, 120);
    }, finalDelay);
}

// ── MANUAL PICK MODE ────────────────────────────────────────────────────────
function clearDownstreamManual(matchId) {
    delete manualPicks[matchId];
    for (const [id, m] of Object.entries(M)) {
        if (m.sources && m.sources.includes(matchId)) clearDownstreamManual(id);
    }
}

function clearManualVisuals() {
    document.querySelectorAll('.prediction-slot').forEach(el => {
        el.textContent = ' ';
        el.classList.remove('manual-winner', 'manual-loser', 'manual-available');
        delete el.dataset.manualMatch;
        delete el.dataset.manualTeam;
    });
    document.querySelectorAll('[data-team]').forEach(el => {
        el.classList.remove('manual-winner', 'manual-loser');
    });
    document.querySelectorAll('.matchup').forEach(el => {
        el.classList.remove('manual-ready');
    });
}

function renderManualBracket() {
    clearManualVisuals();

    // Highlight R32 winners/losers
    R32.forEach(({ id }) => {
        const winner = manualPicks[id];
        if (!winner) return;
        const box = document.querySelector(`[data-match-id="${id}"]`);
        if (!box) return;
        box.querySelectorAll('[data-team]').forEach(el => {
            el.classList.add(el.dataset.team === winner ? 'manual-winner' : 'manual-loser');
        });
    });

    // Render each non-R32 match
    Object.keys(M).filter(id => M[id].sources).forEach(matchId => {
        const m = M[matchId];
        const team0 = manualPicks[m.sources[0]] || null;
        const team1 = manualPicks[m.sources[1]] || null;
        const winner = manualPicks[matchId];
        const slotA = slot(matchId, 0);
        const slotB = slot(matchId, 1);
        const box = matchEl(matchId);

        if (team0 && slotA) {
            slotA.textContent = team0;
            slotA.dataset.manualMatch = matchId;
            slotA.dataset.manualTeam = team0;
            slotA.classList.add('manual-available');
            if (winner) slotA.classList.add(team0 === winner ? 'manual-winner' : 'manual-loser');
        }
        if (team1 && slotB) {
            slotB.textContent = team1;
            slotB.dataset.manualMatch = matchId;
            slotB.dataset.manualTeam = team1;
            slotB.classList.add('manual-available');
            if (winner) slotB.classList.add(team1 === winner ? 'manual-winner' : 'manual-loser');
        }

        // Glow the matchup box when both teams are ready but no winner picked yet
        if (box && team0 && team1 && !winner) box.classList.add('manual-ready');
    });

    // 3rd place
    const finL = manualPicks['sf-L'], finR = manualPicks['sf-R'];
    if (finL && finR) {
        const sfLsrc = [manualPicks[M['sf-L'].sources[0]], manualPicks[M['sf-L'].sources[1]]];
        const sfRsrc = [manualPicks[M['sf-R'].sources[0]], manualPicks[M['sf-R'].sources[1]]];
        const lL = sfLsrc.find(t => t && t !== finL) || '?';
        const lR = sfRsrc.find(t => t && t !== finR) || '?';
        const s3a = document.getElementById('slot-3rd-a'), s3b = document.getElementById('slot-3rd-b');
        if (s3a) { s3a.textContent = lL; s3a.classList.add('manual-winner'); }
        if (s3b) { s3b.textContent = lR; s3b.classList.add('manual-winner'); }
        const m3 = document.getElementById('match-3rd');
        if (m3) m3.classList.add('manual-ready');
    }

    // Banner
    const banner = document.getElementById('pred-banner');
    if (finL && finR) {
        banner.textContent = `${finL} vs ${finR} — your predicted Final! 🏆`;
    } else if (finL) {
        banner.textContent = `${finL} is in the Final — now pick the right-side finalist`;
    } else if (finR) {
        banner.textContent = `${finR} is in the Final — now pick the left-side finalist`;
    } else if (Object.keys(manualPicks).length === 0) {
        banner.textContent = 'Click any team to advance them — pick the winner of each match';
    } else {
        banner.textContent = 'Keep picking — click a winner to advance them to the next round';
    }
}

// ── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Sync R32 HTML from fixtures.js
    R32.forEach(f => {
        const box = document.querySelector(`[data-match-id="${f.id}"]`);
        if (!box) return;
        const teamEls = box.querySelectorAll('[data-team]');
        if (teamEls[0]) { teamEls[0].dataset.team = f.t1; teamEls[0].textContent = f.t1; }
        if (teamEls[1]) { teamEls[1].dataset.team = f.t2; teamEls[1].textContent = f.t2; }
    });

    // Set initial banner for fill-ON mode (default)
    document.getElementById('pred-banner').textContent = 'Click any team to predict their route to the Final';

    // Fill-bracket toggle
    document.getElementById('fill-toggle-cb').addEventListener('change', function () {
        fillMode = this.checked;
        // Clear both modes on switch
        clearManualVisuals();
        Object.keys(manualPicks).forEach(k => delete manualPicks[k]);
        clearAll();
        if (fillMode) {
            document.getElementById('pred-banner').textContent = 'Click any team to predict their route to the Final';
        } else {
            document.getElementById('pred-banner').textContent = 'Click any team to advance them — pick the winner of each match';
        }
    });

    // R32 team clicks
    document.querySelectorAll('[data-team]').forEach(el => {
        el.addEventListener('click', e => {
            e.stopPropagation();
            const team = el.dataset.team;
            if (!team || team === 'TBD') return;

            if (!fillMode) {
                // Manual pick mode: click to advance as winner
                const r32Id = findR32(team);
                if (!r32Id) return;
                if (manualPicks[r32Id] === team) {
                    clearDownstreamManual(r32Id);
                } else {
                    clearDownstreamManual(r32Id);
                    manualPicks[r32Id] = team;
                }
                renderManualBracket();
                return;
            }

            // Prediction mode (fill ON)
            const side = getSide(team);
            prevActiveL = activeL; prevActiveR = activeR;
            if (side === 'L') activeL = (activeL === team) ? null : team;
            else if (side === 'R') activeR = (activeR === team) ? null : team;
            redraw();
        });
    });

    // Prediction-slot clicks (manual mode: advance from R16 onward)
    document.querySelectorAll('.prediction-slot').forEach(slotEl => {
        slotEl.addEventListener('click', e => {
            e.stopPropagation();
            if (fillMode) return;
            const matchId = slotEl.dataset.manualMatch;
            const team = slotEl.dataset.manualTeam;
            if (!matchId || !team) return;
            if (manualPicks[matchId] === team) {
                clearDownstreamManual(matchId);
            } else {
                clearDownstreamManual(matchId);
                manualPicks[matchId] = team;
            }
            renderManualBracket();
        });
    });

    // Click outside: reset prediction mode only (manual picks are sticky)
    document.addEventListener('click', e => {
        if (e.target.closest('[data-team]') || e.target.closest('.prediction-slot') || e.target.closest('.fill-toggle')) return;
        if (fillMode) clearAll();
    });
});
