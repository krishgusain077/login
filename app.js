'use strict';

/* validation.js is loaded before this script (see index.html),
   so HarborlineValidation is available as a browser global. */
var validateLogin    = HarborlineValidation.validateLogin;
var validateRegister = HarborlineValidation.validateRegister;

var form          = document.getElementById('account-form');
var loginBtn      = document.getElementById('login-tab');
var registerBtn   = document.getElementById('register-tab');
var modeSwitchTxt = document.getElementById('mode-switch-text');
var statusEl      = document.getElementById('form-status');

/* Determine active mode from register button aria-pressed */
function activeMode() {
  return registerBtn.getAttribute('aria-pressed') === 'true' ? 'register' : 'login';
}

/* Remove any existing summary alert injected by renderErrors */
function removeSummaryAlert() {
  var a = document.getElementById('form-alert');
  if (a) a.remove();
}

/* Clear all field errors, ARIA attrs, and status/alert */
function clearErrors() {
  form.querySelectorAll('.field-error').forEach(function (el) { el.textContent = ''; });
  form.querySelectorAll('input').forEach(function (inp) {
    inp.removeAttribute('aria-invalid');
    inp.removeAttribute('aria-describedby');
  });
  removeSummaryAlert();
  statusEl.textContent = '';
}

/* Render errors beside each field, then focus the first bad input */
function renderErrors(errors) {
  clearErrors();

  var keys = Object.keys(errors);

  keys.forEach(function (key) {
    var errorEl = document.getElementById(key + '-error');
    if (errorEl) errorEl.textContent = errors[key];
    var inp = form.querySelector('[name="' + key + '"]');
    if (inp) {
      inp.setAttribute('aria-invalid', 'true');
      inp.setAttribute('aria-describedby', key + '-error');
    }
  });

  /* Summary alert */
  var count = keys.length;
  var alert = document.createElement('div');
  alert.id = 'form-alert';
  alert.setAttribute('role', 'alert');
  alert.textContent = 'Please fix ' + count + ' problem' + (count > 1 ? 's' : '') + ' below.';
  form.insertBefore(alert, form.firstChild);

  /* Focus first invalid control in DOM order */
  var order = ['fullName', 'email', 'password', 'confirmation', 'consent'];
  for (var i = 0; i < order.length; i++) {
    if (errors[order[i]]) {
      var inp = form.querySelector('[name="' + order[i] + '"]');
      if (inp) { inp.focus(); break; }
    }
  }
}

/* Switch between login and register mode */
function showMode(mode) {
  var registering = mode === 'register';

  /* Show/hide rows */
  document.getElementById('name-row').hidden         = !registering;
  document.getElementById('confirmation-row').hidden = !registering;
  document.getElementById('consent-row').hidden      = !registering;

  /* Disable hidden inputs so they're never sent */
  document.getElementById('full-name').disabled    = !registering;
  document.getElementById('confirmation').disabled = !registering;
  document.getElementById('consent').disabled      = !registering;

  /* Titles and button label */
  document.getElementById('form-title').textContent =
    registering ? 'Create your account' : 'Welcome back';
  document.getElementById('form-description').textContent =
    registering ? 'Start organizing your work today.'
                : 'Sign in to continue to your workspace.';
  form.querySelector('[type="submit"]').textContent =
    registering ? 'Create account' : 'Sign in';

  /* Autocomplete */
  document.getElementById('password').setAttribute(
    'autocomplete', registering ? 'new-password' : 'current-password');

  /* Mode-switch link text */
  modeSwitchTxt.textContent = registering ? 'Already have an account?' : 'New here?';
  loginBtn.hidden    = !registering;   /* "Sign in" link only shown when in register mode */
  registerBtn.hidden = registering;    /* "Create an account" link only shown when in login mode */

  /* ARIA pressed state */
  loginBtn.setAttribute('aria-pressed', String(!registering));
  registerBtn.setAttribute('aria-pressed', String(registering));

  /* Clear sensitive fields and all errors */
  document.getElementById('password').value = '';
  document.getElementById('confirmation').value = '';
  clearErrors();

  /* Move keyboard focus to form heading */
  document.getElementById('form-title').focus();
}

/* Handle mode-switch link buttons */
loginBtn.addEventListener('click', function () { showMode('login'); });
registerBtn.addEventListener('click', function () { showMode('register'); });

/* Handle #register hash in URL */
if (window.location.hash === '#register') {
  showMode('register');
}

/* Submit handler */
form.addEventListener('submit', function (event) {
  event.preventDefault(); /* always first */

  var mode = activeMode();
  var values = {
    email:    form.email.value,
    password: form.password.value,
  };

  if (mode === 'register') {
    values.fullName     = form.fullName.value;
    values.confirmation = form.confirmation.value;
    values.consent      = form.consent.checked;
  }

  var errors = mode === 'register'
    ? validateRegister(values)
    : validateLogin(values);

  if (Object.keys(errors).length) {
    renderErrors(errors);
    return;
  }

  /* Success — never claim account was created or authenticated */
  clearErrors();
  statusEl.textContent = 'Validation passed. No account action was performed.';
  document.getElementById('password').value = '';
  document.getElementById('confirmation').value = '';
});
