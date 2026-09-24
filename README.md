# The Pintland Isles — Dynamics Simulator

A single-file, no-build web toy that models the Pintland Isles as a web of factions,
regions, faiths and lineages joined by explicit cause-and-effect links. Drag a group's
political, economic, cultural, religious or lineage slider and every other group
responds. Each effect comes with an in-world explanation that names the canon event it
is based on.

Open `index.html` in a browser, or host it on GitHub Pages (below). There is no server
and no install. State saves in your browser's localStorage. Use **World Data → Export**
to keep a copy anywhere else.

## What's in it

One screen: **the Web** (a map of every group, lever and hazard) and a **forecast panel** beside it. Everything else sits in the **⋯** menu, and **?** shows or hides the explanations.

- **Status strip** above the map: the state of the Isles, the likeliest crisis, and the biggest risers and fallers over the horizon.
- **The map.** Node size is current power, and fill tint is where it's heading (green up, red down). Links show faintly, stronger ones darker. Hover a node for its links and a preview chart of its likely path; click it for its sliders and every link. A node's name shows when it's relevant. Drag the **season slider**, or press ▶, to watch the forecast play out on the map.
- **Forecast panel** (40 simulated futures over 3–12 seasons):
  - **Your change**: one bar chart of everything your last change moves by the horizon, with the effect today as a dark inner bar. ✦ marks hidden links (no direct connection). Click a bar for its route, drawn as linked pills.
  - **Crisis odds**: eight dials, where the arc is the chance of breaking and the tick is the chance before your change. Click a dial for what the break would do and which crises it sets off next.
  - **What if…**: add canon open-thread events to the forecast.
  - **Heading, left alone**: the biggest expected moves.
- **Why?** Every in-world explanation, precedent and lore note sits behind a *why?* marker. Sizes are shown as pips (▲▮▮); exact numbers are on hover.
- **⋯ menu**: Projection (long runs, narration, branching), Chronicle (canon record, open threads, your change log), World Data (JSON editor, import and export).

**Turn unit:** one turn is one season of the Pintland Calendar: **Stormtide**,
**Goldsun** and **Veilfrost**, three per year. The simulation starts at Cycle 94,
Year 466. Seasons matter:
- The Drunken Trials' tourist boost happens in Stormtide.
- Providence's Day of Hollow Tongues calms MAMA radicalization in Goldsun.
- Veilwalker activity and the Cloister hazard rise during Veilfrost.
- The Hoppy Holidays at Sackbeard's close each year.

## How the engine works

- **Pulse links** respond to changes. When a source stat moves by *d*, the target moves by:
  - *support*: *d*·k
  - *oppose*: −*d*·k
  - *dependent*: *d*·k on falls, 35% of that on rises
  - *latent*: *d*·k (or −*d*·k), and only while the source is past a threshold

  Effects ripple up to 4 links deep without loops. A link with `lagTurns > 0` queues its
  effect for a later season, and the UI lists everything pending.
- **Pressure links** act every season in proportion to how far the source sits from a
  pivot value. Examples: debt service draining the treasury, and the unblessed Cumstead
  drifting down.
- **Inertia**: each value drifts about 3% per season toward its anchor. The anchor is
  the canon value, or whatever you last set it to with a slider.
- **Hazards**: meter = logistic(base + Σ w·(value−50)/10 + built-up grievance + season
  modifier). Past the threshold, a hazard rolls each season to fire its event. Firing
  applies the event's effects (which ripple like anything else) and releases the
  built-up grievance.
- The dice are seeded, so projections are reproducible. Noise, hazard rolls and
  narration use separate random streams, which is what keeps the control-run comparison
  fair.

## Where the content comes from

The seed world (`world-seed.json`, also embedded in `index.html`) was written from:
- **THE PINTLAND ISLES — MASTER LORE COMPENDIUM**: geography, factions, characters,
  the Rotted Soul, the Stewards of Aleforge, the calendar, holidays and open mysteries.
- **HOEGAARDEN HALL OF RECORDS**: concept records, BBL's findings and the mayoral
  election speeches.
- **A Macroeconomic Analysis of the Pintland Isles**: the Player Economy vs. the Concept
  Economy, Duckets, M2 and velocity, taxes and treasuries, banks and insurance,
  mercantilist levers and performance rewards.

Every relationship carries an `explanation` and a `precedent`, plus a `canon` flag:
- `canon`: stated in the lore
- `extrapolated`: argued from the setting's internal logic
- `rumour`: e.g. the ClockHeart Tonic soul-binding
- `open-thread`: e.g. the Fayte Druids; deliberately speculative

The seed's 31 groups (including 6 policy levers), 196 relationships, 8 hazards,
15 canon events and 20 injectable events are all editable in the app.

When the canon seed's `meta.version` goes up, a browser holding an older saved world
shows a notice offering to load the new world and keep the current values.

## Editing the canonical seed (optional)

You don't need this to use or extend the app, since the World Data tab edits everything
in the browser. To change the version that ships in the repo:

```sh
# edit tools/seed.mjs, then:
node tools/build.mjs   # validates, writes world-seed.json, inlines it into index.html
```

`index.html` stays fully self-contained. The build step only refreshes the JSON embedded
in it.

## Hosting on GitHub Pages

1. On GitHub, open the repository → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose the branch that holds `index.html` and the **/ (root)** folder, then **Save**.
4. After a minute or so the site is live at `https://<user>.github.io/<repo>/`.
