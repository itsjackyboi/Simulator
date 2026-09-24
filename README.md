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

One screen: a **dock** on the left, **the Web** in the middle, and a **forecast panel** on the right that you can hide with **Forecast** or **»**. Everything else sits in the **⋯** menu, and **?** shows or hides the explanations.

- **Status strip** above the map: the state of the Isles, the likeliest crisis, and the biggest risers and fallers over the horizon.
- **The map.** Node size is current power, and fill tint is where it's heading. After a change, a **dashed outline shows each node's size before it**, so before and after sit on the map together. A **Region** lens (Aleforge, Providence, Shanty Town, Roto Kaiishi, Fenwick, Isles-wide) highlights one town, its crises, and everything linked into it. The season slider and ▶ play the forecast out. Hover a node for its likely path.
- **The dock.** Click a node to get its sliders beside the map, plus a quick list of the 3 biggest things **growing** it and the 3 biggest **shrinking** it over the horizon (click a stat's name to switch stats). Crises show what raises and lowers their odds, and what breaking would do. With nothing selected, the dock holds the tools:
  - **Weak points**: the stats where a ±10 nudge travels furthest (marked ⚡ on the map).
  - **Find the lever**: pick an outcome; every slider (±15) and every What-if is tried and ranked.
  - **Scenarios**: save the present under a name, load it later, or compare the present against it.
- **Forecast panel** (40 simulated futures over 3–12 seasons): *Your change* bar chart with click-through routes; *Crisis odds* as dials, split into **global** crises (far-reaching) and **regional** crises (one town; their direct effects stay inside it, and only the web's links carry them further); *What if…*; *Heading, left alone*.
- **Why?** markers hold every in-world explanation. Sizes are pips (▲▮▮); exact numbers are on hover.
- **⋯ menu**: Projection, Chronicle (canon record, open threads, change log), World Data.

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

The seed's 31 groups (including 6 policy levers), 196 relationships, 11 hazards (4 global, 7 regional),
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
