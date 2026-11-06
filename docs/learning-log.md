# Learning log

## Phase 0: Setup

- Git saves the history of my project. I can go back to any earlier version.
- A commit is a saved snapshot with a short message about what changed.
- A branch is a safe copy where I work on one small task. I do not edit main directly.
- A pull request asks to add my branch to main. Others can review it first.
- Node.js runs JavaScript on my computer. fnm installs and switches Node versions.
- A team uses the same Node version, so we pin it (I used fnm install 26, an LTS version).
- Commit messages use a label like docs: or feat: so the history is easy to read.
- Squash and merge turns all commits of a pull request into one clean commit on main.
- A label is a small tag on an issue, like bug or docs, so work is easy to sort.
- A milestone groups issues that belong to one goal. I made one per phase.
- A project board shows tasks in columns, like Todo, In Progress and Done.
- Branch protection stops direct changes to main. Every change needs a pull request.

## Phase 1: Web fundamentals

- HTML says what things are. CSS says how they look. JavaScript says what they do.
- Semantic tags like header, main and footer help screen readers move around the page.
- CSS variables keep colours in one place, so one change updates everything.
- Mobile-first means I write the phone layout first, then use a media query for wide screens.
- JavaScript is case-sensitive. A small typo like getElementbyId breaks the code.
- When something breaks, I open the Console (F12), read the error and check the line number.
- Names must match exactly (draw is not draws). Careful names prevent many bugs.
- fetch asks a server for data. await waits for the answer, so the function must be async.
- try and catch let me show a friendly message when loading fails.
- A 404 means Not Found. I broke the data file on purpose and the page still showed a clear message.
- Browsers block fetch from files on my disk, so I use a local server (npx serve).
- A wrong property name like innterHTML gives no error, so I must read my code slowly.

## Phase 2: Design

- Figma variables are design tokens. They match CSS custom properties, so design and code use the same colours.
- A component is made once and reused as instances. Change the master and every copy updates.
- Auto layout in Figma works like flexbox in CSS.
- Design the loading, empty, error and waking-up states, not only the happy screen.
- A feasibility review finds problems in a design before anyone writes code.
- Colour must not be the only way to show meaning (hot and cold bars need labels or a table).
- The free server sleeps, so the app needs a "waking up" message.

## Phase 3: Monorepo, data and first CI

- A monorepo keeps many packages in one repo. npm workspaces link them, so `apps/web` can use `packages/shared`.
- TypeScript checks types before the code runs. `strict` mode catches the most mistakes.
- A seeded random generator gives the same numbers for the same seed, so the sample data and the tests are repeatable.
- A unit test gives a function a small input with a known answer and checks the result. Coverage shows which lines the tests ran.
- ESLint finds likely bugs. Prettier formats code in one style. EditorConfig sets the basics for every editor.
- CI is a robot (GitHub Actions) that runs format, lint, typecheck and tests on every pull request. `npm ci` installs exactly what the lock file says.
- I stayed on ESLint 9 and TypeScript 6 on purpose, because the accessibility plugin does not support the newer versions yet.

## Phase 4: REST API

- A REST API answers web requests. A route is "when someone asks for this address, run this code". We keep all routes under `/api/v1` so a future `v2` will not break old users.
- Express is a library for Node that receives requests and sends responses. `createApp()` builds the app without starting it, so tests can use it.
- Zod checks data at runtime and gives the TypeScript type from the same rule. Query values come as text, so `z.coerce.number()` turns `"2"` into `2`. `safeParse` does not crash on bad data.
- A repository class is the one place that knows where data is stored. Today it is a JSON file in memory. Later it could be a database, and the routes would not change.
- Pagination: `start = (page - 1) * pageSize`, then `slice(start, start + pageSize)`. `total` lets the web app show "page 2 of 8".
- Status codes: 200 is ok, 400 means the caller made a mistake, 404 means not found. Errors use the standard RFC 9457 format (`application/problem+json`).
- Dependency injection: `createApp(repository)` receives its data from outside, so tests can give it fake data.
- A route test starts the app on port 0 (any free port), calls it with `fetch`, and checks the answer. `async` and `await` let the test wait for the response.
- A test that passes for the wrong reason is dangerous. A typo (`number` instead of `numbers`) made one test pass without proving anything.
- Prettier warnings on new files were line endings (CRLF vs LF). `npx prettier --write` fixes them.

## Phase 4 (extra): Deploy to Render

- To deploy means to put the app on a server on the internet. Render runs it for free, but the free server sleeps after 15 minutes without visitors. The first request after sleep takes about one minute (a cold start), so the web app needs a "waking up" message.
- Render builds from GitHub. The build command is `npm ci` (install exactly what the lock file says). The start command is `npm run start --workspace @drawwatch/api` (`--workspace` runs a script inside one package of the monorepo).
- The Root Directory stays empty. The API needs `packages/shared`, and Render hides folders outside the root directory.
- Render chooses the port and gives it to the app in the `PORT` environment variable. An environment variable is a named setting that lives outside the code. `server.ts` reads `process.env.PORT`, so no code change was needed.
- `NODE_VERSION=26.13.0` makes Render use the same Node as my computers.
- A health check is a request Render sends again and again to ask "are you alive?". Ours is `/api/v1/health`.
- Auto-Deploy "After CI Checks Pass" waits for the GitHub `check` job. A broken commit does not go live.
- I tested the live URL in the browser: health, games, draws, frequency and a 400 error all worked.
