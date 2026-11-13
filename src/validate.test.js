import { describe, expect, it, test } from 'vitest'
import { validateName, validateEmail, validateMessage } from './validate.js'

// Contract: '' means accepted; any other string is the user-facing fix message.

describe('validateEmail', () => {
  test('accepts a normal email address', () => {
    expect(validateEmail('jo@example.com')).toBe('')
  })

  test('rejects an address with no @', () => {
    expect(validateEmail('jo.example.com')).toBe('Use an email address like you@example.com.')
  })

  test('rejects an empty address', () => {
    expect(validateEmail('')).toBe('Add an email address so we know how to reply.')
  })
})

describe('validateName', () => {
  test('rejects a whitespace-only name', () => {
    expect(validateName('   ')).toBe('Tell us your name.')
  })

  test('accepts a normal name', () => {
    expect(validateName('Jo')).toBe('')
  })
})

describe('validateMessage', () => {
  test('rejects a whitespace-only message', () => {
    expect(validateMessage(' \n\t ')).toBe('Tell us a little about your project.')
  })
})

// Learner-written: corrected after observing the deliberate red assertion.
it('accepts an email padded with surrounding whitespace', () => {
  expect(validateEmail('  learner@example.com  ')).toBe('')
})

// Learner-written from the promise inventory: a valid project message is accepted.
it('accepts a nonblank project message', () => {
  expect(validateMessage('  Please refresh my local shop website.  ')).toBe('')
})
