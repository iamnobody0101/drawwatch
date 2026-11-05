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
