import './style.css'
import { renderShell } from './shell.js'
import { supabase } from './supabase.js'
import { onSessionChange } from './auth.js'

renderShell(document.body.dataset.page)

/* ---------------------------------------------------------------
   Magic-link sign-in. One labelled email field, validated on blur
   and on submit. The submit button doubles as the resend control:
   after a send it is disabled and counts down before it can be used
   again. Success is shown only when the call returns a null error.
   --------------------------------------------------------------- */

// Sender limits. Supabase's documented default is one sign-in email
// per address every 60 seconds, and the built-in sender also has a
// low hourly cap. Adjust these if the project's Auth settings differ.
const RESEND_COOLDOWN_SECONDS = 60
const RATE_LIMIT_WAIT_SECONDS = 3600

const SUBMIT_LABEL = 'Send sign-in link'
const RESEND_LABEL = 'Resend sign-in link'
const PENDING_TEXT = 'Sending your sign-in link…'
const ERROR_TEXT = 'The sign-in link could not be sent. Please try again.'
const RATE_LIMIT_TEXT =
  'Too many sign-in emails have been requested. Please wait before trying again; ' +
  'the button shows how long.'

/* Pure helpers: strings in, strings or numbers out, no DOM. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(value) {
  const trimmed = value.trim()
  if (trimmed === '') return 'Enter the email address you want the link sent to.'
  if (!EMAIL_PATTERN.test(trimmed)) return 'Use an email address like you@example.com.'
  return ''
}

function successText(email) {
  return `Check your inbox at ${email} for a sign-in link. It may take a minute to arrive.`
}

function signedInText(email) {
  return `You are already signed in as ${email}.`
}

function isRateLimit(error) {
  return error?.status === 429 || /rate limit|too many|security purposes/i.test(error?.message ?? '')
}

// Supabase's cooldown message names the wait, e.g. "after 42 seconds".
function waitSecondsFrom(message) {
  const match = /after (\d+) seconds?/i.exec(message ?? '')
  return match ? Number(match[1]) : null
}

function formatWait(seconds) {
  if (seconds >= 60) return `${Math.ceil(seconds / 60)} min`
  return `${seconds}s`
}

/* UI */

function initLogin() {
  const form = document.getElementById('login-form')
  if (!form) return

  const email = document.getElementById('login-email')
  const message = document.getElementById('login-email-message')
  const button = document.getElementById('login-submit')
  const status = document.getElementById('login-status')
  const sessionNote = document.getElementById('login-session')

  let pending = false
  let cooldownRemaining = 0
  let cooldownTimer = null

  function showStatus(text, isError = false) {
    status.textContent = text
    status.classList.toggle('is-error', isError)
  }

  function checkEmail() {
    const field = email.closest('.field')
    const error = validateEmail(email.value)
    field.classList.remove('is-invalid', 'is-valid')
    if (error) {
      field.classList.add('is-invalid')
      email.setAttribute('aria-invalid', 'true')
      message.textContent = error
    } else {
      field.classList.add('is-valid')
      email.removeAttribute('aria-invalid')
      message.textContent = 'Ready.'
    }
    return error === ''
  }

  function syncButton() {
    button.disabled = pending || cooldownRemaining > 0
  }

  function setPending(isPending) {
    pending = isPending
    email.readOnly = isPending
    syncButton()
  }

  function startCooldown(seconds) {
    clearInterval(cooldownTimer)
    cooldownRemaining = seconds

    const tick = () => {
      if (cooldownRemaining <= 0) {
        clearInterval(cooldownTimer)
        cooldownTimer = null
        button.textContent = RESEND_LABEL
        syncButton()
        return
      }
      button.textContent = `${RESEND_LABEL} in ${formatWait(cooldownRemaining)}`
      syncButton()
      cooldownRemaining -= 1
    }

    tick()
    cooldownTimer = setInterval(tick, 1000)
  }

  email.addEventListener('blur', () => {
    if (!pending) showStatus('') // a stale result must not outlive a re-check
    checkEmail()
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (pending || cooldownRemaining > 0) return
    showStatus('')

    if (!checkEmail()) {
      email.focus()
      return
    }

    const validatedEmail = email.value.trim()
    setPending(true)
    showStatus(PENDING_TEXT)

    let error = null
    try {
      const result = await supabase.auth.signInWithOtp({
        email: validatedEmail,
        options: { emailRedirectTo: window.location.origin },
      })
      error = result.error
    } catch (thrown) {
      error = thrown
    } finally {
      setPending(false) // the field and button are never left locked
    }

    if (error) {
      console.error('Sign-in link could not be sent:', error)
      if (isRateLimit(error)) {
        showStatus(RATE_LIMIT_TEXT, true)
        startCooldown(waitSecondsFrom(error.message) ?? RATE_LIMIT_WAIT_SECONDS)
      } else {
        showStatus(ERROR_TEXT, true)
        button.textContent = SUBMIT_LABEL
      }
      return // the typed email stays in place for a retry
    }

    showStatus(successText(validatedEmail))
    startCooldown(RESEND_COOLDOWN_SECONDS)
  })

  // Listener only: the single auth subscription lives in auth.js.
  onSessionChange((state) => {
    sessionNote.textContent = state.session
      ? signedInText(state.session.user?.email ?? 'a signed-in user')
      : ''
  })
}

initLogin()
