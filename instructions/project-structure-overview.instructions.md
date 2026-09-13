---
description: "Use when needing a project structure overview, locating modules quickly, or deciding where to implement backend changes"
applyTo: "**"
---

# Project Structure Overview

This instruction describes top-level folders (1 level) to help quickly identify where to read or modify code.

## Root Folders (1 Level)
- API/
- Test/
- ThirdParty/
- config/
- configFiles/
- cron/
- document/
- images/
- openssl/
- running/
- sqlscript/
- uploads/
- utils/

## Quick Orientation

- API/: Main business modules, route/manager/model patterns, and endpoint logic.
- ThirdParty/: Integrations with external services and partner APIs.
- Test/: Test suites and test helpers.
- config/ + configFiles/: Runtime settings and environment-specific configuration.
- cron/: Scheduled and background task definitions.
- document/: API docs and project documentation assets.
- utils/: Shared utility helpers across modules.
- uploads/ + images/: Runtime uploaded files and static image assets.
- sqlscript/: Database SQL scripts and migration-related files.
