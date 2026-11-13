import { supabase } from './supabase.js'

/* ---------------------------------------------------------------
   Session state for one page. initAuth() opens exactly ONE
   onAuthStateChange subscription, which is the authoritative source,
   then reads the initial session with getSession. A revision counter
   makes sure that read can never overwrite a newer event that arrived
   while it was in flight. Other code reads state through
   getSessionState() or listens with onSessionChange(); nothing else
   subscribes to Supabase directly, and nothing here signs out on its
   own. The subscription callback makes no auth calls.

   State shape: { session, ready, error }
     ready  — false until the first event or the initial read lands
     error  — null, or the initial read's error (returned or thrown)
   --------------------------------------------------------------- */

const state = { session: null, ready: false, error: null }
let revision = 0
let subscribed = false
const listeners = new Set()

function notify() {
  listeners.forEach((listener) => listener({ ...state }))
}

export function getSessionState() {
  return { ...state }
}

// Register a listener. It is called right away if state is already
// known, and again on every change. Returns a function that removes it.
export function onSessionChange(listener) {
  listeners.add(listener)
  if (state.ready) listener({ ...state })
  return () => listeners.delete(listener)
}

export async function initAuth() {
  if (subscribed) return // one subscription per page, however many callers
  subscribed = true

  supabase.auth.onAuthStateChange((_event, nextSession) => {
    revision += 1
    state.session = nextSession
    state.ready = true
    state.error = null
    notify()
  })

  const startRevision = revision
  let result
  try {
    result = await supabase.auth.getSession()
  } catch (thrown) {
    result = { data: { session: null }, error: thrown }
  }

  // A newer auth event already arrived while we waited: it wins.
  if (revision !== startRevision) return

  if (result.error) {
    console.error('Session could not be read:', result.error)
    state.session = null
    state.error = result.error
  } else {
    state.session = result.data.session
    state.error = null
  }
  state.ready = true
  notify()
}

// Called only from the Sign out button handler. Returns the error, or null.
export async function signOut() {
  let error = null
  try {
    const result = await supabase.auth.signOut()
    error = result.error
  } catch (thrown) {
    error = thrown
  }
  if (error) console.error('Sign out failed:', error)
  return error
}
