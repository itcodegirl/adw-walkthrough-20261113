import './style.css'
import { renderShell } from './shell.js'
import { supabase } from './supabase.js'
import { onSessionChange } from './auth.js'

renderShell(document.body.dataset.page)

/* ---------------------------------------------------------------
   Manage page. Gated on the shared session from auth.js: this file
   only listens to that controller and never subscribes to the
   provider itself. No auth calls are made from the listener.

   The gate below is UX only: it decides what to render. Data
   protection is the database policies, installed separately:
     - users read their own profile
     - admins read all offerings
     - admins read inquiries
     - admins update inquiries
   Every query names its columns and handles its error half. All
   database strings are rendered with textContent, never as HTML.
   --------------------------------------------------------------- */

const CHECKING_TEXT = 'Checking sign-in…'
const SIGNED_OUT_TEXT = 'You are not signed in.'
const PROFILE_LOADING_TEXT = 'Checking your role…'
const PROFILE_ERROR_TEXT = 'Your role could not be checked right now. Please try again later.'
const PROFILE_MISSING_TEXT = 'No profile was found for this account, so admin tools are unavailable.'

const OFFERINGS_LOADING_TEXT = 'Loading offerings…'
const OFFERINGS_ERROR_TEXT = 'Offerings could not be loaded right now. Please try again later.'
const OFFERINGS_EMPTY_TEXT = 'No offerings yet — add your first in the dashboard'

const INQUIRIES_LOADING_TEXT = 'Loading inquiries…'
const INQUIRIES_ERROR_TEXT = 'Inquiries could not be loaded right now. Please try again later.'
const INQUIRIES_EMPTY_UNHANDLED_TEXT = 'No unhandled inquiries. Nice work.'
const INQUIRIES_EMPTY_ALL_TEXT = 'No inquiries yet.'
const MARK_ERROR_TEXT = 'This inquiry could not be marked as handled. Please try again.'
const MARK_NO_ROW_TEXT = 'No inquiry was updated. It may have been changed or removed.'

/* Pure helpers. */

function filterByTitle(rows, query) {
  const needle = query.trim().toLowerCase()
  if (needle === '') return rows
  return rows.filter((row) => String(row.title ?? '').toLowerCase().includes(needle))
}

function roleText(email, isAdmin) {
  return isAdmin
    ? `Signed in as ${email} · Admin`
    : `Signed in as ${email} · Not an admin, so inquiries are unavailable.`
}

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString()
}

/* ---------------------------------------------------------------
   Offerings. Unchanged query and filter; now only runs when signed
   in, and resets when the account changes.
   --------------------------------------------------------------- */

function initOfferings(getUserId) {
  const section = document.getElementById('admin-offerings')
  const controls = section.querySelector('.admin-controls')
  const search = document.getElementById('admin-search')
  const statusSelect = document.getElementById('admin-status')
  const clearButton = document.getElementById('admin-clear')
  const count = document.getElementById('admin-count')
  const state = document.getElementById('admin-state')
  const list = document.getElementById('admin-list')

  let rows = []
  let loaded = false
  let latestRequest = 0

  function setState(text, isError = false) {
    state.textContent = text
    state.classList.toggle('is-error', isError)
  }

  function renderRow(row) {
    const item = document.createElement('li')
    const article = document.createElement('article')
    const heading = document.createElement('h3')
    const text = document.createElement('p')
    const meta = document.createElement('p')
    heading.textContent = row.title
    text.textContent = row.description
    meta.className = 'admin-meta'
    meta.textContent = `${row.published ? 'Published' : 'Draft'} · Sort order ${row.sort_order}`
    article.append(heading, text, meta)
    item.append(article)
    return item
  }

  function render() {
    list.replaceChildren()
    clearButton.hidden = true
    if (!loaded) return

    if (rows.length === 0) {
      count.textContent = 'Showing 0 of 0 offerings'
      setState(OFFERINGS_EMPTY_TEXT)
      return
    }

    const visible = filterByTitle(rows, search.value)
    count.textContent = `Showing ${visible.length} of ${rows.length} offerings`

    if (visible.length === 0) {
      setState(`No offerings match "${search.value.trim()}".`)
      clearButton.hidden = false
      return
    }

    setState('')
    visible.forEach((row) => list.append(renderRow(row)))
  }

  function reset() {
    latestRequest += 1 // any fetch still in flight is now stale
    rows = []
    loaded = false
    count.textContent = ''
    setState('')
    list.replaceChildren()
    clearButton.hidden = true
  }

  async function fetchOfferings() {
    const userId = getUserId()
    if (!userId) return
    const requestId = ++latestRequest
    loaded = false
    rows = []
    count.textContent = ''
    setState(OFFERINGS_LOADING_TEXT)
    list.replaceChildren()
    clearButton.hidden = true

    let query = supabase
      .from('offerings')
      .select('title, description, published, sort_order')
    if (statusSelect.value === 'published') query = query.eq('published', true)
    query = query.order('sort_order')

    let result
    try {
      result = await query
    } catch (thrown) {
      result = { data: null, error: thrown }
    }

    if (requestId !== latestRequest || getUserId() !== userId) return // stale

    if (result.error) {
      console.error('Offerings could not be loaded:', result.error)
      setState(OFFERINGS_ERROR_TEXT, true)
      return
    }

    rows = result.data ?? []
    loaded = true
    render()
  }

  controls.addEventListener('submit', (event) => event.preventDefault())
  search.addEventListener('input', render)
  statusSelect.addEventListener('change', fetchOfferings)
  clearButton.addEventListener('click', () => {
    search.value = ''
    render()
    search.focus()
  })

  return { section, fetch: fetchOfferings, reset }
}

/* ---------------------------------------------------------------
   Inquiries. Admin only. Newest first, unhandled by default. Mark
   handled updates exactly one row by id and reports success only
   when the returned error is null and that row actually came back.
   --------------------------------------------------------------- */

function initInquiries(getUserId) {
  const section = document.getElementById('admin-inquiries')
  const controls = section.querySelector('.admin-controls')
  const filterSelect = document.getElementById('inquiries-filter')
  const state = document.getElementById('inquiries-state')
  const list = document.getElementById('inquiries-list')

  let latestRequest = 0

  function setState(text, isError = false) {
    state.textContent = text
    state.classList.toggle('is-error', isError)
  }

  async function markHandled(row, button, note) {
    const userId = getUserId()
    if (!userId) return
    button.disabled = true
    note.textContent = ''
    note.classList.remove('is-error')

    let result
    try {
      // The chained select returns the row that was actually updated, which
      // is how we confirm one row changed rather than trusting a null error.
      result = await supabase
        .from('inquiries')
        .update({ handled: true })
        .eq('id', row.id)
        .select('id')
    } catch (thrown) {
      result = { data: null, error: thrown }
    }

    if (getUserId() !== userId) return // account changed while waiting

    if (result.error) {
      console.error('Inquiry could not be marked handled:', result.error)
      note.textContent = MARK_ERROR_TEXT
      note.classList.add('is-error')
      button.disabled = false
      return
    }

    const affected = Array.isArray(result.data) ? result.data.length : 0
    if (affected !== 1) {
      note.textContent = MARK_NO_ROW_TEXT
      note.classList.add('is-error')
      button.disabled = false
      return
    }

    fetchInquiries() // re-read so the list reflects the stored state
  }

  function renderRow(row) {
    const item = document.createElement('li')
    const article = document.createElement('article')
    const heading = document.createElement('h3')
    const email = document.createElement('p')
    const message = document.createElement('p')
    const meta = document.createElement('p')
    const note = document.createElement('p')

    heading.textContent = row.name
    email.textContent = row.email
    message.textContent = row.message
    meta.className = 'admin-meta'
    meta.textContent = `${row.handled ? 'Handled' : 'Unhandled'} · ${formatDate(row.created_at)}`
    note.className = 'section-status'
    note.setAttribute('role', 'status')

    article.append(heading, email, message, meta)

    if (!row.handled) {
      const button = document.createElement('button')
      button.type = 'button'
      button.textContent = 'Mark handled'
      button.addEventListener('click', () => markHandled(row, button, note))
      article.append(button)
    }

    article.append(note)
    item.append(article)
    return item
  }

  function reset() {
    latestRequest += 1
    setState('')
    list.replaceChildren()
  }

  async function fetchInquiries() {
    const userId = getUserId()
    if (!userId) return
    const requestId = ++latestRequest
    setState(INQUIRIES_LOADING_TEXT)
    list.replaceChildren()

    let query = supabase
      .from('inquiries')
      .select('id, created_at, name, email, message, handled, user_id')
    if (filterSelect.value === 'unhandled') query = query.eq('handled', false)
    query = query.order('created_at', { ascending: false })

    let result
    try {
      result = await query
    } catch (thrown) {
      result = { data: null, error: thrown }
    }

    if (requestId !== latestRequest || getUserId() !== userId) return // stale

    if (result.error) {
      console.error('Inquiries could not be loaded:', result.error)
      setState(INQUIRIES_ERROR_TEXT, true)
      return
    }

    const rows = result.data ?? []
    if (rows.length === 0) {
      setState(filterSelect.value === 'unhandled' ? INQUIRIES_EMPTY_UNHANDLED_TEXT : INQUIRIES_EMPTY_ALL_TEXT)
      return
    }

    setState('')
    rows.forEach((row) => list.append(renderRow(row)))
  }

  controls.addEventListener('submit', (event) => event.preventDefault())
  filterSelect.addEventListener('change', fetchInquiries)

  return { section, fetch: fetchInquiries, reset }
}

/* ---------------------------------------------------------------
   Gate. Reacts to the shared session state. On any account change
   or sign-out, both sections reset so no stale rows or in-flight
   results from the previous account can land.
   --------------------------------------------------------------- */

function initAdmin() {
  const role = document.getElementById('admin-role')
  const signin = document.getElementById('admin-signin')
  if (!role) return

  let currentUserId = null
  let profileRequest = 0
  const getUserId = () => currentUserId

  const offerings = initOfferings(getUserId)
  const inquiries = initInquiries(getUserId)

  function setRole(text, isError = false) {
    role.textContent = text
    role.classList.toggle('is-error', isError)
  }

  function showSignedOut(text) {
    currentUserId = null
    profileRequest += 1
    offerings.reset()
    inquiries.reset()
    offerings.section.hidden = true
    inquiries.section.hidden = true
    setRole(text)
    signin.hidden = false
  }

  async function checkRole(user) {
    const requestId = ++profileRequest
    setRole(PROFILE_LOADING_TEXT)

    let result
    try {
      result = await supabase
        .from('profiles')
        .select('id, is_admin')
        .eq('id', user.id)
        .maybeSingle()
    } catch (thrown) {
      result = { data: null, error: thrown }
    }

    if (requestId !== profileRequest || currentUserId !== user.id) return // stale

    if (result.error) {
      console.error('Profile could not be read:', result.error)
      setRole(PROFILE_ERROR_TEXT, true)
      return
    }

    if (!result.data) {
      setRole(PROFILE_MISSING_TEXT)
      return
    }

    const isAdmin = result.data.is_admin === true
    setRole(roleText(user.email ?? 'this account', isAdmin))
    inquiries.section.hidden = !isAdmin
    if (isAdmin) inquiries.fetch()
  }

  onSessionChange((state) => {
    if (!state.ready) {
      showSignedOut(CHECKING_TEXT)
      signin.hidden = true
      return
    }

    const user = state.session?.user ?? null
    if (!user) {
      showSignedOut(SIGNED_OUT_TEXT)
      return
    }

    if (user.id === currentUserId) return // same account, nothing to redo

    // New account: start clean, then load for this user only.
    showSignedOut(CHECKING_TEXT)
    signin.hidden = true
    currentUserId = user.id
    offerings.section.hidden = false
    offerings.fetch()
    checkRole(user)
  })
}

initAdmin()
