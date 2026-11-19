---
description: Guidelines for using API requests in project
applyTo: **/*.js
---

- Must call <ModuleName>ServiceAPI.js for all API requests. Example: AppUser/Login then use AppUserServiceAPI.js. If URL Path exists but in another files that not match, then move and replace all occurrences with the correct service API file.
- Do not make direct API calls outside of the service API files.
- Ensure that all API request functions are properly named and follow the naming convention: `<action><ModuleName>`. Example: `loginAppUser`, `getAppUserDetails`.
- All API request functions should return a promise and handle errors appropriately within the service API file.
- Body request, do not send "" (empty) or undefined values, instead remove these keys with empty / undefined values before sending the request.