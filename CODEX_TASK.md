# Codex continuation task — История вдвоём

## Purpose
Continue improving the existing Russian-language history-learning website in small, verifiable batches. This file is the active task brief; `AGENTS.md` remains the permanent project policy.

## Before editing
1. Read `AGENTS.md`, `PROJECT_STATE.md`, and the latest entries in `PATCHLOG.md`.
2. Inspect the current branch, working tree, latest commit, and open PR before writing. Reuse the active project branch/PR when appropriate; do not start duplicate work.
3. Inspect `index.html`, loaded curriculum scripts, the relevant lesson data, and the current tests before changing behavior.
4. Treat existing curriculum enrichment scripts as runtime dependencies until their references and effects have been verified.

## Current priorities (in this order)
1. **Keep the site stable.** Run the relevant repository checks before and after changes. If a command hangs or fails twice, stop repeating it; record the exact failure and move to a smaller independent check.
2. **Remove unintended English from the learner-facing interface.** Search the rendered UI and relevant HTML/JS/CSS for English labels, buttons, placeholders, errors, accessibility labels, and machine-facing text that leaks to learners. Preserve English only where appropriate for proper names, original historical terms, source titles, or technical identifiers. Fix the underlying source, not just one screenshot/string. Add or update checks where practical.
3. **Improve lesson texts.** Work in batches of 3–5 lessons. Add accurate dates, named people/groups, definitions of important terms, context, more than one causal factor where historically appropriate, and consequences. Keep questions and answers aligned with the lesson. Verify factual claims against reliable sources and add source references close to claims. Do not invent facts or pad text mechanically.
4. **Improve lesson imagery.** Aim for 5–10 relevant images per lesson when reliable, usable material exists. Six is a display cap/target in the current gallery work, not a guarantee that six valid images exist. Give every learner-facing image a natural Russian caption explaining its relevance. Check image identity, chronology, location, attribution/licence, and source metadata. Never fill a gallery with unrelated images to hit a number.
5. **Verify image enlargement and page background.** Clicking a gallery image should open that exact image in a usable large viewer/lightbox with working close/next/previous behavior as supported and clear source information. Audit the background treatment for a more welcoming, less empty page without reducing readability, contrast, responsiveness, or performance. Do not rebuild features that already work.
6. **Update project records.** For material changes, append a concise entry to `PATCHLOG.md` and update `PROJECT_STATE.md` with what changed, what was tested, and what remains.

## Safe execution protocol
- Start with a short plan and identify the first small batch. Avoid broad rewrites across all lessons in one operation.
- Make one coherent change at a time and create a checkpoint commit after each successful batch.
- After a change, run the checks relevant to the files touched, including the repository's applicable course, activity, site, project-log, image, and JavaScript syntax checks. Inspect the workflow definitions to confirm exact commands.
- Where possible, test representative lessons from early, middle, and late parts of the course; distinguish automated checks from manual editorial review and network-dependent checks.
- If a tool or task runner becomes stuck, do not restart the same full operation repeatedly. Capture the current branch, commit SHA, command, last output, completed work, and the next bounded step in the PR or project notes.
- Do not claim tests passed unless the successful result was observed.
- Do not commit directly to `main`, merge a PR, or deploy/publish without the user's explicit instruction.
- Keep the existing architecture and avoid adding duplicate enrichment layers, generated files, dependencies, or broad refactors unless required and justified.

## First recommended work session
1. Inspect the current PR and wait for/verify its CI status; do not assume a pending run passed.
2. Run a focused audit for learner-visible English and identify the exact files and strings responsible. Fix a small coherent set and add regression checks.
3. Validate the changes, record the results, and report the branch/PR, checks actually run, unresolved issues, and the next specific batch.

## Completion report format
- **Changed:** files and user-visible effects.
- **Validated:** exact commands and observed outcomes.
- **Not validated:** checks skipped, with reasons.
- **Remaining:** known risks and next bounded task.
- **Checkpoint:** branch, commit SHA, and PR URL.

## Important current-state caveats
- The gallery cap was raised to six results, but some lessons may have fewer than six relevant/valid images.
- A full audit of Russian captions, image relevance, and historical image identity is still needed.
- Comprehensive lesson-text expansion and learner-facing English cleanup remain outstanding until verified as completed.
- The existence of a PR or a successful static check does not mean changes are merged, deployed, or fully editorially reviewed.
