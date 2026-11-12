# DrawWatch

DrawWatch is a responsive web app that shows lottery draw results and number-frequency charts from a REST API, using made-up sample data.

> All data is made up for practice. DrawWatch is not affiliated with OLG and has no gambling features.

## Status and roadmap

Learning project, built in phases. Phases 0 to 7 are done (setup, web basics, Figma design, monorepo and data, REST API, component library, web pages and deploy, accessible charts and the Stats page). The web app is live on Vercel and the API is live on Render.

Not built yet:

- Phase 8: Playwright end-to-end tests in several browsers and automatic accessibility checks on the pages
- Phase 9: polish

- Live web app: https://drawwatch.vercel.app
- Live API: https://drawwatch-api.onrender.com

## Design

[Figma design file](https://www.figma.com/design/08T77PnS11adVJ3scas88k/DrawWatch). The feasibility review is in `docs/design/feasibility-review.md`.

## Component library

The web app (`apps/web`) has reusable React components built from the Figma design: NumberBall, DrawCard, Button, StatusMessage, GameSelect, Pagination, BarChart, and the loading, empty, error and waking-up states. Each one has a Storybook story and tests, and is checked for accessibility (WCAG AA).

- Run Storybook: `npm run storybook --workspace @drawwatch/web` (opens at http://localhost:6006)
- Run all tests: `npm test`

## Web app

The web app has these pages, all reachable from the menu or by links:

- Results (`/`): lists draws from the API. The game filter and the page number live in the address (for example `/?gameId=lotto-max&page=2`), so a filtered view can be shared and the Back button works.
- Draw detail (`/draws/:id`): one draw with its numbers. Its "Back to results" link returns to the same filter and page.
- Stats (`/stats`): how often each number was drawn, for one game and an optional date range (From and To). The game and dates live in the address (for example `/stats?gameId=lotto-max&from=2026-01-01`). It shows a bar chart, the hot (most drawn) and cold (least drawn) numbers, and the note "Draws are independent. Past frequency does not predict future draws."
- About (`/about`): what DrawWatch is, where the data comes from, and the disclaimer (made-up data, not affiliated with OLG).
- Not Found (any other address): a friendly page with a link back to the results.

The web app is deployed on Vercel (free plan) from the `apps/web` folder. `apps/web/vercel.json` sends every address to `index.html`, so links like `/about` also work when the page is opened or reloaded directly. The API only allows browsers to read it from the live site and from `http://localhost:5173` (CORS allow-list in `apps/api/src/app.ts`).

Run it on your own computer (two terminals, both started in the project folder):

1. API: `npm run dev --workspace @drawwatch/api` (http://localhost:3000)
2. Web app: `npm run dev --workspace @drawwatch/web` (http://localhost:5173)

Create the file `apps/web/.env.local` with the line `VITE_API_URL=http://localhost:3000` so the web app talks to your own API. Without this file it uses the live Render API.

## Charts and accessibility

The bar chart is plain SVG drawn by React, with no chart library. It is built to work for everyone:

- One horizontal bar per number. The scale starts at 0, so bar lengths can be compared fairly.
- Colour is never the only signal: hot bars are blue and say "Hot", cold bars are striped with a frame and say "Cold", and a legend explains both in words.
- The chart is one Tab stop. The arrow keys, Home and End move between bars, and each bar has a name a screen reader can read (for example "Number 3, Times drawn: 73, Hot"). A tooltip shows on hover and on focus, and Esc hides it.
- A short summary sentence and a "Show as table" button give the same numbers as text.
- Text is at least 14px. Bars and text pass WCAG AA contrast. The chart measures its own width, so it fits a 320px phone.

## Live API

The API runs on Render's free plan: https://drawwatch-api.onrender.com

Try these in a browser:

- Health: https://drawwatch-api.onrender.com/api/v1/health
- Games: https://drawwatch-api.onrender.com/api/v1/games
- Draws: https://drawwatch-api.onrender.com/api/v1/draws?gameId=lotto-649&pageSize=2
- Number frequency: https://drawwatch-api.onrender.com/api/v1/stats/frequency?gameId=lotto-649

The free plan goes to sleep after 15 minutes without visitors. The first request after that can take about one minute while the server wakes up. All data is made up.

## Run it yourself

You need Node 26 (the file `.node-version` says which one) and Git.

```
git clone https://github.com/iamnobody0101/drawwatch.git
cd drawwatch
npm ci
```

Checks (the same ones the CI runs on every pull request):

```
npm run format:check
npm run lint
npm run typecheck --workspaces --if-present
npm test
```

The project is a monorepo (one repository, several packages): `apps/api` (Express API), `apps/web` (React app) and `packages/shared` (types, Zod rules and helpers used by both).

## Learning notes

See `docs/learning-log.md` and `docs/retros/`.

## License

MIT
