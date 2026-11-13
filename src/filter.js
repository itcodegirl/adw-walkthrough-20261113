/* ---------------------------------------------------------------
   Pure filtering over rows already in memory. No DOM, no network.
   --------------------------------------------------------------- */

// Case-insensitive, partial match on title. An empty or whitespace-only
// query returns the rows unchanged, in their existing order.
export function filterByTitle(rows, query) {
  const needle = String(query ?? '').trim().toLowerCase()
  if (needle === '') return rows
  return rows.filter((row) => String(row.title ?? '').toLowerCase().includes(needle))
}
