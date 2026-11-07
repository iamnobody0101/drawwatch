# Phase 6 retro (Results page)

- Went well: I typed every file myself. The Results page now loads real draws, filters by game, paginates, and keeps the filters in the URL. 81 tests pass, including page tests with a fake API (MSW).
- Was hard: many new ideas at once (routing, server data, URL state, fake timers) and small typing mistakes that no tool catches, such as CSS property typos and a file saved in the wrong folder.
- Change next time: open the file with `code <path>` before typing, read each CSS property slowly, and keep the API and web servers in two windows that both start with `cd C:\dev\drawwatch`.
- Open question: a page number that is too high (`?page=999`) shows "No draws found". A clearer message or a jump to the last page would be better.
- Decision: the API allows any website to read it with GET (CORS `*`), because the data is public, read-only and has no logins.
