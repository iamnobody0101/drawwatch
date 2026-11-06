# Phase 4 retro

- Went well: I typed the whole API myself. All four routes worked in the browser and 37 tests pass.
- Was hard: small mix-ups when typing (an extra import that VS Code added, a capital `Number`, missing `});`). Lint and TypeScript pointed to each one.
- Change next time: after typing, run Prettier, typecheck and lint right away, and check that every `{` has its partner `}`.

## Deploy to Render

- Went well: the first deploy worked. The build log showed Node 26.13.0, the port, and "Your service is live".
- Was hard: many new words (workspace, health check, environment variable) and a long settings form.
- Change next time: write down every setting I choose, and why, before I click Deploy.
