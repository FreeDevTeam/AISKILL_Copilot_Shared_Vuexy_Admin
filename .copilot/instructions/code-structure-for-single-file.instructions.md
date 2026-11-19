---
description: Use when implementing code for any files
---

# SINGLE-FILE CODE ANATOMY & TOP-DOWN SEQUENCE SPECIFICATION

## 1. CORE DIRECTIVE
This standard dictates the EXACT TOP-TO-BOTTOM ORDER OF CODE INSIDE A SINGLE REACT FILE (from line 1 to the end of the file). 
This is NOT a directory/folder structure. Do NOT mix, reorder, or scatter statements inside the file.

## 2. IN-FILE TOP-DOWN LAYOUT (LINE-BY-LINE SEQUENCE)

From top to bottom inside the file, the code MUST follow this precise order:

  1. IMPORTS SECTION (Top of the file)
     - 1.1. Third-party libraries (React, React Router, UI libraries)
     - 1.2. Internal Components
     - 1.3. Services, APIs, Constants, Helpers
     - 1.4. Stylesheets (.scss, .css)

  2. COMPONENT DECLARATION & LOCAL STATES
     - Hooks (`useHistory`, `useParams`, etc.)
     - State definitions (`useState`, `useReducer`, `useRef`)

  3. PURE HELPER FUNCTIONS
     - Formatters, mapping logic, utility functions (no API calls, no side effects)

  4. API CALLS & EVENT HANDLERS
     - Async functions calling services (`getData`, `handleDelete`)
     - User interaction handlers (`handleClick`, `handlePaginations`)

  5. SIDE EFFECTS (`useEffect`)
     - MUST be placed AFTER the API/Event handlers it calls to preserve readable flow

  6. UI/TABLE CONFIGURATIONS
     - Column definitions (e.g., `serverSideColumns`), form schemas

  7. SUB-RENDER FUNCTIONS
     - Small UI rendering helpers (e.g., `renderPagination()`, `CustomPaginations`)

  8. MAIN JSX RETURN STATEMENT
     - The primary JSX tree returned by the component

  9. EXPORT STATEMENT (Bottom of the file)

## 3. STRICT IN-FILE RULES
- ALWAYS add numbered comment block dividers inside the file (e.g., `// 1. IMPORTS`, `// 2. HOOKS & STATES`).
- NEVER place a `useEffect` above the API handler functions it executes.
- NEVER interleave helper functions or state variables throughout the file body. Keep them strictly in their designated sections.