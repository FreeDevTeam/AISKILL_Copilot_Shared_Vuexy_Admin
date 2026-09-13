# Function Declaration Convention

## Rule
All functions must follow these rules:
1. Use function declaration for named functions
2. Do NOT use arrow function for named functions
3. Do NOT use object destructuring in function parameters
4. Always declare parameters explicitly

## ❌ Not allowed

### Arrow function for named function
const getDescriptionAutoNotifyViolation = (a, b) => {}

### Destructuring in parameters
const getDescriptionAutoNotifyViolation = ({
  title,
  subtitle,
  vehicleCount
}) => {}

### Combining both violations
const getDescriptionAutoNotifyViolation = ({
  title,
  subtitle,
  vehicleCount
}) => {}

---

## ✅ Required

function getDescriptionAutoNotifyViolation(
  title,
  subtitle,
  vehicleCount,
  price,
  usageDate,
  customerGroup,
  benefits
) {
  // logic here
}

---

## Scope
- Applies to all business logic functions
- Applies to service, controller, helper, utils

---

## Exception

### Allow arrow function for inline callbacks
list.map(item => item.id);

### Allow destructuring inside function body
function example(params) {
  const { title, subtitle } = params;
}

---

## Reason
- Improve readability and consistency
- Avoid hidden parameters
- Easier debugging and logging
- Better control in large-scale backend systems

---

## Strict Enforcement
- Any violation MUST be rewritten
- Code review must reject:
  - Arrow function used as named function
  - Destructured parameters in function definition
