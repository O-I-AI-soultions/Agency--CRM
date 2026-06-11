# Project Log

A running journal of every working session. Newest entries at the top.
Each entry: what was done, decisions made, next steps.

---

## 2026-06-12 — Pipeline wired up: Apify → Make → Airtable

**Done:**
- Discovered that Itay had already built most of the pipeline infrastructure outside this session: Airtable base "O-I-AI-soultions" (`appecLcxk0qS8mNGV`) with table "Lead Tracker" (`tbl9v2Zl9XE8ZByHz`, 14 fields), and a Make.com scenario "Integration Apify" (id `6151519`) with an Apify webhook trigger + dataset-fetch step already connected.
- Completed the Make scenario by adding the missing step: an `airtable:CreateRecordAdvanced` module that creates a Lead Tracker record per scraped place, mapping title→Business Name, phone→Phone Number, city→City, totalScore→Google Rating, website→Website URL, url→Google Maps Link, and a static Lead Source = "Apify Google Maps".
- Activated the Make scenario (it was previously inactive).
- Chose first test niche/city with Itay: **barbers/hairdressers in Kfar Saba & Hod HaSharon, Israel**, using the scraper's built-in `website: "withoutWebsite"` filter.
- Kicked off a small test run of `compass/crawler-google-places` (run id `7HnJnZcKQF7brHYez`, 5 places per search term) to validate the full pipeline end-to-end.
- **Confirmed it works**: the run finished, the Apify webhook fired, the Make scenario executed successfully, and **10 new leads** ("Apify Google Maps" source) landed in the Lead Tracker table — barbershops with phone numbers and no website.
- Updated `pipeline/README.md` checklist to reflect the real current state (Steps 1–4 done, Step 5 mostly done).
- Updated memory (`o-i-business-context.md`) with all the IDs/connections above for future sessions.

**Decisions:**
- First niche/city for testing: barbers in Kfar Saba & Hod HaSharon.
- Used Apify's built-in `website: "withoutWebsite"` filter rather than a separate Make filter step.
- Deduplication is **not yet implemented** — flagged as a known gap before scaling up to larger/repeated scrapes.

**Open items (carried over):**
- Empty duplicate repo `O-I-AI-soultions/O-I` still needs manual deletion via github.com (gh token lacks `delete_repo` scope).
- Add deduplication (Airtable search-by-phone + router) before running larger/repeated scrapes.

**Next steps:**
- Review the first 10 leads and start outreach (Step 5).
- Design and build the deduplication step.
- Note: the test search ("barber shop in <city>, Israel") returned some results outside the named cities (Tiberias, Be'er Sheva, Safed, Tzur Natan) — for tighter geo-targeting on future runs, consider using the actor's dedicated `city`/`countryCode` input fields instead of embedding the location in the search string.
- Start on the web agency templates track once the pipeline is validated.

---

## 2026-06-11 — Project kickoff

**Done:**
- Read the two planning docs (Data Pipeline Building Plan, Web Agency Business Plan) and converted them to markdown in `docs/`.
- Created project structure: CLAUDE.md, README.md, PROJECT_LOG.md, `pipeline/`, `templates/`.
- Set up Claude's persistent memory for this project.
- Installed GitHub CLI (portable, in `%LOCALAPPDATA%\GitHubCLI\bin\gh.exe`), logged in as `sfadiaitay-bit`.
- Found GitHub organization: **O-I-AI-soultions**.
- Created private repo **O-I-AI-soultions/Leads-Pipeline**, pushed initial commit (`main` branch, remote `origin`).

**Decisions:**
- Business name: **O-I**.
- Project docs in English; client-facing content may be Hebrew.
- First focus: the **lead pipeline** (Apify → Make → Airtable).
- One repo per future client site under the GitHub organization.
- Git commit identity: Itay Sfadia <sfadiaitay@gmail.com>.

**Open items:**
- An empty duplicate repo `O-I-AI-soultions/O-I` was accidentally created and could not be deleted (gh token lacks `delete_repo` scope, and `gh auth refresh` kept hanging). Safe to delete manually from github.com Settings whenever convenient.

**Next steps:**
- Pipeline Step 1: confirm free accounts on Apify, Make, Airtable exist.
- Design the Airtable base (Business Name, Phone, Rating, Address, Category, Status, Notes).
- Configure the Apify Google Maps scraper for a first test niche + city.
