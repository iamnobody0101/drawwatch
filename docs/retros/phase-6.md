# Phase 6 retro (web pages and deploy)

- Went well: I typed every file myself. The web app now has Results, Draw detail, About and Not Found pages, a menu, and a Back link that keeps the filters. It is live on Vercel at https://drawwatch.vercel.app. 115 tests pass, including page tests with a fake API (MSW).
- Was hard: many new ideas at once (routing, server data, URL state, router state, deploy settings) and small typing mistakes that no tool catches, such as CSS property typos, a file saved in the wrong folder, and tests typed outside their `describe` block. The first Vercel build failed because the install ran only inside `apps/web`.
- Change next time: open the file with `code <path>` before typing, read each CSS property slowly, check the closing `});` of a test block, and read the build log from the top when a deploy fails.
- Fixed: a page number that is too high (`?page=999`) now shows a clear message (PR #28).
- Decision: the API allows only the live site and `http://localhost:5173` to read it from a browser (CORS allow-list). It started as `*` (any website); this is now stricter. Vercel preview addresses cannot load data, which is fine for this project.
- Can wait: `.tsx` extensions in the `states/*` imports, clearer text for server errors, `parsePage` accepts `1e2`, the cold-start retry is untested on the live site, and the date-range filter from issue #25 is not built.
