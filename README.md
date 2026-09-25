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
- **The map's clusters:** Political (including Fenwick and the Veil Elders), **The Six** (each Liquor King as his own node beside the Parliament, one story line each), Cultural, Religious (Patmos, the Brewmasters' faith, the tonic clergy, the Whiskey Runners, the Owe Block Veil sympathizers, Unknownism, the Tide Callers, the Ashen Oath, and the Fayte Druids as a minor movement), Racial & Lineage (the flesh-born, the Veilwalkers, the Line of Johns, the Coral-eyed), Economic, and the crises.
- **The dock** has three tabs:
  - **Lead**: pick the town you lead (Aleforge, Providence, Shanty Town, Roto Kaiishi or Fenwick). You get:
    - a **scorecard**: legitimacy, treasury, standing abroad, stability and exposure, each where it lands at the horizon, with what your last change did to it;
    - **Rivals likely to react**: the other towns' moves in the forecast;
    - four sets of levers: **Economic**; **Diplomatic** (your stance toward each town, with the relationship it produces and their stance toward you); **Civic Order**; and **Backroom Deals**.
    - Backroom deals are illegal or ruinous if known. Each one pays out every season it runs and may be found each season: chance = severity × 0.025 × (1 + 0.15 × people in on it) × (0.6 + press/100) × its watcher. When a deal is found, its scandal hits.
    - With nobody chosen, Lead shows every town's numbers side by side.
    - The towns you don't lead act on their own each season. They answer stances in kind, raise revenue when the treasury runs low, and tighten order when a local crisis nears.
  - **Inspect**: click a node to get its sliders, plus a quick list of the 3 biggest things **growing** it and the 3 biggest **shrinking** it over the horizon (click a stat's name to switch stats). Crises show what raises and lowers their odds, and what breaking would do.
  - **Tools**:
  - **Weak points**: the stats where a ±10 nudge travels furthest (marked ⚡ on the map).
  - **Find the lever**: pick an outcome (any group, crisis or relationship between towns); every slider and town lever (±15), every What-if and every backroom deal is tried and ranked.
  - **Scenarios**: save the present under a name, load it later, or compare the present against it.
- **Forecast panel** (40 simulated futures over 3–12 seasons): *Your change* bar chart with click-through routes; *Crisis odds* as dials, split into **global** crises (far-reaching) and **regional** crises (one town; their direct effects stay inside it, and only the web's links carry them further); *What if…*; *Heading, left alone*.
- **Seeing a change travel.** Every change leaves a footprint, drawn several ways:
  - **Ripple.** When you let go of a slider, lever or deal, a pulse runs out along the links, one step at a time; delayed effects arrive later in the same animation. ▶ Replay plays it again.
  - **Spotlight.** Everything the change didn't touch fades out. Links carry width by how much flowed along them, and faint rings mark 1st, 2nd and 3rd-order effects (solid, dashed and dotted outlines).
  - **Badges.** Every affected node shows its change as a large number (+6, −4); crises show the change in odds.
  - **Hold: before** (or hold B) shows the world without the change.
  - **Preview.** While you drag a slider or hover a deal, the map already shows the likely effect in italics, before you commit.
  - **Flow.** The Map / Flow switch draws the change → 1st → 2nd → 3rd → crises as a flow diagram; click a band for the links behind it.
  - **Town bar.** Above the map: each town's legitimacy, treasury and stability arrows, and alarms for any crisis the change moved by 10 points or more, with the route that did it.
  - **Your change** (forecast panel): gains and losses, the top five routes as chains, and a season-by-season heat map of when each effect lands.
  - **Your decisions** (forecast panel): every decision you've made, each with a bar for its share of where the world is heading and its biggest effects. Untick one to switch it off.
  - **Option A vs B** (Tools): two saved scenarios side by side for every town and crisis.
- **Why?** markers hold every in-world explanation. Sizes are pips (▲▮▮); exact numbers are on hover.
- **⋯ menu**: Projection, Chronicle (canon record, open threads, change log), World Data.

**Turn unit:** one turn is one season of the Pintland Calendar: **Stormtide**,
**Goldsun** and **Veilfrost**, three per year. The simulation starts at Cycle 94,
Year 466. Seasons matter:
- The Drunken Trials' tourist boost happens in Stormtide.
- Providence's Day of Hollow Tongues calms MAMA radicalization in Goldsun.
- Veilwalker activity and the VeilRunner hazard rise during Veilfrost.
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
  modifier). Each season a hazard may fire its event; the chance rises smoothly as the meter
  nears and passes its breaking point (0 until 15 below it, about 22% at it, up to 45% well
  past it). Firing applies the event's effects (which ripple like anything else) and releases
  the built-up grievance.
- **Your influence ranking**: every group and crisis on the map carries a tier (Global,
  Regional, Negligible), a rank within it, and when the lore says it holds power (Past, Now,
  Future). A group's outgoing links scale with its tier and rank (Global ×1.1 at the top of
  the tier, Negligible ×0.5 at the bottom). Groups marked Future drift up each season in the
  forecast (+0.3 if not yet powerful, +0.15 if already powerful); groups marked only Past
  fade (−0.15). Crises marked Future slowly build pressure; ones marked only Past lose it.
  Starting crisis meters are calibrated so the 12-season odds follow the ranking. Inspect
  shows each item's tier, rank and era.
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

The seed is all editable in the app. It holds:
- 101 groups: 51 on the map, 40 town levers (20 of them diplomatic stances), and 10 hidden relationships between the towns;
- 450 relationships;
- 9 hazards: 5 global and 4 regional;
- 16 backroom deals;
- 15 canon events and 25 injectable events.

When the canon seed's `meta.version` goes up, a browser holding an older saved world
switches to the new world automatically and keeps its current values. A notice offers to
restore the old world, World Data edits included, in one click.

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
