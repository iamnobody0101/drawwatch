# DrawWatch

DrawWatch is a responsive web app that shows lottery draw results and number-frequency charts using sample data.

> All data is made up for practice. DrawWatch is not affiliated with OLG and has no gambling features.

## Status

Learning project, built in phases. Phases 0 to 4 are done (setup, web basics, Figma design, monorepo and data, REST API). The API is live on Render.

## Design

[Figma design file](https://www.figma.com/design/08T77PnS11adVJ3scas88k/DrawWatch). The feasibility review is in `docs/design/feasibility-review.md`.

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
