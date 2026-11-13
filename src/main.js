import './style.css'
import { renderShell } from './shell.js'
import { supabase } from './supabase.js'
import { getSessionState, onSessionChange } from './auth.js'
import { validateName, validateEmail, validateMessage } from './validate.js'
import { filterByTitle } from './filter.js'

renderShell(document.body.dataset.page)

/* ---------------------------------------------------------------
   Services: published offerings read once from the database, then
   searched by title in memory. Typing never fetches. Database
   strings are rendered with textContent only, never as HTML.
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

  const heading = section.querySelector('h2')
  const searchForm = section.querySelector('.services-search')
  const search = document.getElementById('services-search')
  const clearButton = document.getElementById('services-clear')
  const count = document.getElementById('services-count')
  const state = document.getElementById('services-state')

  let rows = [] // the fetched, published, already sorted offerings

  function setState(text, isError = false) {
    state.textContent = text
    state.classList.toggle('is-error', isError)
  }

  // Re-draw the cards from rows held in memory. No network here.
  function render() {
    section.querySelectorAll('article').forEach((card) => card.remove())

    const query = search.value.trim()
    const visible = filterByTitle(rows, query)

    // Clear search is offered whenever a query is active, matches or not.
    clearButton.hidden = query === ''
    count.textContent = query === '' ? '' : `Showing ${visible.length} of ${rows.length} services`

    if (visible.length === 0) {
      // The typed term goes in via textContent, so it is shown as text only.
      setState(`No services match "${query}".`)
      return
    }

    setState('')
    visible.forEach((offering) => renderOffering(section, offering))
  }

  // Enter in the search field must not submit the form and reload the page.
  searchForm.addEventListener('submit', (event) => event.preventDefault())
  search.addEventListener('input', render)
  clearButton.addEventListener('click', () => {
    search.value = ''
    render()
    search.focus()
  })

  setState(OFFERINGS_LOADING_TEXT)

  const { data, error } = await supabase
    .from('offerings')
    .select('title, description')
    .eq('published', true)
    .order('sort_order')

  if (error) {
    console.error('Offerings could not be loaded:', error)
    setState(OFFERINGS_ERROR_TEXT, true)
    return
  }

  // Read succeeded: the count comes from the rows already fetched, so an
  // empty result honestly shows (0). Loading and error keep the plain heading.
  rows = data ?? []
  heading.textContent = `Services (${rows.length})`

  if (rows.length === 0) {
    setState(OFFERINGS_EMPTY_TEXT)
    return // nothing to search, so the search stays hidden
  }

  searchForm.hidden = false
  render()
}

/* Validators live in validate.js so they can be tested on their own. */

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString()
}

/* ---------------------------------------------------------------
   My inquiries. Shown only for a signed-in session. The query is
   filtered to the current user's id, even for admins; ordinary-user
   isolation is enforced server-side by the own-row policy. On
   sign-out or account change the list is cleared and hidden, and any
   reply still in flight for the previous account is dropped.
   --------------------------------------------------------------- */

const MINE_LOADING_TEXT = 'Loading your inquiries…'
const MINE_ERROR_TEXT = 'Your inquiries could not be loaded right now. Please try again later.'
const MINE_EMPTY_TEXT = 'You have not sent any inquiries from this account yet.'

function initMyInquiries() {
  const section = document.getElementById('my-inquiries')
  if (!section) return null // about.html has no personal list

  const state = document.getElementById('my-inquiries-state')
  const list = document.getElementById('my-inquiries-list')
  let currentUserId = null
  let latestRequest = 0

  function setState(text, isError = false) {
    state.textContent = text
    state.classList.toggle('is-error', isError)
  }

  function renderRow(row) {
    const item = document.createElement('li')
    const article = document.createElement('article')
    const heading = document.createElement('h3')
    const message = document.createElement('p')
    const meta = document.createElement('p')
    heading.textContent = row.handled ? 'Answered' : 'Received'
    message.textContent = row.message
    meta.className = 'admin-meta'
    meta.textContent = formatDate(row.created_at)
    article.append(heading, message, meta)
    item.append(article)
    return item
  }

  function clear() {
    latestRequest += 1 // any fetch still in flight is now stale
    currentUserId = null
    setState('')
    list.replaceChildren()
    section.hidden = true
  }

  async function fetchMine() {
    const userId = currentUserId
    if (!userId) return
    const requestId = ++latestRequest
    setState(MINE_LOADING_TEXT)
    list.replaceChildren()

    let result
    try {
      result = await supabase
        .from('inquiries')
        .select('id, created_at, message, handled, user_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    } catch (thrown) {
      result = { data: null, error: thrown }
    }

    if (requestId !== latestRequest || currentUserId !== userId) return // stale

    if (result.error) {
      console.error('Your inquiries could not be loaded:', result.error)
      setState(MINE_ERROR_TEXT, true)
      return
    }

    const rows = result.data ?? []
    if (rows.length === 0) {
      setState(MINE_EMPTY_TEXT)
      return
    }

    setState('')
    rows.forEach((row) => list.append(renderRow(row)))
  }

  onSessionChange((auth) => {
    const user = auth.ready ? auth.session?.user ?? null : null
    if (!user) {
      clear()
      return
    }
    if (user.id === currentUserId) return // same account, nothing to redo
    clear()
    currentUserId = user.id
    section.hidden = false
    fetchMine()
  })

  // Lets the contact form refresh the list after this account saves one.
  return { refresh: fetchMine }
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
const SUBMIT_AUTH_UNKNOWN_TEXT =
  'Still checking whether you are signed in. Your details are still here; please try again in a moment.'

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

function initContactForm(myInquiries) {
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

    // Identity is read once, at submit time, from the shared controller.
    // Until the initial session read has settled, or if it failed, we do
    // not guess: the user is asked to retry and nothing is sent.
    const auth = getSessionState()
    if (!auth.ready || auth.error) {
      showStatus(status, SUBMIT_AUTH_UNKNOWN_TEXT, true)
      return
    }

    // Exactly name, email and message, trimmed, keyed by the inputs' name
    // attributes. Signed in: add only this session's user id. Signed out:
    // the user_id key is absent, not null. handled, created_at and any
    // owner value from the form are never sent.
    const inquiry = Object.fromEntries(
      fields.map(({ input }) => [input.name, input.value.trim()]),
    )
    const user = auth.session?.user ?? null
    if (user) inquiry.user_id = user.id

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

    // The personal list only exists for a signed-in session; refresh checks
    // the current account itself, so a sign-out in between is harmless.
    if (user && myInquiries) myInquiries.refresh()
  })
}

initOfferings()
const myInquiries = initMyInquiries()
initContactForm(myInquiries)
