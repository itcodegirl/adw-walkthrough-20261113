import './style.css'
import { renderShell } from './shell.js'

renderShell(document.body.dataset.page)

/* ---------------------------------------------------------------
   Validators. Pure functions: take a string, return '' when the
   value is accepted or a specific fix message when it is rejected.
   No DOM access here, so each one can be traced on its own.
   --------------------------------------------------------------- */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateName(value) {
  if (value.trim() === '') return 'Enter your name.'
  return ''
}

function validateEmail(value) {
  const trimmed = value.trim()
  if (trimmed === '') return 'Enter your email address.'
  if (!EMAIL_PATTERN.test(trimmed)) return 'Enter an email address like name@example.com.'
  return ''
}

function validateMessage(value) {
  if (value.trim() === '') return 'Enter a short message.'
  return ''
}

/* ---------------------------------------------------------------
   Contact form UI. Reads field values, calls the validators, and
   updates classes, aria-invalid and message text. Runs on blur and
   on submit only, never per keystroke.
   --------------------------------------------------------------- */

const VALID_TEXT = 'Looks good.'

// TEMPORARY COPY: replace once the database is connected and
// submissions are actually stored.
const SUBMIT_OK_TEXT =
  'Thanks, your details check out. Nothing has been sent or saved yet. ' +
  'Submissions will be stored once the database is connected.'

const FIELDS = [
  { id: 'contact-name', validate: validateName },
  { id: 'contact-email', validate: validateEmail },
  { id: 'contact-message', validate: validateMessage },
]

function showFieldState(input, message, error) {
  const field = input.closest('.field')
  field.classList.remove('is-invalid', 'is-valid')

  if (error) {
    field.classList.add('is-invalid')
    input.setAttribute('aria-invalid', 'true')
    message.textContent = error
  } else {
    field.classList.add('is-valid')
    input.removeAttribute('aria-invalid')
    message.textContent = VALID_TEXT
  }
}

function checkField(input, validate) {
  const message = document.getElementById(`${input.id}-message`)
  const error = validate(input.value)
  showFieldState(input, message, error)
  return error === ''
}

function initContactForm() {
  const form = document.getElementById('contact-form')
  if (!form) return // about.html shares this module but has no form

  const status = document.getElementById('contact-status')
  const fields = FIELDS.map(({ id, validate }) => ({
    input: document.getElementById(id),
    validate,
  }))

  fields.forEach(({ input, validate }) => {
    input.addEventListener('blur', () => {
      status.textContent = '' // a stale "checks out" must not outlive a re-check
      checkField(input, validate)
    })
  })

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    status.textContent = ''

    const results = fields.map(({ input, validate }) => ({
      input,
      ok: checkField(input, validate),
    }))

    const firstInvalid = results.find((result) => !result.ok)
    if (firstInvalid) {
      firstInvalid.input.focus()
      return
    }

    status.textContent = SUBMIT_OK_TEXT
  })
}

initContactForm()
