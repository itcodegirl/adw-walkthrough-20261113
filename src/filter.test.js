import { describe, expect, test } from 'vitest'
import { filterByTitle } from './filter.js'

// Placeholder rows in their fetched sort order.
const rows = [
  { title: 'Website launch', description: 'A clear first website.' },
  { title: 'Portfolio refresh', description: 'Improve an existing portfolio.' },
  { title: 'Content updates', description: 'Keep information current.' },
]

describe('filterByTitle', () => {
  test('an empty search returns every row in the same order', () => {
    expect(filterByTitle(rows, '')).toEqual(rows)
    expect(filterByTitle(rows, '   ')).toEqual(rows)
  })

  test('matches a mixed-case partial title', () => {
    expect(filterByTitle(rows, 'pORTfolio')).toEqual([rows[1]])
  })

  test('returns no rows when nothing matches', () => {
    expect(filterByTitle(rows, 'logo design')).toEqual([])
  })
})
