# Tesla Q2 2026 earnings historical reconstruction

**Status (2026-10-11):** a fresh investigation on the final protected Preview completed preflight, ATLAS, VEX, SEAL, receipt verification, and outcome reveal with Qwen through OpenRouter. All six API responses returned HTTP 200; every stage response included its required signed token, tokens persisted in browser session storage, and the browser rendered the thesis, claims, challenges, audit, receipt, citations, and results. The desktop and 390px mobile UI checks passed with no browser errors or horizontal overflow. VEX generated unsupported alternative hypotheses about channel stuffing and synthetic or decoupled token mechanics. VEX and SEAL also mischaracterized Tesla's company-compiled consensus of sell-side analysts as not sell-side, despite the linked source listing analyst inputs. These model statements are not evidence-backed findings; the server validates citation IDs, not semantic entailment. This is a retrospective reconstruction, not a contemporaneous forecast. A pretrained model may have learned the outcome.

## Cutoff and windows

- Event: Tesla Q2 2026 financial results, scheduled after market close July 22, 2026.
- Evidence cutoff: `2026-07-22T19:45:00.000Z` (3:45 p.m. America/New_York). The company schedule said “after market close”; it did not promise an exact release time.
- Pre-event market observation: completed 15-minute Bitget SPOT candle opened at `2026-07-22T19:30:00.000Z` and ended at the cutoff. It is included only if the runtime returns the exact interval and a qualifying instrument.
- Business Wire timestamped its results notice at 4:14 p.m. EDT (`2026-07-22T20:14:00Z`) in a [syndicated copy](https://www.streetinsider.com/Business%2BWire/Tesla%2BReleases%2BSecond%2BQuarter%2B2026%2BFinancial%2BResults/26801785.html?classic=1). This is 29 minutes after the evidence cutoff. Tesla IR displays the release date but not this clock time.
- Outcome observation: the separate `2026-07-22T20:30:00.000Z` to `2026-07-22T20:45:00.000Z` candle opens 16 minutes after the newswire timestamp and is available only after the sealed record verifies.
- The selected 15-minute candles are observations, not a continuous chart or a causal estimate.

## Bitget instrument identity

On 2026-10-11, the public Bitget SPOT instrument endpoint returned `RTSLAUSDT` (`rTSLA` / `USDT`) with `category=SPOT`, `symbolType=stock`, `status=online`, and `isReality=yes`. The response omitted `isRwa`; the validator accepts an omitted value but rejects an explicit negative flag. This supports identifying it as the Reality stock token; it does not prove equivalence to the underlying TSLA share.

- [Bitget market API documentation](https://www.bitget.com/docs/catalog/market/market-data): instrument discovery, Reality flags and historical candles.
- [Bitget Reality stock-token description](https://www.bitget.com/support/articles/12560603887209): product background, including TSLA.

## Pre-event source catalogue

The five configured sources were checked against their official pages and displayed dates on 2026-10-11. Date-only pages keep date-only precision. The SEC acceptance time is kept as displayed with timezone unspecified and is evaluated conservatively.

| ID | Source | Published/accepted as displayed | Evidence and limits |
|---|---|---|---|
| `TSLA_PRE_Q1_UPDATE` | [Tesla Q1 2026 Update](https://assets-ir.tesla.com/tesla-contents/IR/TSLA-Q1-2026-Update.pdf) | April 22, 2026; date only | Company-reported Q1 revenue of $22.387 billion, production of 408,386 and deliveries of 358,023. Prior-quarter results are context, not a prediction. |
| `TSLA_PRE_SEC_10Q` | [Tesla Q1 2026 Form 10-Q](https://www.sec.gov/Archives/edgar/data/1318605/000162828026026673/tsla-20260331.htm); [SEC filing index](https://www.sec.gov/Archives/edgar/data/1318605/000162828026026673/0001628280-26-026673-index.htm) | Accepted April 22, 2026 at 21:43:00 as displayed; timezone unspecified | Regulatory record of the quarter ended March 31, 2026; reports Q1 revenue of $22.387 billion. The time is not relabeled UTC. |
| `TSLA_PRE_DELIVERY_CONSENSUS` | [Q2 2026 Delivery Consensus](https://ir.tesla.com/press-release/delivery-consensus-second-quarter-2026) | June 26, 2026; date only | Tesla's 22 estimate inputs gave average deliveries of 406,024 and median of 408,609. Tesla says it does not endorse the estimates or conclusions. |
| `TSLA_PRE_DELIVERIES` | [Q2 Production, Deliveries & Deployments](https://ir.tesla.com/press-release/tesla-second-quarter-2026-production-deliveries-and-deployments) | July 2, 2026; date only | Reports 451,758 production and 480,126 deliveries, announces results after market close July 22, and cautions that deliveries alone do not indicate financial results. |
| `TSLA_PRE_EARNINGS_CONSENSUS` | [Q2 2026 Earnings Consensus](https://ir.tesla.com/press-release/earnings-consensus-second-quarter-2026) | July 17, 2026; date only | 23 estimate inputs gave average revenue of $27.584 billion and average GAAP EPS of $0.36. Tesla says it does not endorse the estimates or conclusions. |

These sources precede the cutoff. Their current accessibility and displayed contents do not prove they were captured contemporaneously. No outcome values or post-event observations are included in the pre-event packet.

## Outcome compartment

Only after the record is sealed and verified, the reveal route loads the post window and links [Tesla's Q2 2026 financial results](https://ir.tesla.com/press-release/tesla-releases-second-quarter-2026-financial-results), published July 22 with date-only precision. The more precise 4:14 p.m. EDT time is from the Business Wire syndication noted above.

The final Preview run produced receipt digest `4a218ae5705ba3821ee73e2aa5e58d2786b7e204a1f649c57bbcdc28c01ea27d`; verification returned `valid: true` with the message “Receipt bytes and server signature verified.” Bitget returned these completed SPOT candles for `RTSLAUSDT`:

| Window (UTC) | Open | High | Low | Close | Quote turnover |
|---|---:|---:|---:|---:|---:|
| July 22, 19:30-19:45 | 374.77 | 375.21 | 374.13 | 374.55 USDT | 282,692,162.5658 USDT |
| July 22, 20:30-20:45 | 365.53 | 366.001 | 363.95 | 364.70 USDT | 139,986,137.6765 USDT |

The displayed close-to-close change is -2.6298%. Outcome candles, observed prices, volume, and change belong to the reveal record, never this case's model prompt. The change is not a causal estimate, executable return, or proof that the thesis was correct.
