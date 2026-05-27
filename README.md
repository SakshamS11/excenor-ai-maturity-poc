# Excenor Global AI Maturity POC

A static proof of concept for a conversational AI maturity scoring product.

## Flow

1. Capture user details: name, organization, industry, email, and phone number.
2. Ask 12 maturity questions across six weighted dimensions.
3. Calculate a deterministic AI Maturity Score out of 100, hidden until the final reveal.
4. Show maturity level, strengths, priority gaps, and how Excenor Global can help.
5. Save the lead, transcript, score, and short internal summary.
6. Offer an AI advisor follow-up and proposal request CTA.

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

## Environment Variables

Set these in Vercel when moving beyond demo mode:

- `GEMINI_API_KEY`: enables live Gemini AI advisor responses through `/api/chat`.
- `GEMINI_MODEL`: optional model override. Defaults to `gemini-2.5-flash`.
- `LEADS_WEBHOOK_URL`: optional webhook endpoint for server-side lead capture. Without this, the POC saves lead snapshots in browser storage.
