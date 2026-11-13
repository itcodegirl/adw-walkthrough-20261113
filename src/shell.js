// Shared site shell: header (site name + nav + sign-in state) and footer.
// Every page imports this through its entry script and tells it which
// page it is. The static markup below is authored in this file, so
// innerHTML is safe for it. Anything that can vary (the signed-in
// email, error text) is set with textContent only.

import { initAuth, onSessionChange, signOut } from './auth.js'

const SITE_NAME = 'Jenna Studio'
const YEAR = '2026'

const NAV = [
  { key: 'home', label: 'Home', href: 'index.html' },
  { key: 'about', label: 'About', href: 'about.html' },
  { key: 'contact', label: 'Contact', href: 'index.html#contact' },
]

const AUTH_CHECKING_TEXT = 'Checking sign-in…'
const AUTH_UNAVAILABLE_TEXT = 'Sign-in status could not be checked.'
const SIGN_OUT_ERROR_TEXT = 'Sign out failed. Please try again.'

let currentPage = ''

function renderAuthState(state) {
  const slot = document.getElementById('site-auth')
  if (!slot) return
  slot.replaceChildren()

  if (!state.ready) {
    const note = document.createElement('span')
    note.className = 'site-auth-note'
    note.textContent = AUTH_CHECKING_TEXT
    slot.append(note)
    return
  }

  if (!state.session) {
    const link = document.createElement('a')
    link.href = 'login.html'
    link.textContent = 'Sign in'
    if (currentPage === 'login') link.setAttribute('aria-current', 'page')
    slot.append(link)

    if (state.error) {
      const note = document.createElement('span')
      note.className = 'site-auth-error'
      note.setAttribute('role', 'status')
      note.textContent = AUTH_UNAVAILABLE_TEXT
      slot.append(note)
    }
    return
  }

  const greeting = document.createElement('span')
  greeting.className = 'site-greeting'
  greeting.textContent = `Hi, ${state.session.user?.email ?? 'there'}`

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'site-signout'
  button.textContent = 'Sign out'

  const error = document.createElement('span')
  error.className = 'site-auth-error'
  error.setAttribute('role', 'status')

  // The only place sign-out is ever called.
  button.addEventListener('click', async () => {
    button.disabled = true
    error.textContent = ''
    const failure = await signOut()
    if (failure) {
      error.textContent = SIGN_OUT_ERROR_TEXT
      button.disabled = false
      return
    }
    // On success the auth subscription re-renders this slot as signed out.
  })

  slot.append(greeting, button, error)
}

export function renderShell(page) {
  const header = document.querySelector('header')
  const footer = document.querySelector('footer')
  if (!header || !footer) return
  currentPage = page

  const links = NAV.map(({ key, label, href }) => {
    const current = key === page ? ' aria-current="page"' : ''
    return `<li><a href="${href}"${current}>${label}</a></li>`
  }).join('')

  header.innerHTML = `
    <a class="site-name" href="index.html">${SITE_NAME}</a>
    <nav class="site-nav" aria-label="Main">
      <ul role="list">${links}</ul>
    </nav>
    <div class="site-auth" id="site-auth"></div>
  `

  footer.textContent = `${SITE_NAME} · Built with care · ${YEAR}`

  onSessionChange(renderAuthState)
  initAuth()
}
