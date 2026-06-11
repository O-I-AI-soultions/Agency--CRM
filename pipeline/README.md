# Lead Pipeline — Apify → Make → Airtable

Finds local businesses with a phone number but **no website**, and drops them into an Airtable CRM as sales leads.

Full plan: [docs/data-pipeline-plan.md](../docs/data-pipeline-plan.md)

## Status checklist

Update these checkboxes as steps complete (see session log rule in [CLAUDE.md](../CLAUDE.md)).

### Step 1 — Account setup
- [x] Apify free account created
- [x] Make.com free account created (org "My Organization", team "My Team")
- [x] Airtable free account created
- [x] Airtable base created — base **"O-I-AI-soultions"** (`appecLcxk0qS8mNGV`), table **"Lead Tracker"** (`tbl9v2Zl9XE8ZByHz`) with 14 fields: Business Name, Phone Number, City, Google Rating, Website URL, Google Maps Link, Status, Notes, Last Contacted, Next Action, Lead Source, Priority, Assigned To, Follow-up Count

### Step 2 — Apify (the Finder)
- [x] Google Maps scraper actor selected: `compass/crawler-google-places` (Google Maps Scraper)
- [x] First niche + city chosen for the test run: **barbers / hairdressers in Kfar Saba & Hod HaSharon, Israel**
- [x] Filter: `website: "withoutWebsite"` (no separate "has phone" filter needed — scraper returns phone when available)

### Step 3 — Make.com (the Bridge)
- [x] Scenario created — **"Integration Apify"** (id `6151519`), now **active**
- [x] Trigger: Apify webhook "Apify Maps Trigger" (hook id `3216236`) fires when a `compass/crawler-google-places` run finishes
- [x] Module 2: `apify:fetchDatasetItems` (clean/JSON, limit 100) — returns one bundle per place automatically

### Step 4 — Airtable (the CRM)
- [x] Make output mapped to Airtable columns — Module 3: `airtable:CreateRecordAdvanced` → Lead Tracker, mapping title→Business Name, phone→Phone Number, city→City, totalScore→Google Rating, website→Website URL, url→Google Maps Link, Lead Source="Apify Google Maps"
- [ ] Deduplication handled (don't re-add same business) — not yet implemented; currently every scrape run will create new records even for repeat businesses

### Step 5 — Test & action
- [x] Test scrape ran end-to-end (Apify run `7HnJnZcKQF7brHYez`, barbers in Kfar Saba & Hod HaSharon, 5 places per search, no-website filter)
- [x] Data verified in Airtable — 10 new "Apify Google Maps" lead records created in Lead Tracker (barbershops in Kfar Saba, Ra'anana, Tiberias, Be'er Sheva, Tzur Natan, Safed), all with phone numbers and no website
- [ ] First leads reviewed and contacted

## Notes

- Claude sessions have direct MCP connectors for **Apify**, **Make**, and **Airtable** — much of this can be built/verified from inside a Claude session.
- `config/` will hold scraper input configs and field mappings as they stabilize.
- **Known gap:** no deduplication yet. Before running repeated/larger scrapes, add a search step in the Make scenario (e.g. Airtable "Search Records" by phone number) with a router to skip existing leads.
- Connections in Make: Airtable OAuth connection `8150090` ("O-I"), Apify API token connection `8149711` ("O-I Apify API Token connection").
