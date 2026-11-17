// Builds assets/stats.svg from the GitHub GraphQL API. No dependencies, Node 20+.
// Usage: GITHUB_TOKEN=... LOGIN=<user> node scripts/stats.mjs [output path]
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const token = process.env.GITHUB_TOKEN;
const login = process.env.LOGIN || process.env.GITHUB_REPOSITORY_OWNER;
const output = process.argv[2] || 'assets/stats.svg';
if (!token || !login) {
  console.error('GITHUB_TOKEN and LOGIN (or GITHUB_REPOSITORY_OWNER) are required.');
  process.exit(1);
}

const query = `query ($login: String!) {
  user(login: $login) {
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
      totalCount
      nodes {
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name color } }
        }
      }
    }
    contributionsCollection {
      totalPullRequestContributions
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount weekday } }
      }
    }
  }
}`;

const response = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'profile-stats-card' },
  body: JSON.stringify({ query, variables: { login } }),
});
const payload = await response.json();
if (!response.ok || payload.errors || !payload.data?.user) {
  console.error('GitHub API request failed:', response.status, JSON.stringify(payload.errors ?? payload));
  process.exit(1);
}
const user = payload.data.user;

// ---- numbers -------------------------------------------------------------
const weeks = user.contributionsCollection.contributionCalendar.weeks;
const days = weeks.flatMap((week) => week.contributionDays);
const total = user.contributionsCollection.contributionCalendar.totalContributions;
const pullRequests = user.contributionsCollection.totalPullRequestContributions;

// The current streak may end yesterday: today is not over yet.
let current = 0;
let index = days.length - 1;
if (index >= 0 && days[index].contributionCount === 0) index -= 1;
for (; index >= 0 && days[index].contributionCount > 0; index -= 1) current += 1;

const bytes = new Map();
for (const repo of user.repositories.nodes) {
  for (const edge of repo.languages.edges) {
    const entry = bytes.get(edge.node.name) ?? { name: edge.node.name, color: edge.node.color ?? '#94A3B8', size: 0 };
    entry.size += edge.size;
    bytes.set(edge.node.name, entry);
  }
}
const ranked = [...bytes.values()].sort((a, b) => b.size - a.size);
const allBytes = ranked.reduce((sum, language) => sum + language.size, 0) || 1;
const languages = ranked.slice(0, 5).map((language) => ({ ...language, share: language.size / allBytes }));
const shownShare = languages.reduce((sum, language) => sum + language.share, 0);
if (ranked.length > 5) languages.push({ name: 'Other', color: '#475569', share: 1 - shownShare });

// ---- drawing -------------------------------------------------------------
const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const num = (value) => value.toLocaleString('en-US');
const pct = (share) => (share >= 0.1 ? `${Math.round(share * 100)}%` : `${(share * 100).toFixed(1)}%`);
const plural = (value, word) => `${num(value)} ${word}${value === 1 ? '' : 's'}`;

const tiles = [
  { label: 'CONTRIBUTIONS', value: num(total), note: 'in the last 12 months', accent: '#22D3EE' },
  { label: 'CURRENT STREAK', value: plural(current, 'day'), note: current > 0 ? 'and counting' : 'ready for the next one', accent: '#FBBF24', pulse: current > 0 },
  { label: 'PULL REQUESTS', value: num(pullRequests), note: 'in the last 12 months', accent: '#818CF8' },
  { label: 'PUBLIC REPOS', value: num(user.repositories.totalCount), note: 'original work, forks excluded', accent: '#34D399' },
];

const tileWidth = 264;
const tileSvg = tiles.map((tile, i) => {
  const x = 48 + i * (tileWidth + 16);
  return `
  <g class="rise" style="animation-delay:${i * 120}ms">
    <rect x="${x}" y="64" width="${tileWidth}" height="100" rx="14" fill="#0F172A" fill-opacity="0.92" stroke="#334155"/>
    <rect x="${x + 20}" y="86" width="4" height="56" rx="2" fill="${tile.accent}"/>
    ${tile.pulse ? `<circle class="pulse" cx="${x + tileWidth - 26}" cy="90" r="5" fill="${tile.accent}"/>` : ''}
    <text x="${x + 38}" y="96" font-size="11.5" font-weight="700" letter-spacing="1.6" fill="#94A3B8">${tile.label}</text>
    <text x="${x + 38}" y="130" font-size="30" font-weight="800" fill="#FFFFFF">${esc(tile.value)}</text>
    <text x="${x + 38}" y="150" font-size="12" fill="#94A3B8">${esc(tile.note)}</text>
  </g>`;
}).join('');

// Languages: one stacked bar plus a two-column legend.
const barX = 72;
const barWidth = 332;
let offset = 0;
const segments = languages.map((language) => {
  const width = language.share * barWidth;
  const rect = `<rect x="${(barX + offset).toFixed(2)}" y="232" width="${width.toFixed(2)}" height="12" fill="${language.color}"/>`;
  offset += width;
  return rect;
}).join('');
const legend = languages.map((language, i) => {
  const x = barX + (i % 2) * 172;
  const y = 276 + Math.floor(i / 2) * 24;
  return `
    <g class="rise" style="animation-delay:${700 + i * 70}ms">
      <circle cx="${x + 5}" cy="${y - 4}" r="5" fill="${language.color}"/>
      <text x="${x + 18}" y="${y}" font-size="12.5" fill="#E2E8F0">${esc(language.name)}</text>
      <text x="${x + 150}" y="${y}" font-size="12.5" fill="#94A3B8" text-anchor="end">${pct(language.share)}</text>
    </g>`;
}).join('');

// Heatmap: one column per week, shaded by quartile of the non-zero days.
const counts = days.map((day) => day.contributionCount).filter((count) => count > 0).sort((a, b) => a - b);
const quartile = (q) => counts[Math.min(counts.length - 1, Math.floor(counts.length * q))] ?? 0;
const cuts = [quartile(0.25), quartile(0.5), quartile(0.75)];
const shades = ['#155E75', '#0891B2', '#22D3EE', '#A5F3FC'];
const shade = (count) => (count === 0 ? null : shades[cuts.filter((cut) => count > cut).length]);

const cell = 12;
const mapX = 480;
const mapY = 242;
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let lastMonth = -1;
let lastLabelColumn = -4;
const monthLabels = [];
const columns = weeks.map((week, column) => {
  const first = week.contributionDays[0];
  const month = Number(first.date.slice(5, 7)) - 1;
  if (month !== lastMonth) {
    lastMonth = month;
    if (column - lastLabelColumn >= 3 && column < weeks.length - 1) {
      monthLabels.push(`<text x="${mapX + column * cell}" y="${mapY - 10}" font-size="11" fill="#64748B">${monthNames[month]}</text>`);
      lastLabelColumn = column;
    }
  }
  const cells = week.contributionDays.map((day) => {
    const fill = shade(day.contributionCount);
    const attrs = fill ? `fill="${fill}"` : 'fill="#FFFFFF" fill-opacity="0.07"';
    return `<rect x="${mapX + column * cell}" y="${mapY + day.weekday * cell}" width="9" height="9" rx="2" ${attrs}/>`;
  }).join('');
  return `<g class="fade" style="animation-delay:${600 + column * 22}ms">${cells}</g>`;
}).join('\n    ');
const mapWidth = weeks.length * cell;

const updated = new Date().toISOString().slice(0, 10);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 380" width="1200" height="380" role="img" aria-labelledby="t d">
  <title id="t">GitHub activity for ${esc(login)}</title>
  <desc id="d">${num(total)} contributions in the last 12 months, ${num(pullRequests)} pull requests and a current streak of ${plural(current, 'day')}. Top languages in public repositories: ${esc(languages.map((language) => `${language.name} ${pct(language.share)}`).join(', '))}.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0B1020"/>
      <stop offset="1" stop-color="#0A1A33"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#22D3EE" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#22D3EE" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#6366F1" stop-opacity="0.26"/>
      <stop offset="1" stop-color="#6366F1" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#FFFFFF" fill-opacity="0.06"/>
    </pattern>
    <clipPath id="frame"><rect width="1200" height="380" rx="22"/></clipPath>
    <clipPath id="bar"><rect x="${barX}" y="232" width="${barWidth}" height="12" rx="6"/></clipPath>
    <clipPath id="map"><rect x="${mapX - 2}" y="${mapY - 2}" width="${mapWidth + 2}" height="${7 * cell + 2}"/></clipPath>
  </defs>
  <style>
    text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .rise { animation: rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
    .fade { animation: fade 0.5s ease-out both; }
    .grow { transform-box: fill-box; transform-origin: left center; animation: grow 1.1s cubic-bezier(0.2, 0.7, 0.2, 1) 0.5s both; }
    .pulse { transform-box: fill-box; transform-origin: center; animation: pulse 2s ease-in-out infinite; }
    .sweep { animation: sweep 7s linear 3s infinite; }
    @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.5); } }
    @keyframes sweep { from { transform: translateX(-140px); } 45%, to { transform: translateX(${mapWidth + 140}px); } }
    @media (prefers-reduced-motion: reduce) {
      .rise, .fade, .grow, .pulse { animation: none; }
      .sweep { display: none; }
    }
  </style>

  <g clip-path="url(#frame)">
    <rect width="1200" height="380" fill="url(#bg)"/>
    <rect width="1200" height="380" fill="url(#dots)"/>
    <circle cx="1100" cy="20" r="300" fill="url(#glowB)"/>
    <circle cx="90" cy="370" r="320" fill="url(#glowA)"/>
  </g>

  <text x="48" y="42" font-size="14" font-weight="700" letter-spacing="3" fill="#22D3EE">GITHUB ACTIVITY</text>
  <text x="1152" y="42" font-size="12" fill="#64748B" text-anchor="end">updated ${updated}</text>
${tileSvg}

  <g class="rise" style="animation-delay:480ms">
    <rect x="48" y="180" width="380" height="168" rx="14" fill="#0F172A" fill-opacity="0.92" stroke="#334155"/>
    <text x="72" y="212" font-size="11.5" font-weight="700" letter-spacing="1.6" fill="#94A3B8">TOP LANGUAGES · PUBLIC REPOS</text>
  </g>
  <rect x="${barX}" y="232" width="${barWidth}" height="12" rx="6" fill="#FFFFFF" fill-opacity="0.07"/>
  <g clip-path="url(#bar)"><g class="grow">${segments}</g></g>
  ${legend}

  <g class="rise" style="animation-delay:560ms">
    <rect x="444" y="180" width="708" height="168" rx="14" fill="#0F172A" fill-opacity="0.92" stroke="#334155"/>
    <text x="${mapX}" y="212" font-size="11.5" font-weight="700" letter-spacing="1.6" fill="#94A3B8">CONTRIBUTIONS · LAST 12 MONTHS</text>
    <g font-size="11" fill="#64748B">
      <text x="${1128 - 5 * 13 - 34}" y="212" text-anchor="end">Less</text>
      <rect x="${1128 - 5 * 13 - 28}" y="203" width="9" height="9" rx="2" fill="#FFFFFF" fill-opacity="0.07"/>
      ${shades.map((color, i) => `<rect x="${1128 - 5 * 13 - 28 + (i + 1) * 13}" y="203" width="9" height="9" rx="2" fill="${color}"/>`).join('')}
      <text x="1128" y="212" text-anchor="end">More</text>
    </g>
    ${monthLabels.join('')}
  </g>
  <g>
    ${columns}
  </g>
  <g clip-path="url(#map)"><rect class="sweep" x="${mapX}" y="${mapY - 2}" width="120" height="${7 * cell + 2}" fill="url(#sweep)" transform="translate(-140 0)"/></g>
</svg>
`;

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, svg);
console.log(`Wrote ${output}: ${total} contributions, streak ${current}, ${languages.length} languages.`);
