// ── WORLD CUP 2026 — ROUND OF 32 DATA ────────────────────────────────────────
// THIS is the only file you need to edit each day.
// Update t1/t2 as teams are confirmed. Use 'TBD' for unconfirmed opponents.
// ─────────────────────────────────────────────────────────────────────────────

const FLAGS = {
    'Germany':'🇩🇪','Paraguay':'🇵🇾','France':'🇫🇷','Sweden':'🇸🇪',
    'South Africa':'🇿🇦','Canada':'🇨🇦','Netherlands':'🇳🇱','Morocco':'🇲🇦',
    'Portugal':'🇵🇹','Croatia':'🇭🇷','Spain':'🇪🇸','Austria':'🇦🇹',
    'USA':'🇺🇸','Bosnia-Herzegovina':'🇧🇦','Belgium':'🇧🇪','Senegal':'🇸🇳',
    'Brazil':'🇧🇷','Japan':'🇯🇵','Ivory Coast':'🇨🇮','Norway':'🇳🇴',
    'Mexico':'🇲🇽','Ecuador':'🇪🇨','England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','DR Congo':'🇨🇩',
    'Argentina':'🇦🇷','Cape Verde':'🇨🇻','Australia':'🇦🇺','Egypt':'🇪🇬',
    'Switzerland':'🇨🇭','Algeria':'🇩🇿','Colombia':'🇨🇴','Ghana':'🇬🇭',
    'South Korea':'🇰🇷','Scotland':'🏴󠁧󠁢󠁳󠁣󠁴󠁿','Iran':'🇮🇷','Uruguay':'🇺🇾',
};

const R32 = [
  // ── LEFT SIDE ──────────────────────────────────────────────────────────────
  {
    id: "r32-L1",
    date: "29 JUN 21:30",
    venue: "Boston",
    t1: "Germany",
    t2: "Paraguay",
    score: "1–1 a.e.t. (4–3p)",
    winner: "Paraguay",
  },
  {
    id: "r32-L2",
    date: "30 JUN 22:00",
    venue: "NY New Jersey",
    t1: "France",
    t2: "Sweden",
    score: "3–0",
    winner: "France",
  },
  {
    id: "r32-L3",
    date: "28 JUN 20:00",
    venue: "Los Angeles",
    t1: "South Africa",
    t2: "Canada",
    score: "0–1",
    winner: "Canada",
  },
  {
    id: "r32-L4",
    date: "29 JUN 02:00",
    venue: "Monterrey",
    t1: "Netherlands",
    t2: "Morocco",
    score: "1–1 a.e.t. (3–2p)",
    winner: "Morocco",
  },
  {
    id: "r32-L5",
    date: "02 JUL 00:00",
    venue: "Toronto",
    t1: "Portugal",
    t2: "Croatia",
  },
  {
    id: "r32-L6",
    date: "02 JUL 20:00",
    venue: "Los Angeles",
    t1: "Spain",
    t2: "Austria",
  },
  {
    id: "r32-L7",
    date: "01 JUL 01:00",
    venue: "San Francisco",
    t1: "USA",
    t2: "Bosnia-Herzegovina",
  },
  {
    id: "r32-L8",
    date: "01 JUL 21:00",
    venue: "Seattle",
    t1: "Belgium",
    t2: "Senegal",
  },

  // ── RIGHT SIDE ─────────────────────────────────────────────────────────────
  {
    id: "r32-R1",
    date: "29 JUN 18:00",
    venue: "Houston",
    t1: "Brazil",
    t2: "Japan",
    score: "2–1",
    winner: "Brazil",
  },
  {
    id: "r32-R2",
    date: "30 JUN 18:00",
    venue: "Dallas",
    t1: "Ivory Coast",
    t2: "Norway",
    score: "2–1",
    winner: "Norway",
  },
  {
    id: "r32-R3",
    date: "01 JUL 02:00",
    venue: "Mexico City",
    t1: "Mexico",
    t2: "Ecuador",
    score: "2–0",
    winner: "Mexico",
  },
  {
    id: "r32-R4",
    date: "01 JUL 17:00",
    venue: "Atlanta",
    t1: "England",
    t2: "DR Congo",
  },
  {
    id: "r32-R5",
    date: "03 JUL 23:00",
    venue: "Miami",
    t1: "Argentina",
    t2: "Cape Verde",
  },
  {
    id: "r32-R6",
    date: "03 JUL 19:00",
    venue: "Dallas",
    t1: "Australia",
    t2: "Egypt",
  },
  {
    id: "r32-R7",
    date: "02 JUL 23:00",
    venue: "Vancouver",
    t1: "Switzerland",
    t2: "Algeria",
  },
  {
    id: "r32-R8",
    date: "03 JUL 21:30",
    venue: "Kansas City",
    t1: "Colombia",
    t2: "Ghana",
  },
];
