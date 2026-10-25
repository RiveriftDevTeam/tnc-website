# Technical Specification: <product>

## 1. Summary
One paragraph: what this product does and for whom.

## 2. Architecture
Components, how they talk (protocols), where they run. A mermaid diagram is
welcome. Respect the CLAUDE.md resource inventory exactly.

## 3. Data model
Entities, fields, relationships. This feeds docs/contracts/ — be precise.

## 4. API surface
Route | method | request | response | auth. Every route that will exist.

## 5. Screen map
Screen | purpose | key components | data it reads/writes. Names must match the
product spec's screen names.

## 6. Integrations
For each external service: exact API version, endpoints, protocol/handshake
notes, and the reference implementation path under /reference.

## 7. Deployment
Resources (from the inventory only), SKUs, environments, deploy command.

## 8. Out of scope (explicit)
Everything the product spec mentions or implies that we are NOT building now.

## 9. Assumptions made
Numbered list of every ambiguity resolved and the choice taken — the user
reviews these at the human gate.
