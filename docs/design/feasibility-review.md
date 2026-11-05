# Feasibility review: DrawWatch Figma design

Date: 2026-11-05. I checked the Figma screens and asked: can I build this, and what is hard?

## Finding 1: Colour contrast
The muted text colour (#475569) on the light background (#F8FAFC) is readable, but the small chart numbers (12px) are easy to miss. Fix: use 14px minimum and check contrast with a tool. This matters for WCAG AA.

## Finding 2: The chart uses colour to show hot and cold
Blue and grey bars mean hot and cold. Some people cannot tell colours apart. Fix: add a text label or icon and a "Show as table" option (already in the design).

## Finding 3: Ball numbers need a fixed size
Number balls are 44x44 circles. Two-digit numbers fit, but large text size settings could overflow. Fix: size the ball in rem units and test with browser zoom 200%.

## Finding 4: The free server sleeps
The API on a free host can take up to a minute to wake. The design has a "Waking up the server" state. Fix: show it after about 3 seconds of waiting, and add a retry button.

## Finding 5: Navigation on small screens
The design shows three links in one row. This fits at 393px, but not if more pages are added. Fix: keep three links for now and plan a menu button if the list grows.

## Finding 6: Desktop layout has wide empty space
The desktop screens keep a centred 608px column. This is easy to build, but the chart could use more width. Fix: let the chart card grow to 800px on large screens.