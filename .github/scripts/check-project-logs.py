from pathlib import Path

root = Path(__file__).resolve().parents[2]
log = (root / "PATCHLOG.md").read_text(encoding="utf-8")
state = (root / "PROJECT_STATE.md").read_text(encoding="utf-8")
readme = (root / "README.md").read_text(encoding="utf-8")

required_log = [
    "# Журнал патчей проекта",
    "## Рабочий алгоритм",
    "## PATCH-001",
    "## PATCH-002",
    "## PATCH-013",
    "## PATCH-014",
    "## PATCH-015",
    "## PATCH-016",
    "## PATCH-017",
    "План исправлений",
    "Критерии готовности",
]
required_state = [
    "# Состояние проекта",
    "Jemerinos/duoistotiya",
    "## Рабочая точка — повторная проверка 2026-10-19",
    "## Последний статус проекта",
    "## Текущее состояние по слоям",
    "## Итоги пяти этапов аудита",
    "## Открытые границы аудита",
    "## Следующий шаг",
    "## Архив исторических снимков (не текущий статус)",
]
for item in required_log:
    if item not in log:
        raise SystemExit("PATCHLOG.md is missing required section: " + item)
for item in required_state:
    if item not in state:
        raise SystemExit("PROJECT_STATE.md is missing recovery information: " + item)
if "PATCHLOG.md" not in readme or "PROJECT_STATE.md" not in readme:
    raise SystemExit("README.md must point contributors to both durable project context files")

# The active recovery summary is only the text before the explicitly marked archive.
archive_marker = "## Архив исторических снимков (не текущий статус)"
if state.count(archive_marker) != 1:
    raise SystemExit("PROJECT_STATE.md must have one explicit historical archive boundary")
active_state = state.split(archive_marker, 1)[0]
for item in (
    "449f6baff5d0c9e19368f33d449be5d212536562",
    "39309960292",
    "a004a33ba67061e223cc8d383aba53dd53d3eaf3",
    "39315175377",
    "Publish validated site",
    "четыре обязательные проверки",
    "Не проведён построчный факт-чек",
):
    if item not in active_state:
        raise SystemExit("Active recovery summary is missing current audit evidence: " + item)
for stale in (
    "content-research-pass-1",
    "Draft PR #1",
    "Не сливать Draft PR и не публиковать Pages без отдельного решения",
    "39308129397",
    "HEAD main до заключительного документационного закрытия",
    "audit-critical-fixes-20261019",
    "пока изменения не объединены",
    "PR и post-merge Pages ожидаются",
):
    if stale in active_state:
        raise SystemExit("Stale historical status leaked into active recovery summary: " + stale)

workflow_path = root / ".github" / "workflows" / "pages.yml"
workflow = workflow_path.read_text(encoding="utf-8")
media_start = workflow.find("  validate-media:")
gallery_start = workflow.find("  audit-gallery:")
background_start = workflow.find("  audit-backgrounds:")
deploy_start = workflow.find("  deploy:")
if min(media_start, gallery_start, background_start, deploy_start) < 0:
    raise SystemExit("Workflow must define validation, separate manual audits, and deploy jobs.")
if "--lesson-audit=" in workflow[media_start:gallery_start]:
    raise SystemExit("Publish validation must not depend on the rate-limited lesson gallery audit.")
gallery_job = workflow[gallery_start:background_start]
if "if: github.event_name == 'workflow_dispatch'" not in gallery_job or "--lesson-audit=7-9" not in gallery_job:
    raise SystemExit("Lessons 7–9 live gallery audit must remain a manual workflow-dispatch job.")
background_job = workflow[background_start:deploy_start]
if "if: github.event_name == 'workflow_dispatch'" not in background_job or "--background-audit" not in background_job:
    raise SystemExit("Full background image audit must remain a manual workflow-dispatch job.")
deploy_job = workflow[deploy_start:]
for prerequisite in ("validate-site", "validate-course", "validate-activities", "validate-media"):
    if prerequisite not in deploy_job.split("steps:", 1)[0]:
        raise SystemExit("Publish job must depend on required check: " + prerequisite)

current_audit = log.split("## PATCH-017", 1)[1].split("\n## ", 1)[0] if "## PATCH-017" in log else ""
for item in (
    "✅ исправлено",
    "39315022401",
    "39315175377",
    "a004a33ba67061e223cc8d383aba53dd53d3eaf3",
    "Publish validated site",
    "Историческая точность 182 текстов",
):
    if item not in current_audit:
        raise SystemExit("PATCHLOG.md is missing final audit evidence: " + item)
if "План исправлений" not in current_audit or "Критерии закрыты" not in current_audit:
    raise SystemExit("PATCHLOG.md must preserve the plan and completion criteria for the current audit.")

print("Project recovery checks OK: active state is current, stale history is archived, and manual media audits do not block the standard publish gate.")
