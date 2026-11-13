/* ---------------------------------------------------------------
   Validators. Pure functions: take a string, return '' when the
   value is accepted or a specific fix message when it is rejected.
   No DOM access here, so each one can be traced on its own.
   --------------------------------------------------------------- */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateName(value) {
  return value.trim() ? '' : 'Tell us your name.'
}

export function validateEmail(value) {
  const trimmed = value.trim()
  if (!trimmed) return 'Add an email address so we know how to reply.'
  return EMAIL_PATTERN.test(trimmed) ? '' : 'Use an email address like you@example.com.'
}

export function validateMessage(value) {
  return value.trim() ? '' : 'Tell us a little about your project.'
}
