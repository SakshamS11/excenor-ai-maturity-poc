# Excenor Global AI Maturity POC

A static proof of concept for a conversational AI maturity scoring product.

## Flow

1. Capture user details: name, organization, industry, email, and phone number.
2. Ask 12 maturity questions across six weighted dimensions.
3. Calculate a deterministic AI Maturity Score out of 100, hidden until the final reveal.
4. Show maturity level, strengths, priority gaps, and how Excenor Global can help.
5. Save the lead, transcript, score, and short internal summary.
6. Offer an AI advisor follow-up and proposal request CTA.

The AI advisor is grounded in a server-side Excenor Knowledge Layer curated from the Excenor Global brochure and excenorglobal.com. It includes Excenor's positioning, 5D engagement model, flagship capabilities, service portfolio, sector language, outcome themes, and response guardrails. It adapts answers to the user's free-text industry entry while keeping recommendations anchored to Excenor.

## Excenor Intelligence

- `/intelligence/process-intelligence-agent`: Process Intelligence Agent page for AI-enabled process diagnostic reports.
- `/api/process-diagnostic`: server-side Vercel function that generates a structured Markdown process diagnostic report.
- `/intelligence/dmaic-agent`: DMAIC Agent page for structuring Lean Six Sigma and process improvement problems.
- `/api/dmaic-agent`: server-side Vercel function that generates a structured DMAIC report. The Gemini key stays on the server and is never exposed to the browser.

## Scoring Dimensions

| Dimension | Weight |
| --- | ---: |
| AI Strategy & Leadership | 15 |
| Data Readiness | 20 |
| Process & Use Case Maturity | 20 |
| Technology & Integration | 15 |
| People & Capability | 20 |
| Governance, Risk & Compliance | 10 |

## Deployment

This is a static site. It can be deployed directly to Vercel from GitHub or through the Vercel CLI.

## Local Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and add `GEMINI_API_KEY`.
3. Run `npm run check` to validate JavaScript syntax.
4. Run `npm start` to serve the static site locally.
5. Deploy to Vercel from GitHub.

## Environment Variables

Set these in Vercel when moving beyond demo mode:

- `GEMINI_API_KEY`: enables live Gemini AI advisor responses through `/api/chat`.
- `GEMINI_API_KEY`: enables live Process Intelligence reports through `/api/process-diagnostic`.
- `GEMINI_API_KEY`: also enables live DMAIC Agent reports through `/api/dmaic-agent`. `GOOGLE_API_KEY` is accepted as a fallback name for this route, but `GEMINI_API_KEY` is the preferred project convention.
- `GEMINI_MODEL`: optional model override. Defaults to `gemini-2.5-flash`, recommended for Excenor-aware consulting responses.
- `LEADS_WEBHOOK_URL`: optional webhook endpoint for server-side lead capture. Without this, the POC saves lead snapshots in browser storage.

If `GEMINI_API_KEY` is missing, the DMAIC Agent returns a structured demo report so the page can still be tested locally.

## Excenor Knowledge Layer

The shared server-side knowledge layer lives in `api/excenor-knowledge.js`. It is imported by:

- `/api/chat`
- `/api/dmaic-agent`
- `/api/process-diagnostic`

The knowledge layer constrains AI outputs to Excenor's consulting identity: AI-enabled business excellence, process excellence and BPR, Lean Six Sigma, cybersecurity and digital trust, ISO and business excellence, project delivery, capability building, and the 5D method of Discover, Diagnose, Design, Deploy and Demonstrate. API keys and prompts stay server-side.
