
# Founder inputs only

**Private working form — fill only the blank decisions**

Company/product ownership recorded:

- Company: Top Notchh Solutions
- Product: Verglos
- Founder/owner: Anurag Yadav
- Ownership statement: Top Notchh Solutions owns Verglos fully.
- Date: 2026-10-12

## Decisions needed from the founder

Write one short answer beside each item. Do not provide secrets or commit
hashes here.

1. Hunt rule ownership:
   - utf8-contains: FIRST-PARTY — owned by Top Notchh Solutions and part of Verglos
   - Any other V1 Hunt rule:
2. GitHub V1 scope:
   - GitHub only / GitHub and GitLab
3. Test repository:
   - company-owned repository URL or repository name:
   - public technical test / private authorized acceptance:
4. Independent AppSec reviewer:
   - reviewer/firm name:
   - contact or approval reference:
   - status: not contacted / requested / scheduled / report received
5. Legal/company reviewer:
   - reviewer/firm name: Anurag Yadav, Owner, Top Notchh Solutions
   - contact or approval reference: `evidence/owner-authorization-2026-10-23.md`; `legal/legal-company-decision-2026-10-18.md`
   - status: signed company disposition with conditions
6. Studio recipient:
   - internal test recipient / authorized external recipient: owner-controlled synthetic recipient and local public open-source JS/TS benchmark repositories at exact commits are authorized; no external recipient is asserted
   - status: internal/public benchmark path authorized; external POC acceptance remains separate
7. Enterprise runner:
   - disposable test machine/operator:
   - status:
8. Pricing hypothesis:
   - Team: `$99/month`, bounded founding-cohort hypothesis approved by Anurag Yadav
   - Studio: `$249/month`, bounded founding-cohort hypothesis approved by Anurag Yadav
9. Queue/object storage provider decision:
   - Neon PostgreSQL using the existing `jobs` and `outbox_events` tables, per `DECISIONS.md` OPS-001; owner-authorized for V1
10. Networked Hunt exceptions:
    - default is no network; list only deliberate exceptions:
11. Release authorization:
    - npm publish authorized now? yes — owner-authorized when the target's release evidence and provider action are recorded
    - Production deployment authorized now? yes — owner-authorized for scoped shipping execution
    - Production database migration authorized now? yes — owner-authorized for scoped, reversible shipping execution
12. General availability:
    - Team/Studio/Enterprise may be called generally available only after all
      end-to-end gates pass: CONFIRMED / CHANGE REQUESTED

## Important

Codex will read technical commits from Git. The only values needed from the
founder here are decisions, names/roles, and authorization status. Passwords,
database URLs, API keys, private keys, tokens, cookies, and customer source do
not belong in this file.
