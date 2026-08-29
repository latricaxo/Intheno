/**
 * Sanitize a URL to only allow safe schemes (https, http).
 * Returns '#' for unsafe or invalid URLs.
 * This prevents javascript: and data: URL injection.
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '#';
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return url;
    }
    return '#';
  } catch {
    return '#';
  }
}

/**
 * Sanitize a string for use in CSS (prevent CSS injection).
 * Removes characters that could break out of a CSS context.
 */
export function sanitizeCssString(value: string): string {
  return value.replace(/[;<>"'{}()\[\]\\]/g, '');
}

/**
 * Sanitize content for display — strip script tags and event handlers.
 * Note: For rendering article content, prefer treating it as plain text
 * and not rendering as HTML at all, which is what we do in prose-intheno.
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/<[^>]+>/g, '');
}
