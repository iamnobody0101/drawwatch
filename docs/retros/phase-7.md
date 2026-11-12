# Phase 7 retro (charts and Stats page)

- Went well: I typed a bar chart in plain SVG with no chart library, and a Stats page at `/stats` with a game filter, From and To dates, hot and cold lists, and a table view. Small pull requests (#44, #46, #48, #50) were easy to review. 190 tests pass, axe finds 0 violations, and the page works at 320px, at 200% zoom and with the keyboard only.
- Was hard: the chart has many parts that must agree (scale, keyboard, tooltip, table, legend), and jsdom tests cannot see layout. A real browser found a bug the tests missed: the third menu link made the header too wide at 320px. NVDA (a screen reader) was not tried, so the accessible names are checked by tests only.
- Change next time: check every new page at 320px in a real browser before the pull request, and let Prettier fix long lines. Can wait: the summary names only one number when several tie, a half-typed date can clear the date box, and the chart card could be wider on desktop.
