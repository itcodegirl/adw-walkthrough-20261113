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
  if (value.trim() === '') return 'Tell us your name.'
  return ''
}

function validateEmail(value) {
  const trimmed = value.trim()
  if (trimmed === '') return 'Add an email address so we know how to reply.'
  if (!EMAIL_PATTERN.test(trimmed)) return 'Use an email address like you@example.com.'
  return ''
}

function validateMessage(value) {
  if (value.trim() === '') return 'Tell us a little about your project.'
  return ''
}

/* ---------------------------------------------------------------
   Contact form UI. Reads field values, calls the validators, and
   updates classes, aria-invalid and message text. Runs on blur and
   on submit only, never per keystroke.
   --------------------------------------------------------------- */

const VALID_TEXT = 'Ready.'

// TEMPORARY COPY: replace once the database is connected and
// submissions are actually stored.
const SUBMIT_OK_TEXT =
  'Your details are ready for the next step. This demo has not sent or saved them. ' +
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
