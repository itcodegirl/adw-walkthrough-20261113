import './style.css'
import { renderShell } from './shell.js'
import { supabase } from './supabase.js'

renderShell(document.body.dataset.page)

/* ---------------------------------------------------------------
   Services: offerings read from the database. Database strings are
   rendered with textContent only, never as HTML.
   --------------------------------------------------------------- */

const OFFERINGS_LOADING_TEXT = 'Loading services…'
const OFFERINGS_EMPTY_TEXT = 'No services are listed yet. Please check back soon.'
const OFFERINGS_ERROR_TEXT = 'Services could not be loaded right now. Please try again later.'

function renderOffering(section, { title, description }) {
  const article = document.createElement('article')
  const heading = document.createElement('h3')
  const text = document.createElement('p')
  heading.textContent = title
  text.textContent = description
  article.append(heading, text)
  section.append(article)
}

async function initOfferings() {
  const section = document.getElementById('services')
  if (!section) return // about.html has no services section

  const status = section.querySelector('.section-status')
  status.textContent = OFFERINGS_LOADING_TEXT
  status.classList.remove('is-error')

  const { data, error } = await supabase
    .from('offerings')
    .select('title, description')
    .eq('published', true)
    .order('sort_order')

  if (error) {
    console.error('Offerings could not be loaded:', error)
    status.textContent = OFFERINGS_ERROR_TEXT
    status.classList.add('is-error')
    return
  }

  if (!data || data.length === 0) {
    status.textContent = OFFERINGS_EMPTY_TEXT
    return
  }

  status.textContent = ''
  data.forEach((offering) => renderOffering(section, offering))
}

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
   on submit only, never per keystroke. A valid submit saves the
   trimmed values to the inquiries table.
   --------------------------------------------------------------- */

const VALID_TEXT = 'Ready.'
const SUBMIT_PENDING_TEXT = 'Saving your enquiry…'
const SUBMIT_OK_TEXT = 'Thanks, your enquiry is saved. Jenna will read it and get back to you.'
const SUBMIT_ERROR_TEXT =
  'Your enquiry could not be saved. Your details are still here, so please try again.'

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

function clearFieldState(input) {
  const field = input.closest('.field')
  const message = document.getElementById(`${input.id}-message`)
  field.classList.remove('is-invalid', 'is-valid')
  input.removeAttribute('aria-invalid')
  message.textContent = ''
}

function checkField(input, validate) {
  const message = document.getElementById(`${input.id}-message`)
  const error = validate(input.value)
  showFieldState(input, message, error)
  return error === ''
}

function showStatus(status, text, isError = false) {
  status.textContent = text
  status.classList.toggle('is-error', isError)
}

function initContactForm() {
  const form = document.getElementById('contact-form')
  if (!form) return // about.html shares this module but has no form

  const status = document.getElementById('contact-status')
  const button = form.querySelector('button[type="submit"]')
  const fields = FIELDS.map(({ id, validate }) => ({
    input: document.getElementById(id),
    validate,
  }))
  let pending = false

  // One explicit pending path: the button cannot be clicked again and the
  // fields cannot be edited while a save is in flight. readOnly keeps the
  // fields focusable so keyboard focus is not thrown away mid-save.
  function setPending(isPending) {
    pending = isPending
    button.disabled = isPending
    fields.forEach(({ input }) => {
      input.readOnly = isPending
    })
  }

  fields.forEach(({ input, validate }) => {
    input.addEventListener('blur', () => {
      if (!pending) showStatus(status, '') // stale confirmation must not outlive a re-check
      checkField(input, validate)
    })
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (pending) return // ignore a second click while a save is in flight
    showStatus(status, '')

    const results = fields.map(({ input, validate }) => ({
      input,
      ok: checkField(input, validate),
    }))

    const firstInvalid = results.find((result) => !result.ok)
    if (firstInvalid) {
      firstInvalid.input.focus()
      return
    }

    // Only the three validated fields, trimmed, keyed by their name attribute.
    const inquiry = Object.fromEntries(
      fields.map(({ input }) => [input.name, input.value.trim()]),
    )

    setPending(true)
    showStatus(status, SUBMIT_PENDING_TEXT)

    let error = null
    try {
      const result = await supabase.from('inquiries').insert(inquiry)
      error = result.error
    } catch (thrown) {
      error = thrown // a thrown failure is handled the same as a returned one
    } finally {
      setPending(false) // controls are never left locked, whatever happened
    }

    if (error) {
      console.error('Inquiry could not be saved:', error)
      showStatus(status, SUBMIT_ERROR_TEXT, true) // entered values are left in place
      return
    }

    form.reset()
    fields.forEach(({ input }) => clearFieldState(input))
    showStatus(status, SUBMIT_OK_TEXT)
  })
}

initOfferings()
initContactForm()
