---
auto_execution_mode: 0
description: "AI-powered code review at end of session"
---
# Workflow: Code Review (AI-Powered)

Use this workflow at the end of each coding session to perform a comprehensive code review using GPT-4 or o1 reasoning model.

## When to Run

- After implementing new features
- After significant refactoring
- Before committing code
- At end of coding session

## Step 1 — Identify Changed Files

List all files modified in this session:

```bash
git status
git diff --name-only
```

## Step 2 — Prepare Review Context

For each changed file, gather:
- File purpose and responsibility
- Changes made (git diff)
- Related test files
- Dependencies affected

## Step 3 — AI Code Review

**Start a NEW context window** with Windsurf's reasoning model.

**Recommended models in Windsurf:**
- **GPT-5.2 High Reasoning** (Best for thorough code review - deepest analysis)
- **GPT-5.2 Medium Reasoning** (Balanced speed and depth)
- **GPT-5.2 Low Reasoning** (Faster, still effective)
- **Claude Sonnet 4.5** (Excellent alternative, very fast)
- **GPT-5.1** (Good for quick reviews)

Provide the AI reviewer with:

```
You are an expert code reviewer for the ADX Agents project.

PROJECT CONTEXT:
- Building autonomous AI agents (ORDAE framework)
- Python 3.11, LangGraph, LangChain, Flask, PostgreSQL
- Hermetic engineering standards (see below)
- 80% test coverage required
- Zero lint warnings required

HERMETIC STANDARDS:
- Reproducible builds
- Tests for all new code
- Type hints required
- Docstrings for public functions
- Security-first mindset
- No secrets in code

FILES TO REVIEW:
[Paste git diff output here]

REVIEW CHECKLIST:
1. Code Quality
   - Clean, readable code
   - Proper error handling
   - Type hints present
   - Docstrings complete

2. Security
   - No hardcoded secrets
   - Input validation
   - SQL injection prevention
   - No sensitive data in logs

3. Testing
   - Tests written for new code
   - Edge cases covered
   - Mocks used appropriately

4. Architecture
   - Follows ORDAE specification
   - Module boundaries respected
   - Dependencies appropriate

5. Performance
   - No obvious bottlenecks
   - Database queries optimized
   - Caching where appropriate

6. Hermetic Compliance
   - Reproducible
   - Documented
   - Version pinned

Please provide:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (nice to have)
- Praise (what's done well)
```

## Step 4 — Document Review Results

Create or update `docs/code-reviews/session-[date].md`:

```markdown
# Code Review - Session [Date]

## Files Reviewed
- file1.py
- file2.py

## Critical Issues
- [ ] Issue 1: Description
- [ ] Issue 2: Description

## Warnings
- [ ] Warning 1: Description

## Suggestions
- Suggestion 1
- Suggestion 2

## Positive Feedback
- What was done well

## Action Items
- [ ] Fix critical issue 1
- [ ] Address warning 1
```

## Step 5 — Address Critical Issues

Before committing:
- Fix all critical issues
- Address warnings if time permits
- Log suggestions for future refactoring

## Step 6 — Run Quality Checks

```bash
make lint      # Ruff linter
make format    # Black formatter
make typecheck # Mypy type checker
make test      # Pytest with coverage
```

All must pass before commit.

## Step 7 — Update Session Notes

Add code review summary to `plan/end-of-session.md`:

```markdown
## Code Review Summary
- Files reviewed: X
- Critical issues: Y (all fixed)
- Warnings: Z
- Test coverage: N%
```

---

## AI Reviewer Prompt Template

Copy this template for the AI review:

```
ROLE: Expert Python code reviewer for ADX Agents project

CONTEXT:
- Autonomous AI agent framework (ORDAE)
- Hermetic engineering standards
- Security-critical application
- Production-grade requirements

FILES:
[Paste git diff]

REVIEW FOCUS:
1. Security vulnerabilities
2. Code quality and maintainability
3. Test coverage
4. Architecture compliance
5. Performance concerns

OUTPUT FORMAT:
## Critical Issues (Must Fix)
- [Issue with severity and location]

## Warnings (Should Fix)
- [Warning with recommendation]

## Suggestions (Nice to Have)
- [Improvement idea]

## Strengths
- [What's done well]

Be thorough but concise. Prioritize security and correctness.
```

---

## Tips for Effective AI Review

1. **Use GPT-5.2 High Reasoning** for critical/complex code reviews
2. **Use GPT-5.2 Medium Reasoning** for regular reviews (good balance)
3. **Use GPT-5.2 Low Reasoning** for quick checks
4. **Provide full context** - include specs and architecture docs
5. **Be specific** - paste actual code diffs, not summaries
6. **Iterate** - ask follow-up questions on unclear issues
7. **Document** - save review results for future reference

---

## Integration with End Session Workflow

Add this step to `/end_session` workflow:

**Between Step 3 and Step 4:**

```markdown
## Step 3.5 — AI Code Review (if code was written)

If code was written this session:
- Run `/code_review` workflow
- Address critical issues
- Document review results
- Update quality metrics
```

---

**Goal**: Catch issues early, maintain code quality, learn from AI feedback.
