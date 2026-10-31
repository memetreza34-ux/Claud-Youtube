// Stickman-Detektiv als Code: jede Pose ist nur ein Datenobjekt.
// Läuft im Browser (window.Stickman) und in Node (require).
(function (root) {
  const C = { line: '#f4f4f4', ink: '#0a0a0a', orange: '#FF5A1F', glow: '#FF7A3D', hat: '#141414' };
  const NECK = [256, 236], HIP = [256, 360], SHOULDER = [256, 272], HEAD = [256, 176], R = 56;

  const POSES = {
    standard: {
      armL: [[212, 306], [240, 334]], armR: [[304, 288], [316, 236]],
      legL: [222, 456], legR: [290, 456],
      eyes: 'normal', brows: 'skeptisch', mouth: 'smirk',
      lupe: { hand: 'R', angle: -62 },
    },
    zeigt: {
      armL: [[212, 306], [240, 334]], armR: [[318, 262], [386, 240]],
      legL: [222, 456], legR: [290, 456],
      eyes: 'normal', look: [4, 0], brows: 'skeptisch', mouth: 'smirk', tilt: 4,
      finger: true,
    },
    schockiert: {
      armL: [[204, 240], [184, 168]], armR: [[308, 240], [328, 168]],
      legL: [214, 456], legR: [298, 456],
      eyes: 'gross', brows: 'hoch', mouth: 'o', hatLift: 34, hatTilt: -8,
    },
    denkt: {
      armL: [[212, 306], [240, 334]], armR: [[318, 266], [272, 222]],
      legL: [222, 456], legR: [290, 456],
      eyes: 'normal', look: [3, -5], brows: 'skeptisch', mouth: 'flach', tilt: -6,
    },
    lacht: {
      armL: [[206, 300], [226, 328]], armR: [[306, 300], [286, 328]],
      legL: [222, 456], legR: [290, 456],
      eyes: 'zu', brows: 'hoch', mouth: 'grinsen', tilt: 8, bodyLean: 3,
    },
    lupenblick: {
      armL: [[212, 306], [240, 334]], armR: [[318, 292], [306, 234]],
      legL: [222, 456], legR: [290, 456],
      eyes: 'normal', brows: 'skeptisch', mouth: 'smirk',
      lupe: { hand: 'R', angle: -120, overEye: true },
    },
  };

  const rad = d => (d * Math.PI) / 180;
  const pts = a => a.map(p => p.join(',')).join(' ');

  function eyesSVG(p, blink) {
    const [lx, ly] = p.look || [0, 0];
    const E = [[236, 182], [276, 182]];
    if (blink || p.eyes === 'zu') {
      return E.map(([x, y]) => `<path d="M${x - 9} ${y + 2} Q${x} ${y - 8} ${x + 9} ${y + 2}" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('');
    }
    if (p.eyes === 'gross') {
      return E.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="15" fill="${C.ink}"/><circle cx="${x + 3}" cy="${y - 5}" r="3.5" fill="#fff"/>`).join('');
    }
    return E.map(([x, y]) => `<ellipse cx="${x + lx}" cy="${y + ly}" rx="7" ry="10" fill="${C.ink}"/>`).join('');
  }

  function browsSVG(p) {
    const s = `stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"`;
    if (p.brows === 'hoch') return `<path d="M224 156 Q236 146 248 154" ${s}/><path d="M264 154 Q276 146 288 156" ${s}/>`;
    return `<path d="M224 162 Q236 154 248 160" ${s}/><path d="M265 168 L288 164" ${s}/>`;
  }

  function mouthSVG(p) {
    const s = `stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"`;
    switch (p.mouth) {
      case 'o': return `<ellipse cx="256" cy="212" rx="8" ry="11" fill="${C.ink}"/>`;
      case 'flach': return `<path d="M246 210 L268 208" ${s}/>`;
      case 'grinsen': return `<path d="M236 202 Q256 230 276 202 Z" fill="${C.ink}"/>`;
      default: return `<path d="M244 210 Q258 214 270 206" ${s}/>`;
    }
  }

  function hatSVG(p) {
    const dy = -(p.hatLift || 0), t = p.hatTilt || 0;
    return `<g transform="translate(0 ${dy}) rotate(${t} 256 140)">
      <g filter="url(#glow)">
        <path d="M172 140 Q256 118 340 140 Q348 150 336 154 Q256 136 176 154 Q164 150 172 140 Z" fill="${C.hat}" stroke="${C.glow}" stroke-width="2"/>
        <path d="M204 140 C202 92 224 70 256 70 C288 70 310 92 308 140 Q256 126 204 140 Z" fill="${C.hat}" stroke="${C.glow}" stroke-width="2"/>
      </g>
      <path d="M205 122 Q256 110 307 122 L308 139 Q256 126 204 139 Z" fill="${C.orange}"/>
      <path d="M238 78 Q256 92 274 78" stroke="#2a2a2a" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>`;
  }

  function lupeSVG(p, hand) {
    if (!p.lupe) return '';
    const a = rad(p.lupe.angle), dx = Math.cos(a), dy = Math.sin(a);
    const h2 = [hand[0] + dx * 28, hand[1] + dy * 28];
    const c = [hand[0] + dx * 60, hand[1] + dy * 60];
    const bigEye = p.lupe.overEye ? `<ellipse cx="${c[0]}" cy="${c[1]}" rx="13" ry="19" fill="${C.ink}"/><circle cx="${c[0] + 4}" cy="${c[1] - 7}" r="4" fill="#fff"/>` : '';
    return `<line x1="${hand[0]}" y1="${hand[1]}" x2="${h2[0]}" y2="${h2[1]}" stroke="#8a5a32" stroke-width="10" stroke-linecap="round"/>
      ${p.lupe.overEye ? `<circle cx="${c[0]}" cy="${c[1]}" r="30" fill="#f4f4f4"/>` : ''}${bigEye}
      <circle cx="${c[0]}" cy="${c[1]}" r="32" fill="#cfe8ff" fill-opacity="0.35" stroke="#d9d9d9" stroke-width="8"/>
      <path d="M${c[0] - 16} ${c[1] - 10} Q${c[0] - 10} ${c[1] - 22} ${c[0] + 4} ${c[1] - 24}" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  }

  // opts: { blink, bob (px), background (bool) }
  function svg(poseOrName, opts = {}) {
    const p = typeof poseOrName === 'string' ? POSES[poseOrName] : poseOrName;
    const bob = opts.bob || 0, bg = opts.background !== false;
    const handR = p.armR[1];
    const stroke = `stroke="${C.line}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
    const finger = p.finger ? `<line x1="${handR[0]}" y1="${handR[1]}" x2="${handR[0] + 18}" y2="${handR[1] - 6}" ${stroke}/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="spot" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="#2a1a10"/><stop offset="100%" stop-color="#050505"/></radialGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  ${bg ? '<rect width="512" height="512" fill="url(#spot)"/>' : ''}
  <g transform="translate(0 ${bob})">
    <g transform="rotate(${p.bodyLean || 0} 256 360)">
      <g ${stroke}>
        <line x1="${NECK[0]}" y1="${NECK[1]}" x2="${HIP[0]}" y2="${HIP[1]}"/>
        <polyline points="${pts([SHOULDER, ...p.armL])}"/>
        <polyline points="${pts([SHOULDER, ...p.armR])}"/>
      </g>
      ${finger}
      <path d="M232 232 Q256 246 280 232 L282 246 Q256 260 230 246 Z" fill="${C.orange}"/>
      <path d="M270 246 L284 290 L272 292 L262 252 Z" fill="${C.orange}"/>
      <g transform="rotate(${p.tilt || 0} ${NECK[0]} ${NECK[1]})">
        <circle cx="${HEAD[0]}" cy="${HEAD[1]}" r="${R}" fill="${C.line}"/>
        ${eyesSVG(p, opts.blink)}${browsSVG(p)}${mouthSVG(p)}
        ${hatSVG(p)}
      </g>
      ${lupeSVG(p, handR)}
    </g>
  </g>
  <g ${stroke}>
    <line x1="${HIP[0]}" y1="${HIP[1] + bob}" x2="${p.legL[0]}" y2="${p.legL[1]}"/>
    <line x1="${HIP[0]}" y1="${HIP[1] + bob}" x2="${p.legR[0]}" y2="${p.legR[1]}"/>
  </g>
</svg>`;
  }

  const api = { svg, POSES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Stickman = api;
})(typeof window !== 'undefined' ? window : globalThis);
