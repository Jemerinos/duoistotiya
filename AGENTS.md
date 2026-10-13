# Agent instructions — История вдвоём

## Project purpose
This repository powers a Russian-language world-history and Russian-history learning site: 26 modules and 182 lessons. Treat historical accuracy, understandable Russian prose, image relevance, accessibility, and a working site as equal product requirements.

## Working rules
- Start from the current branch and inspect only the files and project notes relevant to the task. The project state and patch log are useful context for ongoing work; do not blindly follow obsolete historical instructions when newer entries supersede them.
- For non-trivial work, create or use a dedicated branch. Never commit directly to `main` for autonomous tasks.
- Never merge a pull request or publish/deploy changes autonomously. Open/update a PR for review and report its URL, test evidence, and remaining risks.
- Make the smallest coherent change that satisfies the task. Avoid unrelated refactors and duplicate content layers.
- Do not delete or rename curriculum scripts before verifying all references and runtime effects. In particular, `index.html` loads multiple `curriculum-enrichment-*.js` scripts; they are runtime dependencies unless proven otherwise.
- Do not claim a test passed unless you actually ran it and saw a successful exit/result. Distinguish static checks, runtime checks, online smoke tests, manual review, and deployment verification.
- If a command hangs or fails repeatedly, stop retrying the same operation. Record the command, error/last output, attempted recovery, current commit/branch, and the next bounded step in the PR description or project notes. Continue with an alternate smaller check only when safe.
- Work in small batches (normally 3–5 lessons for editorial changes). Save progress through commits or a PR update rather than keeping a large unfinished task only in memory.
- Preserve the current visual language and existing site architecture unless a task explicitly calls for a redesign.
- Never add credentials, access tokens, private data, or secrets to the repository or logs.

## Curriculum content
- Write pupil-facing content in clear, natural Russian. Avoid raw English descriptions, file names, and machine-generated filler.
- A normal historical lesson may target roughly 500–800 words when the topic warrants it; do not pad short methodological or comparison lessons to hit a number.
- Explain historical context, chronology, named actors and their interests, key terms in context, multiple causal links, consequences, and how we know what happened.
- Distinguish established facts from scholarly interpretation and uncertainty. Do not invent dates, quotations, citations, source titles, image identities, or archival details.
- Cite useful, relevant sources close to the claims they support. Prefer primary sources and reputable scholarly/educational sources where appropriate; corroborate contested claims.
- Keep each lesson's questions and answer keys aligned with the actual lesson text.

## Images and media
- Aim for 5–10 useful images per lesson when the available, relevant material supports that count; relevance and quality are more important than filling a quota with unrelated pictures.
- Every pupil-facing image needs a concise Russian caption explaining what is shown and why it matters. Preserve source-file links and available creator/licence information.
- Check date, place, depicted person/event, map legend/geography, provenance, and image rights where applicable. A search result or valid URL is not proof of historical relevance.
- Viewer controls should open the actual selected image at a useful size and provide source information for that same image. Verify fallback behavior and avoid blank layout gaps after failures.

## Validation
Use the checks defined by the repository workflow and inspect their current implementation before relying on them:
- `python .github/scripts/check-site.py`
- `node .github/scripts/check-course.js`
- `node .github/scripts/check-activities.js`
- `python .github/scripts/check-project-logs.py`
- `node .github/scripts/check-images.js`
- JavaScript syntax checks listed in `.github/workflows/pages.yml`
- `node .github/scripts/check-images.js --online` is a network-dependent smoke test; report it separately.
- `node .github/scripts/check-images.js --background-audit` is a longer explicit audit; do not run it as an automatic retry loop.

Run the checks relevant to changed files. For changes affecting the browser, validate the real runtime data/order where possible and sample lessons from early, middle, and late course ranges. A passing CI suite does not prove every historical claim or every image is editorially correct.

## Completion report
Summarize: files changed; user-visible effect; commands actually run and outcomes; checks not run and why; unresolved editorial/factual concerns; branch and PR URL. Update `PATCHLOG.md` and `PROJECT_STATE.md` when work materially changes project state or establishes a new continuation point.
