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


## Playbook libraries
- The advanced library contains 100 original practical playbooks (`ADV-001`–`ADV-100`). Each includes a functional goal, realistic company case, bilingual settings path, ordered execution steps, worked example with setup/input/expected result, validation checks, common errors/diagnosis, official sources, and edition/version caveats.
- The industry library contains 100 original business-activity scenarios (`IND-001`–`IND-100`). Each includes a business profile, challenge, operating steps, worked example, controls, KPIs, and an explicit boundary between standard Odoo coverage and specialized systems/integrations.
- Playbooks are educational implementation patterns, not official Odoo certification content. They must be validated in a test database for the target edition, localization, hosting model, and release.
- Playbook source aliases are resolved against the official `odoo/documentation` 20.0 tree at commit `c4faee6405fc0918330848c2e53be08748e0766d`, retrieved 2026-10-30. The official editions page is attached to every playbook because Community/Enterprise availability can differ.
- The compiler rejects missing bilingual fields, unknown categories/modules, invalid source aliases, insufficient steps/checks/controls/KPIs, duplicate IDs/titles, and unexpected scripts. `npm run playbooks:validate` checks the generated runtime libraries and writes `docs/playbooks-validation-report.json`.
- Industry scenarios deliberately avoid claiming that Odoo replaces regulated or specialized systems such as EHR/HIS, LIS, clinical orders, insurance adjudication, property lease management, ATS, legal case management, customs declaration portals, CAD/PLM design, or industrial safety certification.
