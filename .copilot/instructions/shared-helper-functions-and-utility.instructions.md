---
description: Shared helper functions and utility functions for the project. 
applyTo: **/*.js
---

DO NOT generate inline utility functions for data formatting, calculation, or manipulation within UI components or business logic files. 

You MUST always import existing shared functions from the helper functions.

Add more helper functions to the appropriate utility files as needed. New utility files should follow the same naming convention and structure. Each utility function MUST NOT exceed more than 20 lines.

**Helper Directory Structure & Responsibilities:**
- `helper/UtilsFunctionsString.js`: contain all helper functions for string manipulation and formatting.
- `helper/UtilsFunctionsArrayString.js`: contain all helper functions for array of strings manipulation.
- `helper/UtilsFunctionsArrayObject.js`: contain all helper functions for array of objects manipulation.
- `helper/UtilsFunctionsNumber.js`: contain all helper functions for number manipulation and formatting.
- `helper/UtilsFunctionsObject.js`: contain all helper functions for object manipulation and formatting.
- `helper/UtilsFunctionsDate.js`: contain all helper functions for date and time manipulation and formatting.
- `helper/UtilsFunctionsValidation.js`: contain all helper functions for form validation and regex checks (email, phone, patterns).

These helper functions are not contain specific business logic. They should be generic and reusable across different parts of the project.