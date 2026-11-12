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

## Phase 5: Component library

- A component is a small, reusable piece of the screen, written as a function that returns HTML-like code (JSX). Props are the inputs of a component, like `value` for NumberBall.
- Vite builds and serves the React app. `apps/web` is a new package in the monorepo, next to `apps/api` and `packages/shared`.
- Storybook shows each component alone, in every state (a "story"). It is a catalogue of the design, and it can check accessibility with the a11y add-on.
- Design tokens are named values (colors, spacing, radius) taken from Figma and saved as CSS variables in `tokens.css`. Changing one token changes the whole app.
- CSS Modules keep each component's CSS private, so class names never clash.
- Accessibility (a11y) means everyone can use the app. I used real HTML elements (`article`, `h2`, `time`, `ul`, `button`), enough color contrast (WCAG AA), a visible focus ring for keyboard users, and `rem` units so text can grow.
- `role="status"` (polite) and `role="alert"` (urgent) tell screen readers about changing messages.
- React Testing Library tests a component the way a person uses it: find by role or text, click, press keys. `jsdom` is a fake browser inside Node, and `cleanup` removes each test's output.
- `jsx-a11y` is an ESLint plugin. It rejected a clickable `div` because the keyboard cannot reach it. `react-hooks` checks the rules of React hooks.
- Some colors looked purple in my browser because of a color extension. A private window showed the real blue.

## Phase 6: Results page

- A single-page app (SPA) loads one page and changes what is on screen with JavaScript. React Router changes the address without reloading the browser. A route says "for this address, show this page". A layout route draws the frame (header, footer) and an `<Outlet />` shows the current page inside it.
- TanStack Query fetches and remembers server data. `useQuery` gives `data`, `isPending` and `isError`. A `queryKey` is the name of the data in the cache; when the key changes (a new filter), Query fetches again. `keepPreviousData` keeps the old list on screen while the next page loads. Retries wait longer each time (exponential backoff).
- The API client is the one place that knows how to call the API. `fetch` does not throw for a 404 or 500, so the client checks `response.ok` and throws its own `ApiError`.
- CORS is a browser rule: a page may not read answers from another website unless that server says "allowed". At first the API sent `Access-Control-Allow-Origin: *` (any website) for GET requests. In Phase 6 part 2 this was tightened to an allow-list (see below).
- `.env.local` holds settings for my own computer. Names that start with `VITE_` reach the browser code. Files ending in `.local` are ignored by Git.
- Filters live in the URL (`?gameId=lotto-max&page=2`), read with `useSearchParams`. A shared link opens the same view and the Back button works. The text in the address can be anything, so a parser turns it into a safe value (a real game id, or page 1). `Object.hasOwn` is safer than `in`, because `in` finds hidden names like `toString`.
- The cold-start message: the app asks `/health` when it loads, and `useAfterDelay` shows "Waking up the server" only if there is no answer after 3 seconds. A fast server shows nothing.
- Accessibility: a skip link lets keyboard users jump to the main content. Landmarks (`header`, `nav`, `main`, `footer`) let screen readers jump around. A visible `label` is connected to its dropdown with `htmlFor` and `id`. `aria-current="page"` marks the current link, and it is also underlined so colour is not the only signal. `aria-live="polite"` announces "Page 2 of 79".
- MSW (Mock Service Worker) answers `fetch` calls inside tests with fake data, so the real client, hooks and page are tested together without the internet. In MSW 3 the option is `onUnhandledFrame: "error"`.
- Testing Library finds things like a person would (by role and name). `findBy` waits, `getBy` must find it now, `queryBy` allows "not there". `server.use` changes the fake answer for one test (empty list, a 500 error).
- Fake timers (`vi.useFakeTimers`) let a test move the clock by hand, so the 3-second rule is tested in a few milliseconds.
- Prettier, TypeScript and ESLint do not check spelling inside CSS. A typo like `border-raidus` is silently ignored by the browser. I must compare my files with care and watch for yellow underlines in `.css` files.

## Phase 6 (part 2): Draw detail, About, Not Found and Vercel

- A new API route needs a test first. `GET /api/v1/draws/:id` was missing, so I added `findDraw` to the repository, then the route. A missing draw answers 404 in the same problem+json format as other errors.
- `useParams` reads the `:id` part of the address. A `*` route catches every address that no other route matches, so it shows the Not Found page.
- Router state: a link can carry hidden data (`state`). The Results card sends the current filter address as `backTo`, and the detail page's "Back to results" link uses it, so the filters are kept. The state can be anything, so `parseBackTo` accepts only a text that starts with `/` and not `//`; otherwise it goes to `/`.
- `useDraw` does not retry a 404, because asking again cannot make a missing draw appear. Other errors retry up to 3 times.
- A link's `aria-label` should start with its visible text, so voice-control users can say what they see. Each page has one `h1`.
- Tests with `MemoryRouter` open a page at a chosen address without a browser. `it.each` runs one test for every item of a list.
- Vercel hosts the web app. Settings: Root Directory `apps/web`, preset Vite, Build Command `npm run build`, and Install Command `cd ../.. && npm ci`. The install command must run at the repository root, otherwise root tools such as vitest are missing and the build fails (`Cannot find module 'vitest'`). The environment variable `VITE_API_URL` points to the Render API. It is read when the app is built, so a change needs a new deploy.
- A single-page app has only one real file, `index.html`. Without help, opening `/about` directly gives the host's own 404. `vercel.json` has a rewrite that sends every address to `index.html`, and React Router then shows the right page.
- Deployment Protection (Vercel Authentication) asks visitors to log in. I turned it off, so the site is public.
- Every pull request gets a Vercel preview address. Previews cannot load data, because their address is not in the API's CORS allow-list.
- CORS allow-list: the `cors` package gets an array of allowed origins. It repeats back the caller's origin only if it is in the list, and adds `Vary: Origin`. Other websites get no header, so their browsers block the answer. CORS is enforced by browsers only; `curl` can still read the API, which is fine for public data.
- Order of work that avoided a broken site: deploy the web app first, then restrict CORS, and check the live site after both.

## Phase 7: Charts and Stats page

- SVG draws shapes with code: `rect` for bars, `line` for grid lines, `text` for labels, `g` to group them. React can draw SVG like any other element, so a chart library is not needed for simple bars.
- A scale turns a number into a length in pixels. The axis must start at 0, or short bars look much smaller than they are. `niceMax` rounds the top of the axis up to 1, 2 or 5 times a power of 10, so the axis numbers are easy to read.
- `ResizeObserver` tells the code when an element changes size. A React 19 callback ref can return a cleanup function, so the observer stops when the chart leaves the page.
- Roving tabindex: only one bar has `tabIndex={0}`, the rest have `-1`. The chart is one Tab stop, and the arrow keys move focus inside it. Each bar has `role="img"` and an `aria-label`, so a screen reader reads "Number 3, Times drawn: 73, Hot".
- Colour must never be the only signal. Hot bars are blue and say "Hot", cold bars are striped and say "Cold", and the legend uses words. The table view shows the same numbers as text, and a test checks that the table and the chart agree.
- axe marks text inside `role="img"` as "inconclusive" for contrast, because it cannot measure it. I checked those colours by calculation instead (for example 7.6:1 and 17.9:1 on white).
- Native date inputs (`type="date"`) give a calendar for free. Their value is text like `2026-01-31`, which sorts like a date, so `from > to` works. `parseDate` checks that the date in the address is real (`2026-02-30` is not).
- `useQuery` has an `enabled` switch. When From is after To, the page shows a message and does not ask the server. React hooks must always be called, so a switch is the right tool, not an `if` around the hook.
- The API returns hot and cold lists even for 0 draws, so the page checks `totalDraws === 0` for the empty message.
- `fireEvent.change` sets a date box directly in a test, and `within(...)` searches inside one part of the page.
- Tests cannot see layout. A real browser at 320px showed that the menu was too wide; `flex-wrap: wrap` lets it move to a second line.
- Draws are independent. The page says so, and it uses no betting, odds or luck words.
