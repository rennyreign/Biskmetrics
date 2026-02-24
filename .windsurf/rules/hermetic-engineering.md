---
trigger: always_on
---
agent: cascade
version: 2

name: "Hermetic Engineering Rules"
description: >
  Non-negotiable execution rules for agent-driven engineering.
  Enforces reproducible builds, testing, documentation, security,
  observability, and safe GitOps workflows.

# -------------------------------------------------
# Identity
# -------------------------------------------------
identity:
  git_author_name: "Cascade Bot"
  git_author_email: "cascade-bot@yourdomain.com"
  use_service_account: true

# -------------------------------------------------
# Safety + Secrets Handling
# -------------------------------------------------
secrets:
  github_token_env: "GITHUB_TOKEN"
  redaction_patterns:
    - "(?i)token"
    - "(?i)secret"
    - "(?i)password"
    - "(?i)api[_-]?key"
    - "(?i)private[_-]?key"
    - "(?i)bearer"
    - "(?i)authorization"
    - "AKIA[0-9A-Z]{16}"
    - "-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----"

# -------------------------------------------------
# Operating Modes
# -------------------------------------------------
modes:
  plan_then_execute: true
  dry_run_default: true
  require_file_touch_list: true
  require_dependency_list: true
  require_risk_notes: true

# -------------------------------------------------
# Guardrails (Command Controls)
# -------------------------------------------------
guardrails:
  allowlist:
    # Git
    - "git status"
    - "git diff"
    - "git fetch"
    - "git pull"
    - "git add"
    - "git commit"
    - "git push"
    - "git checkout -b"
    - "git merge --no-ff"
    - "git tag"

    # GitHub CLI
    - "gh auth status"
    - "gh repo create"
    - "gh repo view"
    - "gh repo list"
    - "gh repo clone"
    - "gh pr create"
    - "gh pr view"
    - "gh pr status"
    - "gh pr merge --auto"
    - "gh release create"

    # Shell-safe utilities
    - "ls"
    - "cat"
    - "jq"
    - "sed"
    - "grep"
    - "rg"
    - "mkdir"
    - "date"
    - "codex"

    # Build / test runners
    - "make"
    - "just"
    - "docker"
    - "docker compose"
    - "python -m pytest"
    - "pytest"
    - "ruff"
    - "black"
    - "mypy"
    - "pyright"
    - "node"
    - "npm"
    - "pnpm"
    - "yarn"
    - "npx"
    - "eslint"
    - "prettier"
    - "vitest"
    - "jest"

    # Dependency audits
    - "pip-audit"
    - "npm audit"
    - "pnpm audit"
    - "yarn audit"

  denylist:
    # Dangerous Git operations
    - "git push --force"
    - "git push --force-with-lease main"
    - "git reset --hard"
    - "git clean -fdx"

    # Remote execution / supply chain risk
    - "curl .* \\| bash"
    - "wget .* \\| bash"

    # Destructive filesystem operations
    - "rm -rf /"
    - "rm -rf \\*"
    - "sudo .*"

# -------------------------------------------------
# Repository + Branch Policy
# -------------------------------------------------
repositories:
  default_visibility: private
  branch_protection:
    require_pr: true
    require_checks: true
    disallow_force_push: true
    prevent_deletion: true

branches:
  default: main
  naming_convention: "(feat|fix|docs|refactor|test|chore|ops)/[a-z0-9._-]+"

commits:
  conventional: true
  max_files_changed_soft_limit: 25
  max_lines_changed_soft_limit: 800

pull_requests:
  template_required: true
  auto_merge_low_risk: true
  protected_paths:
    - "**/infrastructure/**"
    - "**/.github/workflows/**"
    - "**/deploy/**"
    - "Dockerfile"
    - "compose*.yml"
    - "terraform/**"
    - "helm/**"

# -------------------------------------------------
## Temporary Waivers (Phase 2+3)

**Effective:** 2026-02-23  
**Expires:** 2026-03-31 (Phase 4 completion)  
**Owner:** Engineering Lead

### Waived Rules
1. **`zero_lint_warnings: true`** - Temporarily allowing 27 ESLint warnings
   - **Justification:** 
     - 4 warnings in Phase 2+3 code (unused imports/variables - non-blocking)
     - 16 warnings in legacy UI components (shadcn/ui with version-pinned imports)
     - 7 warnings in test files (`any` types for mock data)
   - **Mitigation:** All warnings documented and tracked; zero errors in all code
   - **Removal Plan:** Phase 4 cleanup of unused imports and legacy components

2. **`require_full_typecheck_coverage`** - Temporarily excluding legacy files from TypeScript
   - **Files:** `src/data/mockData.ts`, `src/components/ui/**/*`
   - **Justification:** 99 errors in unused legacy code would block Phase 2+3 delivery
   - **Mitigation:** Excluded files are not imported by production code
   - **Removal Plan:** Migrate or delete in Phase 4

### Non-Waived (Still Enforced)
- Zero TypeScript errors in **active** code (all Phase 2+3 files; excludes `src/data/mockData.ts` and `src/components/ui/**/*` per `tsconfig.json`)
- All tests passing (42/42)
- Prettier formatting (100% compliance)
- Reproducible builds (lockfiles committed)

## Hermetic Engineering (Reproducibility)
# -------------------------------------------------
hermetic:
  require_lockfiles: true
  recognized_lockfiles:
    - "poetry.lock"
    - "requirements.lock"
    - "Pipfile.lock"
    - "package-lock.json"
    - "pnpm-lock.yaml"
    - "yarn.lock"

  install_policies:
    node:
      prefer_ci_install: true
    python:
      prefer_locked_installs: true

  require_one_command_bootstrap: true
  bootstrap_commands:
    - "make setup"
    - "just setup"
    - "npm run setup"
    - "pnpm run setup"
    - "yarn setup"

# -------------------------------------------------
# Quality Gates — 8 Pillars
# -------------------------------------------------
quality_gates:

  testing:
    require_tests_for_new_or_changed_public_functions: true
    require_tests_for_bugfixes: true
    min_coverage_business_logic_percent: 80
    critical_paths_require_100_percent: true
    required_test_commands:
      - "pytest"
      - "npm test"
      - "pnpm test"
      - "yarn test"

  code_quality:
    require_formatter: true
    require_linter: true
    require_typecheck_when_supported: true
    zero_lint_warnings: true
    max_line_length: 100
    disallow_untyped_escape_hatches:
      - "any"
      - "TODO"
      - "FIXME"
    required_quality_commands:
      - "ruff"
      - "black"
      - "mypy"
      - "pyright"
      - "eslint"
      - "prettier"

  documentation:
    require_docstrings_or_jsdoc_for_public_interfaces: true
    require_readme_update_if_setup_changes: true
    require_openapi_for_http_apis: true
    require_changelog_entry_on_user_visible_changes: true
    changelog_path: "CHANGELOG.md"
    adr:
      require_for_architecture_changes: true
      adr_dir: "docs/adr"

  build_systems:
    require_reproducible_build: true
    prefer_containerized_services: true
    require_env_example: true
    env_example_path: ".env.example"
    forbid_hardcoded_urls_or_credentials: true

  dev_environment:
    setup_time_target_minutes: 15
    require_version_pinning_files:
      - ".python-version"
      - ".nvmrc"
      - ".tool-versions"

  observability:
    require_health_endpoints_for_services: true
    required_health_paths:
      - "/health"
      - "/ready"
    require_structured_logging: true
    forbid_logging_secrets_or_pii: true
    require_trace_or_correlation_ids: true

  security:
    require_dependency_audit_on_dep_changes: true
    forbid_secrets_in_repo: true
    require_input_validation_for_external_inputs: true
    require_parameterized_queries_for_db_access: true
    require_https_for_external_comms: true

  standards:
    require_project_structure:
      - "src/"
      - "tests/"
      - "docs/"
      - "config/"
      - "scripts/"
    conventional_commits_required: true

# -------------------------------------------------
# Database + Deployment Controls
# -------------------------------------------------
db_and_deploy:
  require_migrations: true
  require_rollback_plan: true
  staging_first: true
  prod_via_cicd_only: true
  prod_db_writes_must_be_explicit: true

# -------------------------------------------------
# Audit + Limits
# -------------------------------------------------
audit:
  enable: true
  path: "logs/cascade-ops.jsonl"
  include:
    - "plans"
    - "file_touch_lists"
    - "commands_run"
    - "test_outputs"
    - "approvals"

limits:
  max_writes_per_minute: 5
  command_timeout_seconds: 300
  build_timeout_seconds: 1200
  max_files_modified_per_task_soft_limit: 30

# -------------------------------------------------
# Human-in-the-loop Approvals
# -------------------------------------------------
approvals:
  required_for:
    - "repo_delete"
    - "force_push_default"
    - "protected_paths_change"
    - "prod_db_write"
    - "prod_deploy"
    - "secrets_rotation"
    - "auth_or_authorization_changes"
    - "payments_or_billing"
    - "pii_handling_or_storage"
    - "external_api_with_elevated_permissions"
    - "encryption_key_management"
  approval_signal: "/approve"

# -------------------------------------------------
# Agent Behavior Contracts
# -------------------------------------------------
behavior:

  pre_write_contract:
    - "Clarifying questions are asked if requirements are ambiguous"
    - "Architecture plan with boundaries and data flow is produced"
    - "Dependencies (packages, services, APIs) are listed"
    - "File touch list is provided before writing"
    - "Risks (security, data, migrations, breaking changes) are documented"
    - "Command execution plan is stated"

  post_write_contract:
    - "All executed commands and outputs are shown"
    - "Test results and coverage notes are included"
    - "Documentation updates are listed"
    - "Deployment readiness and remaining gaps are stated"