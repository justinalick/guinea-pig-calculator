# Guinea pig herd calculator

How long does it take a herd of guinea pigs to grow from `n` to `N`? A single-file, no-build web calculator that answers it with an age-structured cohort model and an individual-based Monte Carlo.

Open `index.html` in a browser, or use it at [justinalick.com/projects/guinea-pig-calculator](https://justinalick.com/projects/guinea-pig-calculator/).

KaTeX, Plotly and the fonts are vendored in `vendor/`, so the page makes no third-party requests. Everything, including the Monte Carlo, runs in the browser.

## What it models

- Daily-clock cohort model: gestation, interbirth interval, litter size, first-litter penalty, sexual maturity, retirement
- Mortality from a published lifetable (Mata, PeerJ 2025) or a flat annual rate, plus pup survival, breeding-sow hazard, whole-litter loss and older-sow penalties
- Boar availability, crowding against a carrying capacity, and inbreeding depression through effective population size
- Euler-Lotka growth rate, R0 and generation time
- Monte Carlo in Web Workers with a histogram of hit times, luck vs. luck plus input uncertainty, founder analysis
- Animated age-sex pyramid and a 2D/3D Lexis surface
- All math rendered in KaTeX on the "How it works" tab; 11 self-checks run on load

Defaults: 10 starting pigs, target 10,000, realistic parameters (all editable).

## Sources

Mata, PeerJ 2025; Rowlands, J. Hygiene 1949; Ralls, Ballou & Templeton, Conservation Biology 1988; lab colony study, PMC10000240.

Model output is an estimate, not a breeding plan.

By [@justinalick](https://x.com/justinalick).

## Deploy

Every push to `main` runs `scripts/build.mjs` (copies the page into `dist/` and writes a CSP that allows the inline scripts by hash) and `wrangler deploy` to a static-assets Worker routed on that path. It needs the repo secret `CLOUDFLARE_API_TOKEN`.

## License

Code: [MIT](LICENSE). Branding (name, @justinalick handle, CryptoPunk image, visual identity) is excluded and all rights are reserved; see [NOTICE](NOTICE). Forks must remove it.
