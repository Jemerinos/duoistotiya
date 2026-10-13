from pathlib import Path
import re

root = Path(".")
html = (root / "index.html").read_text(encoding="utf-8")
if not (root / "PATCHLOG.md").is_file() or not (root / "PROJECT_STATE.md").is_file():
    raise SystemExit("Persistent patch log and project recovery state are required")

if 'PATCH-002' not in (root / "PATCHLOG.md").read_text(encoding="utf-8"):
    raise SystemExit("PATCHLOG.md is missing the current image-audit patch")

for script in (
    "curriculum.js", "curriculum-details-01.js", "curriculum-details-02.js",
    "curriculum-details-03.js", "curriculum-details-04.js", "curriculum-depth.js",
    "curriculum-details-apply.js", "curriculum-enrichment-01.js",
    "curriculum-enrichment-02.js", "curriculum-enrichment-03.js",
    "curriculum-enrichment-04.js", "curriculum-visuals.js",
    "curriculum-research.js", "curriculum-enrichment-apply.js",
    "curriculum-participants.js", "curriculum-participant-sources.js",
    "curriculum-glossary.js"
):
    if f'<script src="{script}"></script>' not in html:
        raise SystemExit(f"index.html must load {script}")
    if not (root / script).is_file():
        raise SystemExit(f"index.html references missing script: {script}")

script_order = [
    "curriculum.js", "curriculum-details-01.js", "curriculum-details-02.js",
    "curriculum-details-03.js", "curriculum-details-04.js", "curriculum-depth.js",
    "curriculum-details-apply.js", "curriculum-enrichment-01.js",
    "curriculum-enrichment-02.js", "curriculum-enrichment-03.js",
    "curriculum-enrichment-04.js", "curriculum-visuals.js",
    "curriculum-research.js", "curriculum-enrichment-apply.js",
    "curriculum-participants.js", "curriculum-participant-sources.js", "curriculum-glossary.js"
]
script_positions = [html.index(f'<script src="{name}"></script>') for name in script_order]
if script_positions != sorted(script_positions):
    raise SystemExit("Course scripts are loaded in the wrong dependency order")

inline_scripts = re.findall(r"<script>(.*?)</script>", html, re.S)
if not inline_scripts:
    raise SystemExit("No inline JavaScript found")
Path("/tmp/site-inline.js").write_text(inline_scripts[-1], encoding="utf-8")

ids = re.findall(r'\bid="([^"]+)"', html)
duplicates = sorted({item for item in ids if ids.count(item) > 1})
if duplicates:
    raise SystemExit("Duplicate HTML IDs: " + ", ".join(duplicates))

referenced = set(re.findall(r'el\("([A-Za-z0-9_-]+)"\)', html))
missing = sorted(referenced - set(ids))
if missing:
    raise SystemExit("Missing DOM IDs: " + ", ".join(missing))

method = re.search(r'<div class="method">(.*?)</div>\s*<div class="sectionhead">', html, re.S)
minutes = [int(value) for value in re.findall(r'<span class="minutes">(\d+)\s+МИН</span>', method.group(1) if method else "")]
if minutes != [5, 10, 15, 10, 10] or sum(minutes) != 50:
    raise SystemExit("Daily schedule must remain 50 minutes: " + repr(minutes))

required = [
    'id="epochBackgroundImage"', 'id="viewPageBackground"', 'loadEpochBackground(current())', 'function loadEpochBackground(l)', 'function handleTopicImageError(l,fromCommons)',
    'img.dataset.sourcePage=source', 'collected.slice(0,3)', 'reader-gallery-meta',
    'id="imageViewerImage"', 'id="imageViewerClose"', 'data-source-page',
    'id="openGlossary"', 'id="glossaryOverlay"', 'id="glossaryDialog"',
    'aria-modal="true"', 'data-glossary-term', 'Открыть в глоссарии',
    'curriculum-glossary.js', 'curriculum-participants.js', 'curriculum-participant-sources.js',
    'participant-sources-title', 'participant-source-note', 'Источники к биографическим сведениям',
    'id="lessonDepth"', 'id="depthPeople"', 'id="depthCausality"', 'id="depthChronology"',
    'id="knowledgeCheck"', 'Проверка знаний · 5 вопросов',
    'function describeHistoricalImage(l,rawTitle,metadata,kind)', 'Фукидид',
'<details class="supplemental-panel"',
    '--green:#6D28D9', '--ink:#111827', 'mobileNavToggle',
    'function quickQuizSet(l)', 'function examQuestionSet(l)'
]
for token in required:
    if token not in html:
        raise SystemExit("Missing feature: " + token)

for stale in ['Название файла в каталоге', 'Название файла:', 'Имя файла', 'Иллюстрация к уроку «']:
    if stale in html:
        raise SystemExit("Obsolete generic/file caption remains: " + stale)

if html.index('id="knowledgeCheck"') < html.index('id="reader"'):
    raise SystemExit("Knowledge check must follow the lesson reading")

if "glossary-dialog" not in html or "@media(max-width:700px)" not in html:
    raise SystemExit("Glossary dialog or mobile layout is missing")

# Supplemental lesson files must never sit in the repository unused: either load
# them explicitly on the page (and test their application) or remove them.
orphaned_enrichment = sorted(
    path.name for path in root.glob("curriculum-enrichment-*.js")
    if f'<script src="{path.name}"></script>' not in html
)
if orphaned_enrichment:
    raise SystemExit(
        "Unconnected lesson enrichment files are not shown on the site: "
        + ", ".join(orphaned_enrichment)
        + ". Integrate and test them, or remove them instead of treating them as delivered."
    )

print(f"Site structure OK: {len(ids)} unique IDs; 50-minute lesson; epoch banner, depth blocks and one five-question check.")
