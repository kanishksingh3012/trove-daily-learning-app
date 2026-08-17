import nextConfig from "eslint-config-next";

const config = [
  // *.dc.html design-reference prototypes and their runtime (support.js,
  // image-slot.js) are shipped for visual parity, not production code —
  // see design/handoff/README.md and design_handoff_daily_learning_app/README.md.
  { ignores: ["design/handoff/**", "design_handoff_daily_learning_app/**"] },
  ...nextConfig,
];

export default config;
