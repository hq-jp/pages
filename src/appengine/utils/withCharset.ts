const textualTypes =
  /^(text\/|application\/(json|xml|javascript)\b|[^;]*\+(json|xml)\b)/i;

/**
 * Adds `charset=utf-8` to a textual content type that has no charset.
 * Without it, browsers decode UTF-8 text (e.g. `text/markdown`) with a legacy
 * encoding and non-ASCII characters turn into mojibake.
 */
export default (contentType: string | undefined): string | undefined => {
  if (!contentType || !textualTypes.test(contentType)) return contentType;
  if (/;\s*charset=/i.test(contentType)) return contentType;
  return `${contentType}; charset=utf-8`;
};
