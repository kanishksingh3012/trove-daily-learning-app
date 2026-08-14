import nextConfig from "eslint-config-next";

const config = [
  // design/handoff/*.dc.html and their runtime (support.js, image-slot.js)
  // are design-reference prototypes shipped for visual parity, not
  // production code — see design/handoff/README.md.
  { ignores: ["design/handoff/**"] },
  ...nextConfig,
];

export default config;
