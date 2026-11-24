'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const { validateLogin, validateRegister, MESSAGES } =
  require(path.join(__dirname, '..', 'validation.js'));

// ---------- Login ----------
test('01 Login: both empty → email + password errors', () => {
  const e = validateLogin({ email: '', password: '' });
  assert.equal(e.email, MESSAGES.emailRequired);
  assert.equal(e.password, MESSAGES.passwordRequired);
});

test('02 Login: whitespace email → emailRequired', () => {
  const e = validateLogin({ email: '   ', password: 'pass' });
  assert.equal(e.email, MESSAGES.emailRequired);
  assert.equal(e.password, undefined);
});

test('03 Login: "abc@" → emailInvalid', () => {
  const e = validateLogin({ email: 'abc@', password: 'pass' });
  assert.equal(e.email, MESSAGES.emailInvalid);
});

test('04 Login: valid email + non-empty password → no errors', () => {
  const e = validateLogin({ email: 'name@example.com', password: 'secret' });
  assert.deepEqual(e, {});
});

test('05 Login: never errors on confirmation/consent/short password', () => {
  const e = validateLogin({ email: 'a@b.com', password: 'short' });
  assert.equal(e.confirmation, undefined);
  assert.equal(e.consent, undefined);
  assert.equal(e.password, undefined);
});

// ---------- Register ----------
test('06 Register: empty name', () => {
  const e = validateRegister({ fullName: '', email: 'x@y.com', password: 'secret12', confirmation: 'secret12', consent: true });
  assert.equal(e.fullName, MESSAGES.nameRequired);
});

test('07 Register: invalid email', () => {
  const e = validateRegister({ fullName: 'Bob', email: 'bad', password: 'secret12', confirmation: 'secret12', consent: true });
  assert.equal(e.email, MESSAGES.emailInvalid);
});

test('08 Register: 7-char password → passwordShort', () => {
  const e = validateRegister({ fullName: 'Bob', email: 'bob@example.com', password: '1234567', confirmation: '1234567', consent: true });
  assert.equal(e.password, MESSAGES.passwordShort);
});

test('09 Register: confirmation mismatch', () => {
  const e = validateRegister({ fullName: 'Bob', email: 'bob@example.com', password: 'secret12', confirmation: 'different', consent: true });
  assert.equal(e.confirmation, MESSAGES.confirmMismatch);
});

test('10 Register: consent false', () => {
  const e = validateRegister({ fullName: 'Bob', email: 'bob@example.com', password: 'secret12', confirmation: 'secret12', consent: false });
  assert.equal(e.consent, MESSAGES.consentRequired);
});

test('11 Register: all valid → no errors', () => {
  const e = validateRegister({ fullName: 'Bob', email: 'bob@example.com', password: 'secret12', confirmation: 'secret12', consent: true });
  assert.deepEqual(e, {});
});

test('12 Register: all-space password rejected', () => {
  const e = validateRegister({ fullName: 'Bob', email: 'bob@example.com', password: '        ', confirmation: '        ', consent: true });
  assert.equal(e.password, MESSAGES.passwordRequired);
});

test('13 Messages must not contain the entered password value', () => {
  const distinct = 'Zx9!probe-pass';
  const vals = { fullName: 'A', email: 'a@b.c', password: distinct, confirmation: 'other', consent: false };
  const errors = validateRegister(vals);
  const allMsgs = Object.values(errors).join(' ');
  assert.ok(!allMsgs.includes(distinct), 'Password string leaked into a message');
});

// ---------- Static source scan ----------
test('18 Static source scan: no prohibited APIs and correct paths', () => {
  const root = path.join(__dirname, '..');
  const files = {
    'index.html': fs.readFileSync(path.join(root, 'index.html'), 'utf8'),
    'app.js': fs.readFileSync(path.join(root, 'app.js'), 'utf8'),
    'validation.js': fs.readFileSync(path.join(root, 'validation.js'), 'utf8'),
    'styles.css': fs.readFileSync(path.join(root, 'styles.css'), 'utf8'),
  };

  const prohibited = ['console.', 'localStorage', 'sessionStorage', 'document.cookie', 'fetch(', 'XMLHttpRequest', 'sendBeacon'];
  for (const [name, src] of Object.entries(files)) {
    for (const kw of prohibited) {
      assert.ok(!src.includes(kw), `${name} contains prohibited "${kw}"`);
    }
  }

  // index.html must have method="post" and no password in a text input
  assert.ok(files['index.html'].includes('method="post"'), 'index.html must have method="post"');
  assert.ok(!files['index.html'].match(/type="text"[^>]*name="password"/), 'password must not be type="text"');

  // No path starting with ../ or /
  for (const [name, src] of Object.entries(files)) {
    assert.ok(!src.includes('../'), `${name} contains a "../" path`);
    // skip root-relative checks inside CSS :root block
    if (name !== 'styles.css') {
      assert.ok(!src.match(/(?:href|src)="\/[^/]/), `${name} contains a root-relative path`);
    }
  }
});
