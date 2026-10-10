# 18 — Character portrait / brand asset delivery protocol

## Clear ownership / timing
The owner explicitly expects **original AI-generated** portraits for ATLAS, VEX and SEAL. The attached engineering ZIP includes *briefs and asset contracts, not finished character images*. Do not depict random stock photos or unrelated emojis as if approved. **Do not stall functional development waiting for art:** build responsive image slots and attractive original SVG silhouette fallbacks. The owner may provide three approved portraits later; integrating them should require only replacing assets and optional crop metadata.

## Concept and reference
Primary reference is Nerom's Crossfire agent-stage choreography in `components/DebateArena.tsx` and `components/WarRoom.tsx` (links in `10_SOURCE_REFERENCES_AND_RIGHTS.md`). Aim for comparable *prominence, staging, silhouette readability, illumination and speaker motion*, not identical faces/illustrations or Crossfire art exports. The Crossfire repository lacks an identified root licence; source/art must not be copied as production assets.

## Deliverable images when art is commissioned/generated
- ATLAS: `public/agents/atlas.webp` in 4:5, minimum 1200 px tall; plus `atlas-avatar.webp` square.
- VEX: `public/agents/vex.webp` and `vex-avatar.webp`.
- SEAL: `public/agents/seal.webp` and `seal-avatar.webp`.
- Optional high-res neutral `public/brand/veyrin-aperture.svg` original brand mark; source SVG for favicon `public/icon.svg`.
- Optimization and consistency: 3 characters same visual world, centerlines/eye heights/crop scale, coherent surfaces, two original accent cues, reduced backgrounds and good contrast against near-black UI; 2x variants only when necessary.
- Screenshots at 390px mobile and 1440px desktop showing all three roles; portraits must **not** obscure the transcript/evidence rail.

## Character direction / prompt seed
ATLAS = precise observational analyst, pale cool instrument rim, clean angular jacket and optical detail, reflective but human-readable face. VEX = incisive adversarial examiner, restrained copper/coral edge cut, contrasting sharp silhouette, skeptical not villainous. SEAL = impartial archivist/auditor, matte metal amber-edged faceted mask or figure, emblematic of source checking rather than omniscience.

Shared rendering prompt: `Original near-future financial investigation chamber character key art, one distinct [ROLE] analyst with [role attributes], cinematic but restrained materials and light, 4:5 bust portrait, strong small-size silhouette, studio coherent with all three characters, deep neutral background easy to remove, no stock logo, no text, no watermark, no copied existing game/film character, original independent artwork.` Create a one-page style sheet before final portrait batch; use consistent prompt references/crops across all three. **The owner decides/approves final art when images are available**; implement UI to work even if that happens after the hackathon.

## Visual states
`MISSING`: custom vector silhouette, role name/status and accessible label, no broken `<img>`. `PENDING_ART`: same with an asset-pending marker in design ledger only, not customer UI. `READY`: real local verified file + alt text. `FAILED`: load error falls back to branded vector, never blank square.

## Where to hand off image creation
- If installed harness actually exposes image-gen: request/execute the three-role art brief within authorized phase, inspect images and log provenance, not three random uncoordinated prompts.
- If not exposed: leave `ART_ASSET_REQUEST.md` containing the exact role prompts and expected filenames. The owner can generate images and drop them into `public/agents/` later. **Never claim they were generated** merely because brief exists.
- Record generator/provider, prompt, generation time, usage rights, crop/export changes and final files in `docs/DESIGN_LEDGER.md`.

## Why no fancy asset pipeline on Day 1
The irreplaceable proof is the evidence lock/reveal. Art can enhance judges' first impression, but cannot substitute for the verified research run. Do not block source retrieval/model probe on character assets.
