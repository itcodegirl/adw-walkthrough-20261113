import './style.css'
import { renderShell } from './shell.js'
import { supabase } from './supabase.js'

renderShell(document.body.dataset.page)

/* ---------------------------------------------------------------
   Manage offerings, read-only. Named columns only, ordered by
   sort_order. The status control refetches with or without the
   published filter; the search filters rows already fetched.
   Database strings are rendered with textContent, never as HTML.
   --------------------------------------------------------------- */

const LOADING_TEXT = 'Loading offerings…'
const ERROR_TEXT = 'Offerings could not be loaded right now. Please try again later.'
const EMPTY_TEXT = 'No offerings yet — add your first in the dashboard'

// Pure: case-insensitive title filter over already fetched rows.
function filterByTitle(rows, query) {
  const needle = query.trim().toLowerCase()
  if (needle === '') return rows
  return rows.filter((row) => String(row.title ?? '').toLowerCase().includes(needle))
}

function initAdmin() {
  const section = document.querySelector('.admin')
  if (!section) return

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
      setState(EMPTY_TEXT)
      return
    }

    const visible = filterByTitle(rows, search.value)
    count.textContent = `Showing ${visible.length} of ${rows.length} offerings`

    if (visible.length === 0) {
      // The typed term goes in via textContent, so it is shown as text only.
      setState(`No offerings match "${search.value.trim()}".`)
      clearButton.hidden = false
      return
    }

    setState('')
    visible.forEach((row) => list.append(renderRow(row)))
  }

  async function fetchOfferings() {
    const requestId = ++latestRequest
    loaded = false
    rows = []
    count.textContent = ''
    setState(LOADING_TEXT)
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

    if (requestId !== latestRequest) return // a newer fetch has superseded this one

    if (result.error) {
      console.error('Offerings could not be loaded:', result.error)
      setState(ERROR_TEXT, true)
      return
    }

    rows = result.data ?? []
    loaded = true
    render()
  }

  // Enter in the search field must not submit the form and reload the page.
  controls.addEventListener('submit', (event) => event.preventDefault())
  search.addEventListener('input', render)
  statusSelect.addEventListener('change', fetchOfferings)
  clearButton.addEventListener('click', () => {
    search.value = ''
    render()
    search.focus()
  })

  fetchOfferings()
}

initAdmin()
