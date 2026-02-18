# UX Audit Latest

- Date: 2026-02-18
- Overall Score: **5/5.0**
- Verify: **PASS**
- Open Issues: **6**

## Criteria Scores
| Criteria | Score | Note |
| --- | ---: | --- |
| first5s | 5.0 | All gates passed. Verify visually for narrative quality. |
| oneCta | 5.0 | All gates passed. Verify visually for narrative quality. |
| heroDiff | 5.0 | All gates passed. Verify visually for narrative quality. |
| navConfidence | 5.0 | All gates passed. Verify visually for narrative quality. |
| calm | 5.0 | All gates passed. Verify visually for narrative quality. |
| performance | 5.0 | All gates passed. Verify visually for narrative quality. |
| trust | 5.0 | All gates passed. Verify visually for narrative quality. |
| copy | 5.0 | All gates passed. Verify visually for narrative quality. |
| state | 5.0 | All gates passed. Verify visually for narrative quality. |
| a11y | 5.0 | All gates passed. Verify visually for narrative quality. |
| reliability | 5.0 | All gates passed. Verify visually for narrative quality. |
| memorable | 5.0 | All gates passed. Verify visually for narrative quality. |

## Top Open Issues (Priority Sorted)
| ID | Route | Criteria | Severity | PriorityScore | Autofixable | Symptom |
| --- | --- | --- | --- | ---: | --- | --- |
| UX-AUTO-001 | / | oneCta | P0 | 24 | yes | Expected <= 1 primary CTA; found 3. |
| UX-AUTO-002 | /dashboard | oneCta | P0 | 24 | yes | Expected <= 1 primary CTA; found 3. |
| UX-AUTO-003 | /protect | oneCta | P0 | 24 | yes | Expected <= 1 primary CTA; found 3. |
| UX-AUTO-004 | /execute | oneCta | P0 | 24 | yes | Expected <= 1 primary CTA; found 3. |
| UX-AUTO-005 | /govern | oneCta | P0 | 24 | yes | Expected <= 1 primary CTA; found 3. |
| UX-AUTO-006 | /settings | oneCta | P0 | 24 | yes | Expected <= 1 primary CTA; found 2. |

## Verify Checks
| Command | Status | Exit |
| --- | --- | ---: |
| `npm run test:run` | PASS | 0 |
| `npm run check:design-system` | PASS | 0 |
| `npm run check:motion-policy` | PASS | 0 |
| `npm run check:a11y-structure` | PASS | 0 |
| `npm run check:cta-hierarchy` | PASS | 0 |
| `npm run check:contrast-budget` | PASS | 0 |
| `npm run build` | PASS | 0 |
| `npm run check:bundle-budget` | PASS | 0 |
| `npm run verify:pwa` | PASS | 0 |
