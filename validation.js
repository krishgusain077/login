(function (root) {
  'use strict';

  const MIN_PASSWORD_LENGTH = 8;
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const MESSAGES = Object.freeze({
    nameRequired: 'Enter your full name.',
    emailRequired: 'Enter your email address.',
    emailInvalid: 'Enter a valid email address, like name@example.com.',
    passwordRequired: 'Enter your password.',
    passwordShort: 'Use at least 8 characters for your password.',
    confirmRequired: 'Confirm your password.',
    confirmMismatch: 'Passwords do not match.',
    consentRequired: 'Agree to the Terms and Privacy Policy to continue.',
  });

  const isBlank = (value) => typeof value !== 'string' || value.trim() === '';

  function validateLogin(values) {
    const errors = {};
    if (isBlank(values.email)) errors.email = MESSAGES.emailRequired;
    else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = MESSAGES.emailInvalid;
    if (isBlank(values.password)) errors.password = MESSAGES.passwordRequired;
    return errors;
  }

  function validateRegister(values) {
    const errors = {};
    if (isBlank(values.fullName)) errors.fullName = MESSAGES.nameRequired;
    if (isBlank(values.email)) errors.email = MESSAGES.emailRequired;
    else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = MESSAGES.emailInvalid;
    if (isBlank(values.password)) errors.password = MESSAGES.passwordRequired;
    else if (values.password.length < MIN_PASSWORD_LENGTH) errors.password = MESSAGES.passwordShort;
    if (isBlank(values.confirmation)) errors.confirmation = MESSAGES.confirmRequired;
    else if (values.confirmation !== values.password) errors.confirmation = MESSAGES.confirmMismatch;
    if (values.consent !== true) errors.consent = MESSAGES.consentRequired;
    return errors;
  }

  const api = { MIN_PASSWORD_LENGTH, MESSAGES, validateLogin, validateRegister };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HarborlineValidation = api;
})(typeof window !== 'undefined' ? window : globalThis);
