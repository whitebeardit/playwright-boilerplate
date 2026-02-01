---
name: frontend-qa-friendly
description: Guides frontend markup and structure for easy Playwright testing: semantic HTML, accessible roles and labels, stable selectors (data-testid). Use when writing or reviewing UI components, forms, or pages that will be tested by QA.
---

# Frontend QA-friendly

When writing or reviewing frontend code that will be tested by QA (e.g. Playwright), ensure markup allows stable, fast locators: `getByRole`, `getByLabel`, `getByTestId`. Avoid selectors that depend on DOM position or styling.

## Goal

Frontend that lets tests locate and fill elements quickly and reliably, without brittle XPaths like `div[1]/div[2]/input`.

## Forms

- **Labels:** Always associate each input with a label: `<label for="id">` and `id` on the input, or wrap the input inside `<label>`.
- Avoid inputs with no associated label; tests rely on `getByLabel('Label text')` or `getByRole('textbox', { name: 'Label text' })`.
- **Placeholder:** If using placeholder as fallback, keep it stable or document it; tests may use `getByPlaceholder()`.

## Buttons and links

- Use visible text or a stable `aria-label` so tests can use `getByRole('button', { name: '...' })` or `getByRole('link', { name: '...' })`.
- Avoid buttons/links with no accessible name (e.g. icon-only without aria-label).

## Checkboxes and radios

- Associate each control with a label or `aria-label` so tests can use `getByRole('checkbox', { name: '...' })` or `getByRole('radio', { name: '...' })`.

## Combos and selects

- Prefer native `<select>` or components that expose proper roles and names (e.g. combobox + option).
- Avoid custom dropdowns that are only targetable by "first button in second div"; expose role and accessible name so tests can use `getByRole('combobox', { name: '...' })` and `getByRole('option', { name: '...' })`.

## IDs

- Use stable, unique IDs when you use `id`; avoid auto-generated IDs that change every build.
- Prefer semantic hooks (role + label) over IDs for test locators when possible.

## data-testid

- Use `data-testid` when role/label are not enough (e.g. inner regions, dynamic lists, complex components).
- Use a stable, documented convention (e.g. `data-testid="form-nome"`, `data-testid="btn-enviar"`).
- Tests can then use `getByTestId('form-nome')`. Do not overuse; prefer accessible markup first.

## Avoid

- **XPath by position:** Selectors like `./div[1]/div[2]/input` break when layout or structure changes.
- **Style classes as sole hook:** Minified or hashed class names change between builds; do not rely on them for test selectors.
- **Placeholders that change with i18n** without a stable fallback (e.g. label or data-testid) for tests.

## Loading and feedback

- Expose clear states so tests can wait for completion: e.g. `aria-busy="true"`, disabled submit button, or a visible "loading" element with role or data-testid.
- Success/error messages: use `role="alert"` or stable text/data-testid so tests can assert with `getByRole('alert')` or `getByText(/.../)`.

## Checklist when writing or reviewing

- [ ] Every form input has an associated label (for/id or wrapped in label).
- [ ] Buttons and links have visible text or aria-label.
- [ ] Checkboxes and radios have a label or aria-label.
- [ ] Combos/selects are reachable by role and name (native select or accessible custom component).
- [ ] data-testid used only where role/label are insufficient; convention is stable and documented.
- [ ] No test-critical selectors depend on div order or style-only classes.
- [ ] Loading and result states are detectable (aria-busy, role="alert", or stable testid/text).
