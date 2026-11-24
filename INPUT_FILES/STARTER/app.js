// Harborline account preview — the freelancer implements validation.
'use strict';
const form = document.getElementById('account-form');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
function showMode(mode) {
  const registering = mode === 'register';
  document.getElementById('name-row').hidden = !registering;
  document.getElementById('confirmation-row').hidden = !registering;
  document.getElementById('consent-row').hidden = !registering;
  document.getElementById('form-title').textContent = registering ? 'Create your account' : 'Welcome back';
  document.getElementById('form-description').textContent = registering ? 'Start organizing your work today.' : 'Sign in to continue to your workspace.';
  form.querySelector('[type="submit"]').textContent = registering ? 'Create account' : 'Sign in';
  loginTab.setAttribute('aria-pressed', String(!registering));
  registerTab.setAttribute('aria-pressed', String(registering));
  document.getElementById('form-status').textContent = '';
}
loginTab.addEventListener('click', () => showMode('login'));
registerTab.addEventListener('click', () => showMode('register'));
form.addEventListener('submit', (event) => {
  // Do not submit credentials to a server while validation is unfinished.
  event.preventDefault();
  document.getElementById('form-status').textContent = 'Complete the required validation before enabling submission.';
  // Implement per-field validation, focus management, accessible errors,
  // safe success message and sensitive-field clearing here.
});
