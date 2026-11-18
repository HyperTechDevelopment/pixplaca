// PixPlaca logo animation recipe — trusted repository code for the
// animated-readme-logo exporter. Implements docs/assets/pixplaca-logo-motion.md:
// staggered cosine pulse of the three finder cores + opposite-phase px-4 lift.
const CORES = [
  { id: "ftl-core", x: 18, y: 18, phase: 0.0 },
  { id: "ftr-core", x: 43, y: 18, phase: 1 / 3 },
  { id: "fbl-core", x: 18, y: 43, phase: 2 / 3 },
];

function pulse(t, phase) {
  // 1 at t=phase, 0.35 half a loop later, cosine ease, seamless on t in [0,1).
  const d = ((t - phase) % 1 + 1) % 1;
  return 0.675 + 0.325 * Math.cos(d * Math.PI * 2);
}

function px4(t) {
  return 0.95 + 0.05 * Math.cos(t * Math.PI * 2);
}

export default {
  schemaVersion: 1,
  source: "docs/assets/pixplaca-logo.svg",
  staticOutput: "docs/assets/pixplaca-logo-static.png",
  animatedOutput: "docs/assets/pixplaca-logo-animated.gif",
  width: 256,
  height: 256,
  fps: 12,
  frameCount: 24,
  maxFileBytes: 5 * 1024 * 1024,
  gifMaxColors: 64,
  preserveTransparency: true,
  renderFrame({ frameIndex, frameCount, width, height }) {
    const t = frameIndex / frameCount;
    const cores = CORES.map((c) => {
      const o = pulse(t, c.phase).toFixed(3);
      return `    <rect id="${c.id}" x="${c.x}" y="${c.y}" width="3" height="3" fill="#FFFFFF" opacity="${o}"/>`;
    }).join("\n");
    const p4 = px4(t).toFixed(3);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 64 64">\n`
      + `  <g id="tile">\n    <rect id="tile-bg" x="2" y="2" width="60" height="60" rx="14" fill="#12A594"/>\n  </g>\n`
      + `  <g id="finder-top-left">\n    <rect id="ftl-outer" x="11" y="11" width="17" height="17" rx="3.5" fill="#FFFFFF"/>\n    <rect id="ftl-inner" x="15" y="15" width="9" height="9" rx="2" fill="#12A594"/>\n${cores.split("\n")[0]}\n  </g>\n`
      + `  <g id="finder-top-right">\n    <rect id="ftr-outer" x="36" y="11" width="17" height="17" rx="3.5" fill="#FFFFFF"/>\n    <rect id="ftr-inner" x="40" y="15" width="9" height="9" rx="2" fill="#12A594"/>\n${cores.split("\n")[1]}\n  </g>\n`
      + `  <g id="finder-bottom-left">\n    <rect id="fbl-outer" x="11" y="36" width="17" height="17" rx="3.5" fill="#FFFFFF"/>\n    <rect id="fbl-inner" x="15" y="40" width="9" height="9" rx="2" fill="#12A594"/>\n${cores.split("\n")[2]}\n  </g>\n`
      + `  <g id="pixel-field">\n    <rect id="px-1" x="36" y="36" width="7" height="7" rx="1.5" fill="#FFFFFF"/>\n    <rect id="px-2" x="45" y="36" width="8" height="4" rx="1" fill="#FFFFFF" opacity="0.85"/>\n    <rect id="px-3" x="36" y="45" width="4" height="8" rx="1" fill="#FFFFFF" opacity="0.85"/>\n    <rect id="px-4" x="42" y="43" width="11" height="10" rx="2" fill="#FFFFFF" opacity="${p4}"/>\n  </g>\n</svg>`;
  },
};
