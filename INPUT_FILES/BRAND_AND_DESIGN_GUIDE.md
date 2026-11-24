# Harborline Workspace — account interfaces

## Purpose and content
Harborline Workspace offers a streamlined project-and-files workspace for small creative teams. Build **two form modes** (Login / Register) matching the supplied references. This is a static frontend interface preview, **not** a backend account service. Never claim user authentication or account creation occurred.

## Supplied design references
- `DESIGN_REFERENCES/desktop_login.png` and `desktop_register.png` (1440px)
- `DESIGN_REFERENCES/mobile_login.png` (390×844) and `mobile_register.png` (390×940)
- Identical editable SVG versions for all four references.
- Original logo and workspace illustration in `BRAND_ASSETS/`.

## Exact text
Brand: Harborline Workspace
Desktop intro: **Your work, in one calm place.**
Support: **A clear space for projects, files and ideas. Access your workspace from any device.**
Login: **Welcome back** / **Sign in to continue to your workspace.**
Registration: **Create your account** / **Start organizing your work today.**
Field labels: **Full name**, **Email address**, **Password**, **Confirm password**.
Consent: **I agree to the Terms and Privacy Policy.**
Buttons: **Sign in**, **Create account**.

## Color and typography tokens
- Primary navy `#142C40`; teal `#087F8C`; ink `#19394B`; secondary `#637887`; soft surface `#F3F8F7`; border `#CADCDA`; error `#A62535`.
- Font stack: `system-ui, Arial, sans-serif`; heading 32–38px desktop, 28–31px mobile; body 16px; buttons ≥44px tall.
- Use CSS custom properties for palette and regular spacing (8/16/24/32px), Flexbox/Grid, and visible keyboard focus indicators.
- Desktop visual guide 1440px; mobile guide 390px. Verify at 320, 390, 768, 1200 and 1440px. No horizontal scrolling.

## Validation contract
1. Both form modes use their own appropriate required fields. Ignore hidden-mode fields.
2. Reject trimmed-empty required strings and invalid email syntax. Email error should be specific.
3. Registration: require a reasonably strong password (at least 8 characters); require matching confirmation and checked consent. Login: do not enforce registration-only confirmation/consent.
4. Put human-readable errors beside inputs and associate via `aria-describedby` and `aria-invalid`; announce a short summary via `role=alert` and focus first invalid field.
5. Do not render passwords in error messages, console, URL, storage or analytics. Use `preventDefault` for the preview; do not fetch an actual endpoint.
6. On valid preview data, announce **“Validation passed. No account action was performed.”** Clear password and confirmation fields. Do not imply a session exists.
7. Form labels, keyboard navigation, visible focus, contrast and resize must be usable. Clean up source comments after implementation.

## Current starting point
`LEGACY_FORMS/legacy_account.html` is the existing interface to replace. `STARTER/index.html`, `styles.css` and `app.js` form an unfinished but openable baseline with navigation between modes and a submit guard; validation and complete visual refinement remain to be implemented.
