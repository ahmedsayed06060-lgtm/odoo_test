# Content notes

## Independence
OdooPrep is an independent preparation tool. Its questions are original educational content. They are not official Odoo certification questions, confidential exam dumps, or a guarantee of an official exam result.

## Functional scope
The bank covers navigation, editions/hosting, users/access/companies, settings, ERP processes, CRM, Sales, Purchase, Inventory, Accounting, POS, MRP, Project, Timesheets, HR, Payroll, Expenses, Fleet, Subscriptions, Rental, Helpdesk, Website/eCommerce, Email Marketing, Marketing Automation, Documents, Quality, Maintenance, Field Service, advanced configuration, implementation methodology, and cross-module/version scenarios. It deliberately avoids Python/ORM/XML/JavaScript/OWL/custom-module development.

## Version evidence
- Official documentation branches 14.0–20.0 were pinned and audited (commits in `source-audit.json`).
- Release-note claims use official Odoo release notes. Odoo 15 notes are cited through the available localized official URL.
- Odoo 20 release status was verified as released in September 2026.
- The Version Comparison Lab presents selected documented milestones, not an exhaustive changelog. Absence from the lab does not imply absence of change.
- Intermediate Odoo Online releases and backports are not treated as identical to major-version availability.

## Authoring pipeline
Concepts and questions are authored in a bilingual pipe-delimited DSL, then compiled deterministically. The compiler checks IDs/stems, resolves official sources per version, shuffles options reproducibly, and emits the runtime JSON bank. `npm run data:validate` checks bilingual completeness, unexpected scripts, duplicate prompts, answer arity, stage counts, version/type/difficulty coverage, official-source URLs, and audited source-file existence when the reference cache is present.
