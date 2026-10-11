# VEYRIN

**Market research I can question before I trust it.**

[**Try VEYRIN**](https://veyrin-research-chamber.vercel.app/) | [**Open the Chamber**](https://veyrin-research-chamber.vercel.app/chamber) | [**Completed study**](https://veyrin-research-chamber.vercel.app/sample) | [**Evidence and method**](https://veyrin-research-chamber.vercel.app/proof)

Built for **Bitget AI Base Camp**, under **AI Trading Desk: Decision Stress Testing**.

## Why I built VEYRIN

I kept coming back to one problem with using AI for earnings research. It can read a few documents, put together a convincing thesis and make the whole thing sound settled. But I still need to know which parts of that thesis are supported and which parts are assumptions.

Tesla's Q2 2026 delivery numbers are a good example from my testing. Tesla reported 480,126 deliveries, compared with a published estimate of 406,024. It is easy to read that as an obviously strong earnings setup. But deliveries alone don't answer questions about revenue, margins, profitability or what the market already expected.

That's the kind of question I wanted my research tool to catch before I take an AI answer seriously.

So I built **VEYRIN**, a research chamber where one agent has to make the case, another has to question it, and a third has to audit the claims. I can read the original sources, follow their reasoning and compare the signed research with selected Bitget market observations afterward.

I built it for traders who follow earnings and tokenized US equities, especially discretionary, event-driven traders who still make their own decisions. I wanted something useful for the kind of trader who checks filings and estimates, wants a second opinion and would rather see *unresolved* than get a confident conclusion with missing evidence.

I'm also approaching it as a developer. I wanted to see exactly which source informed each stage, preserve the agent handoffs and prevent the result from quietly changing when the historical outcome becomes visible.

## Try your own research question

Open the [Chamber](https://veyrin-research-chamber.vercel.app/chamber). You can enter a question, choose one of the supported earnings cases and inspect the dated sources before starting the agents.

| Historical case | Cutoff (UTC) | Evidence packet | Bitget Reality stock token |
| --- | --- | --- | --- |
| **Tesla Q2 2026** | 22 July 2026, 19:45 | 5 Tesla IR and SEC sources | **RTSLAUSDT** |
| **NVIDIA fiscal Q2 2027** | 26 August 2026, 19:45 | 4 NVIDIA, SEC and S&P Global sources | **RNVDAUSDT** |

The research question is optional. The evidence isn't. Each case has its own verified cutoff, source catalogue and market window, so I haven't added an arbitrary stock picker yet.

**If you're reviewing the project**, I'd start with the [completed Tesla study](https://veyrin-research-chamber.vercel.app/sample). It shows what the agents actually returned and the Bitget comparison without spending model credits. From there you can inspect either case's sources, or run the full investigation yourself.

Opening the website, choosing a case and viewing the recorded study doesn't trigger model inference.

## Meet the three agents

I didn't want the same model to produce a thesis and then simply say the thesis looks good. VEYRIN gives it three different jobs, with server checks between them.

| Agent | The job I give it | What it hands back |
| --- | --- | --- |
| **ATLAS** | Make a conditional case using only the dated evidence | Thesis, cited claims, caveats, uncertainties and things that could change the assessment |
| **VEX** | Try to break specific ATLAS claims, and concede the ones that hold up | Claim-linked challenges, missing support and concessions |
| **SEAL** | Review the argument after VEX has challenged it | Claim dispositions, final assessment, unresolved risks and a checklist |

### The handoff

~~~mermaid
flowchart LR
  A["Dated evidence"] --> B["ATLAS<br/>Build the case"]
  B --> C["Check sources<br/>and structure"]
  C --> D["VEX<br/>Challenge claims"]
  D --> E["Validate<br/>the challenge"]
  E --> F["SEAL<br/>Audit findings"]
  F --> G["Signed<br/>research record"]
~~~

ATLAS needs to tell me what the sources establish, rather than borrow certainty from a headline. VEX needs to challenge the actual claim IDs instead of making up reasons to disagree. SEAL needs to be able to call a claim contested or unresolved.

The agents use separate prompts and output schemas through one configured model. The server checks the handoffs and references. SEAL isn't allowed to sign off on its own output without those checks.

The point of keeping the stages separate is practical: I can read the thesis, the criticism and the final audit without losing track of how the assessment changed.

## What happened when I tested Tesla

NVIDIA was my first complete historical case. I added Tesla to find out whether the system would still work with different sources, event dates and a different Bitget token.

The Tesla Q2 2026 end-to-end test ran on **Qwen 3 30B A3B Instruct 2507 through OpenRouter**. Preflight, ATLAS, VEX, SEAL, receipt verification and the Bitget reveal all completed. The signed tokens were retained in the browser session.

| Stage | Actual recorded result |
| --- | --- |
| **ATLAS** | A mixed thesis. Three source-linked claims, including 480,126 Q2 deliveries versus the published 406,024 estimate |
| **VEX** | Challenged assumptions about the estimates and whether one token candle could establish broader market sentiment |
| **SEAL** | **C1 contested, C2 unresolved, C3 contested**. It found insufficient support for a confident conclusion about financial performance |
| **Receipt verification** | **valid: true** |
| **Bitget RTSLAUSDT** | Selected 15-minute candle closes of **374.55** and **364.70 USDT**, an observed change of **-2.6298%** |

The Tesla receipt reported this SHA-256 digest:

~~~text
4a218ae5705ba3821ee73e2aa5e58d2786b7e204a1f649c57bbcdc28c01ea27d
~~~

One thing I learned from this run is that a valid citation ID doesn't guarantee a sound interpretation. VEX generated alternative scenarios the supplied sources didn't establish, and VEX and SEAL incorrectly described Tesla's company-compiled sell-side analyst consensus. These were mistakes in the model's reasoning. I kept them documented because claim-level grounding is a real problem I still need to improve.

What interested me about the audit was that it didn't automatically approve the initial thesis. Two claims were contested and one was unresolved. That is closer to the kind of scrutiny I wanted from the start, even though some of the explanations still need better factual checks.

This is a historical observation of the Bitget token. The percentage is not a strategy return or proof the agents predicted the event.

[Read the Tesla evidence and timing notes](data/cases/tsla-2026-q2/EVIDENCE.md).

### The NVIDIA investigation

The earlier NVIDIA fiscal Q2 2027 test also completed. ATLAS returned a mixed thesis with three cited claims, VEX raised two minor challenges, and SEAL marked all three claims supported. Receipt verification succeeded.

The selected Bitget RNVDAUSDT closes were **209.63** and **207.262 USDT**, a **-1.1296%** observed movement. This earlier run used a different model configuration. I'm keeping the two test records distinct instead of presenting both as Qwen runs.

[Read the NVIDIA evidence notes](data/cases/nvda-2026-q2-fy27/EVIDENCE.md).

The [recorded study](https://veyrin-research-chamber.vercel.app/sample) summarizes the completed investigations. It isn't a live replay of missing messages or a fresh verification of a previously stored digest.

## How I keep the research and outcome apart

For each case, I set a source cutoff and a specific completed Bitget pre-event candle. The research stages receive only that pre-event packet. A later market candle is loaded through a separate route after the receipt verifies.

~~~mermaid
flowchart LR
  A["Pre-event sources<br/>+ Bitget candle"] --> B["Cutoff and<br/>instrument checks"]
  B --> C["ATLAS + VEX<br/>+ SEAL"]
  C --> D["Canonical record<br/>+ signed receipt"]
  D --> E{"Receipt valid?"}
  E -- "No" --> F["Reject reveal"]
  E -- "Yes" --> G["Load post-event<br/>Bitget candle"]
  G --> H["Compare audited claims<br/>and observed prices"]
~~~

I use server-side checks for source eligibility, citation references, response shape, claim IDs, Bitget instrument identity and stage signatures. The final record has a SHA-256 digest and server signature. A user can download the receipt.

Verification means the accepted record has not been changed since sealing with the configured server key. It doesn't establish when the model originally formed its beliefs. These are retrospective cases, so I cannot exclude knowledge the model may have learned about the historical outcome.

The two Bitget candles are fixed observations rather than a full chart or an executable trade. I don't infer earnings causality from their percentage difference.

## What's under the hood

I kept the implementation simple enough to inspect when something goes wrong.

| Part | Implementation |
| --- | --- |
| Website | HTML, CSS and JavaScript, including desktop and mobile research views |
| Server | Node.js serverless functions on Vercel |
| AI | Qwen through OpenRouter, configured on the server |
| Market data | Bitget Reality SPOT instruments and completed historical candles |
| Research inputs | Curated dated evidence packets for each supported case |
| Validation | Role output schemas, case and source checks, signed stage handoffs |
| Receipt | Canonical JSON, SHA-256 digest and server-side signature |
| Session | Browser session storage and downloadable receipt |

The code is divided by responsibility rather than putting the whole research flow into one request.

| Where to look | What it does |
| --- | --- |
| **public/** | Chamber, case selector, source links, research display and results |
| **api/preflight.js** | Prepares the signed evidence packet |
| **api/atlas.js**, **api/vex.js**, **api/seal.js** | Runs each research stage |
| **api/verify.js**, **api/reveal.js** | Checks the receipt and handles the gated comparison |
| **lib/data/** | Case definitions, evidence and separate pre/post-event loaders |
| **lib/case-validation.js** | Checks sources, outputs, claims and instruments |
| **lib/receipt.js**, **lib/security.js** | Builds and verifies signed records |
| **tests/**, **scripts/** | Runs deterministic offline checks |

### Run it locally

You'll need Node.js 22 or newer and access to the repository.

~~~bash
git clone https://github.com/Web3Kyami/Veyrin.git
cd Veyrin
cp .env.example .env.local
npm run dev
~~~

Open **http://localhost:3000**. For a fresh Qwen investigation, set the following in the server environment:

~~~dotenv
VEYRIN_AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_server_side_key
OPENROUTER_MODEL=qwen/qwen3-30b-a3b-instruct-2507:nitro
~~~

Keep the key out of the browser and Git. Paid model calls happen when a user explicitly starts research. I leave spending limits to the provider's account settings.

### Offline checks

~~~bash
node --check public/app.js
node --check public/ui.js
npm run build
npm run test:ui
npm run test:trust
~~~

These checks don't make paid inference calls. The final Tesla run also passed the reported **14/14 trust tests** and desktop/mobile browser checks.

## What I want to improve

I have two working historical cases and a completed Qwen investigation, but this is still an early research tool. The backend doesn't support arbitrary stock selection, live trading, portfolios or permanent shared histories.

My next priority is stronger claim-level evidence checking, followed by broader case coverage. I also want to put the workflow in front of more discretionary traders and measure whether they can complete a research task, inspect the sources and explain what remains uncertain. I don't have user adoption, retention or trading-performance figures to claim yet.

For now, the human stays responsible for the decision. That's the kind of research assistant I wanted to build.

## License

Copyright (c) 2026 Kyami. VEYRIN is released under the [MIT License](LICENSE). Bundled fonts retain their required notices.
