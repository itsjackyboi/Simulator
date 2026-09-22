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

| Tab | What it does |
| --- | --- |
| **Political / Economic / Cultural / Religious / Racial & Lineage** | Group cards with 0–100 sliders and status badges. A **causal web** for the selected group shows what it pushes on and what pushes on it, colour-coded by type, with lags and dormant links marked. An **influence matrix** summarises every group at once. The **causal dispatches** panel explains each effect of a slider move in plain language, including multi-step chains and lagged effects queued for later seasons. |
| **Economy (Concept Economy)** | Built from *A Macroeconomic Analysis of the Pintland Isles*. The economic nodes are the Ducket's M2 stability, Ducket velocity, banks and credit, voyage insurers, the Roto currency black market, and a **Player Economy** gauge. That gauge shows what players feel (shop stock, prices, wages, contracts): it is driven from the top down, and players can only push back weakly through velocity. A **Policy Levers** panel holds the mercantilist dials: Aleforge tax take (tolls, docking, property and luxury tax), tariffs and embargoes, the Patmos tithe rate, monopoly charters, subsidized industries, and the Kings' concept performance rewards. 50 is today's setting; above 50, levers also push every season. The Analysis's worries are modelled as links: big farms trading one crop for endless coin, banks paying interest they never earned, black-market rates, and foreign coin as the only legitimate new money. |
| **Hazard meters** (every tab) | VeilRunner corruption, Ducket inflation, MAMA radicalization, Cumstead collapse, Aleforge bond crisis, credit crunch, Owe Block rising, Cloister stirring. These do not move one-for-one with sliders. Each is an S-shaped function of its inputs plus a built-up grievance that grows every season the meter stays high. Past its threshold, a meter can fire a new narrated event. Each meter lists what holds it down, what wears it away, and what happens if it crosses. |
| **Projection** | Simulates N seasons forward from the current dashboard state or from canon. You can schedule canon open-thread events or write your own. Each turn is a card with a short narrated summary, a ledger of changes and the causes behind them. Any turn can be **branched**: tweak one value there and re-simulate, reroll the dice from that point, or load that state into the dashboard. **Notable correlations** compares your timeline with an untouched control run (same dice, none of your changes) and spells out the chain behind each group you changed without touching. |
| **Chronicle** | Canon history, the precedents the engine reasons from, plus a record of seasons you advanced on the dashboard. |
| **World Data** | A JSON editor with validation for the whole world: groups, relationships, hazards, events, injectable events and narration. Also export and import (full state or world only) and restore canon. |

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

The seed's 31 groups (including 6 policy levers), 153 relationships, 8 hazards,
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
