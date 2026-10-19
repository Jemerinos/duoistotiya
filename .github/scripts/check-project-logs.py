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
    "Критерии готовности",
    "Исполнение",
]
required_state = [
    "# Состояние проекта",
    "Jemerinos/duoistotiya",
    "## Рабочая точка",
    "## Последний статус проекта",
    "Рабочая ветка",
    "Итоги пяти этапов аудита",
    "Открытые границы аудита",
    "Следующий шаг",
]
for item in required_log:
    if item not in log:
        raise SystemExit("PATCHLOG.md is missing required section: " + item)
for item in required_state:
    if item not in state:
        raise SystemExit("PROJECT_STATE.md is missing recovery information: " + item)
if "PATCHLOG.md" not in readme or "PROJECT_STATE.md" not in readme:
    raise SystemExit("README.md must point contributors to both durable project context files")
if "Статус:" not in log or "Статус:" not in state and "Текущее состояние" not in state:
    raise SystemExit("Patch log or recovery state has no explicit status/context")

workflow_path = root / ".github" / "workflows" / "pages.yml"
workflow = workflow_path.read_text(encoding="utf-8")
media_start = workflow.find("  validate-media:")
gallery_start = workflow.find("  audit-gallery:")
background_start = workflow.find("  audit-backgrounds:")
if min(media_start, gallery_start, background_start) < 0:
    raise SystemExit("Workflow must separate stable media smoke test and manual gallery audit.")
if "--lesson-audit=" in workflow[media_start:gallery_start]:
    raise SystemExit("Publish validation must not depend on the rate-limited lesson gallery audit.")
gallery_job = workflow[gallery_start:background_start]
if "if: github.event_name == 'workflow_dispatch'" not in gallery_job or "--lesson-audit=7-9" not in gallery_job:
    raise SystemExit("Lessons 7–9 live gallery audit must remain available as a manual workflow-dispatch job.")

for item in (
    "HEAD main на старте заключительной регрессии",
    "Publish validated site",
    "39308129397",
    "Итоги пяти этапов аудита",
    "Открытые границы аудита",
):
    if item not in state:
        raise SystemExit("PROJECT_STATE.md is missing current audit evidence: " + item)

if "**Статус:** в работе; заключительный PR." not in log:
    raise SystemExit("PATCHLOG.md must mark final regression as in progress until its CI and deploy are confirmed.")

print("Project recovery logs OK: current audit, source-of-truth limits and deployment evidence are documented.")
