/**
 * Escapes characters that would be interpreted as HTML.
 * Use this before inserting any user-supplied text into the DOM
 * via dangerouslySetInnerHTML or innerHTML.
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Strips all HTML tags from a string.
 * Use when you want plain text from a field that may contain markup.
 */
export function stripTags(text: string): string {
  return text.replace(/<[^>]*>/g, '')
}

/**
 * Truncates a string and escapes it — safe for display in tooltips / titles.
 */
export function safeTruncate(text: string, maxLength = 200): string {
  const truncated = text.length > maxLength ? text.slice(0, maxLength) + '…' : text
  return escapeHtml(truncated)
}
