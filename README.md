# A Century, Compressed

An interactive, single-file visualization of how fast technology has reached people from 1926 to 2026, and the measured trends underneath. Every number links to its source.

## View it

Download or clone the repo and open `index.html` in a browser. It is fully self-contained and works offline; source links need the internet. Add `#log` to the URL to open the trend charts on a log scale.

## What it shows

It opens with a short preamble: does innovation really feel faster in 2026 than it was, and what does a century of data say?

1. **Milestones.** 60 landmarks from 1926 to 2026, each with a primary source. These give context; the charts are the evidence.
2. **From 1 in 10 homes to 8 in 10.** Years for 10 technologies to spread through US households, from the landline (59 years) to social media (11). Radio, in the 1930s, was about as fast as the cell phone.
3. **Time to 100 million users.** 14 technologies worldwide, from the telephone (about 75 years) through the iPhone and Android to Threads (5 days). Each row keeps the measure its source reports.
4. **Six measured trends,** with a linear/log toggle:
   - AI training compute since 1950
   - transistors per chip since 1971
   - genome sequencing cost since 2001
   - solar module price since 1975
   - objects launched into space per year since 1957
   - electric share of new car sales since 2010
5. **The road to large language models.** METR's time horizon, the length of task (in human working time) that AI models complete half the time, for 40 models from 2019 to 2026. It doubles about every 4 months since 2023. Below it, 22 steps from Turing (1950) to today.
6. **Caveats.** What the data can and cannot support.

## Data sources

- Epoch AI (training compute)
- METR (time horizons)
- Our World in Data, drawing on:
  - Comin and Hobijn (household adoption)
  - IRENA, Nemet, and Farmer and Lafond (solar)
  - UNOOSA (space launches)
  - IEA (electric cars)
- NHGRI (genome cost)
- ITU, the US Department of Commerce and company announcements (adoption)
- SEC filings (Starlink)
- Wikipedia and vendor pages (transistors)
- Primary sources for every milestone

The full list is on the page. Figures are as reported by these sources, and several are estimates.

## Build

Node.js is the only requirement; there are no dependencies.

```sh
node build.mjs   # inlines data.json into template.html to produce index.html
node check.mjs   # validates dates and https sources, offline safety and build freshness
```

`data.json` holds the data and `template.html` the page. `v1-50-years/` keeps the earlier 1976 to 2026 version.

## Known limits

- **Household data:** US only. Several series start at 10%, so their first recorded year is used.
- **Adoption figures:** they mix subscriptions, accounts, installs, sign-ups and monthly users. The telephone's 75 years is a widely repeated estimate. ChatGPT and TikTok are analyst estimates, and Threads borrowed Instagram's user base.
- **AI figures:** most frontier compute values after 2023 are Epoch AI estimates. METR's time horizons cover software and research tasks only, and results above 16 hours exceed what its task suite measures reliably.
- **Transistor counts:** recent figures are for multi-die packages.
- **Genome and solar series:** NHGRI's genome series ends in 2022. Solar prices switch from global estimates to a European benchmark in 2010.
- **Milestones:** they are a curated selection, and their spacing is not a measurement.
