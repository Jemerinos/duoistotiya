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
    "Критерии готовности",
    "Исполнение",
]
required_state = [
    "# Состояние проекта",
    "Jemerinos/duoistotiya",
    "content-research-pass-1",
    "https://github.com/Jemerinos/duoistotiya/pull/1",
    "Рецепт восстановления после перезапуска",
    "Следующая задача",
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
print("Project recovery logs OK: patch algorithm, active patch, current branch/PR, criteria and next task are documented.")
