# F-XX: <feature name>

**Difficulty:** EASY | HARD          <!-- HARD = frontier model + plan approval -->
**Effort:** low | medium | high      <!-- thinking budget; set on the spawned agent -->
**Tag justification:** <one line: which HARD criterion applies, or "none -> EASY">
**Reference (HARD integrations):** /reference/<integration>/ | n/a
**Depends on:** F-00 (contracts/scaffold), F-__
**Agent:** feature-builder | integration-specialist

## Context (why this exists — 3–5 sentences)
<What the user does with this feature, where it sits in the product. Enough for
an agent with zero conversation history. Reference screens from docs/spec.md by
name.>

## Contracts used (frozen — read before coding)
- docs/contracts/<types file>
- docs/contracts/<api schema>

## File ownership (EXCLUSIVE — no other feature may touch these)
- src/features/<name>/**
- src/pages/<page>.tsx
<!-- If another feature needs one of these files, message the lead. -->

## Tasks
1. <concrete step>
2. <concrete step>
3. Update the code graph.

## Acceptance (definition of done)
<!-- At least ONE criterion must be a user-observable OUTCOME traceable to
     the REQ's North-star scenario (e.g. "playback is continuous at driver
     height"), not just a command exiting 0. -->
North-star trace: <REQ-NNN scenario this serves>
```
<single runnable command, e.g. npm test -- --grep "F-XX" >
```
UI features additionally: dev server renders <screen>, browser console clean.

## Do NOT
- Do not modify contracts.
- Do not add dependencies.
- <feature-specific traps, e.g. "do not open a second WebSocket for avatar
  config — it goes over the existing control channel">
