# DrawWatch

DrawWatch is a responsive web app that shows lottery draw results and number-frequency charts using sample data.

> All data is made up for practice. DrawWatch is not affiliated with OLG and has no gambling features.

## Status

Learning project, built in phases. Phases 0 to 5 are done (setup, web basics, Figma design, monorepo and data, REST API, component library). Phase 6 has started: the web app now has a Results page with game filter and pagination. The API is live on Render.

## Design

[Figma design file](https://www.figma.com/design/08T77PnS11adVJ3scas88k/DrawWatch). The feasibility review is in `docs/design/feasibility-review.md`.

## Component library

The web app (`apps/web`) has reusable React components built from the Figma design: NumberBall, DrawCard, Button, StatusMessage, and the loading, empty, error and waking-up states. Each one has a Storybook story and tests, and is checked for accessibility (WCAG AA).

- Run Storybook: `npm run storybook --workspace @drawwatch/web` (opens at http://localhost:6006)
- Run all tests: `npm test`

## Web app

The Results page lists draws from the API. The game filter and the page number live in the address (for example `/?gameId=lotto-max&page=2`), so a filtered view can be shared and the Back button works.

Run it on your own computer (two terminals, both started in the project folder):

1. API: `npm run dev --workspace @drawwatch/api` (http://localhost:3000)
2. Web app: `npm run dev --workspace @drawwatch/web` (http://localhost:5173)

Create the file `apps/web/.env.local` with the line `VITE_API_URL=http://localhost:3000` so the web app talks to your own API. Without this file it uses the live Render API.

## Live API

The API runs on Render's free plan: https://drawwatch-api.onrender.com

Try these in a browser:

- Health: https://drawwatch-api.onrender.com/api/v1/health
- Games: https://drawwatch-api.onrender.com/api/v1/games
- Draws: https://drawwatch-api.onrender.com/api/v1/draws?gameId=lotto-649&pageSize=2
- Number frequency: https://drawwatch-api.onrender.com/api/v1/stats/frequency?gameId=lotto-649

The free plan goes to sleep after 15 minutes without visitors. The first request after that can take about one minute while the server wakes up. All data is made up.

## Plan

- React and TypeScript front end
- Node and Express API
- Storybook component library
- Automated tests and checks on every pull request

## Learning notes

See `docs/learning-log.md` and `docs/retros/`.

## License

MIT
