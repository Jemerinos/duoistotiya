from pathlib import Path
import re

root = Path(".")
html = (root / "index.html").read_text(encoding="utf-8")
for script in ("curriculum.js", "curriculum-depth.js", "curriculum-research.js"):
    if f'<script src="{script}"></script>' not in html:
        raise SystemExit(f"index.html must load {script}")

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
    'id="epochBackgroundImage"', 'function loadEpochBackground(l)',
    'id="lessonDepth"', 'id="depthPeople"', 'id="depthCausality"', 'id="depthChronology"',
    'id="knowledgeCheck"', 'Проверка знаний · 5 вопросов',
    'function describeHistoricalImage(l,rawTitle,metadata,kind)', 'Фукидид',
    'Почему это важно для урока:', '<details class="supplemental-panel"',
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

print(f"Site structure OK: {len(ids)} unique IDs; 50-minute lesson; epoch banner, depth blocks and one five-question check.")
