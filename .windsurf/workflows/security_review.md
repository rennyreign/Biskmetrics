---
auto_execution_mode: 0
description: ""
---
# Workflow: Security Review Gate

Required BEFORE implementing:
- Auth / authorization
- PII handling
- Payments / billing
- Elevated external API access
- Encryption / key management

Checklist:
- Input validation
- Least privilege
- Secrets in env or secret manager
- No secrets in logs
- Dependency audit results
- Threat notes (brief)

STOP and request approval before proceeding.