# PixPlaca logo — motion specification

Canonical SVG: `docs/assets/pixplaca-logo.svg` (static first-frame state, transparent background).
Canvas: `viewBox 0 0 64 64`, displayed at 160×160 in the README, exported at 256×256.
Duration: 2.0 s loop, 24 frames at 12 fps, seamless return to first frame.
Reduced motion: the static first frame (all opacities as authored in the SVG).
Transparency: preserved; no background geometry is added by any frame.

Named layers: `tile`, `finder-top-left`, `finder-top-right`, `finder-bottom-left`, `pixel-field`.
Animated properties only: opacity of the three finder cores
(`ftl-core`, `ftr-core`, `fbl-core`: 1 → 0.35 → 1 stagger, cosine ease)
and of `px-4` (0.9 → 1 → 0.9, cosine ease, opposite phase to the cores).
`px-2` / `px-3` hold their authored 0.85 throughout.

Keyframes (t = loop fraction):
- t=0.00: cores 1.0, px-4 0.90 (== SVG first frame)
- t=0.25: ftl-core 0.35, others easing down; px-4 1.0
- t=0.50: ftr-core 0.35; px-4 0.95
- t=0.75: fbl-core 0.35; px-4 0.90
- t=1.00: identical to t=0.00 (clean loop)

Nothing translates, scales, or rotates: the mark keeps its identity at every frame.
Exports: `pixplaca-logo-static.png` (frame 0) and `pixplaca-logo-animated.gif`.
