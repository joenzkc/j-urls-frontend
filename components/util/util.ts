export function validateCustomString(str: string) {
  // Remove slash, backslash, non-printable characters
  str = str.replace(/[\/\\^\x00-\x1F\x7F]/g, "");

  // Remove semicolon and comma
  str = str.replace(/[\;,]/g, "");

  // Limit length
  if (str.length > 50) {
    return false;
  }

  // Only allow alphanumeric, hyphens, underscores
  if (!str.match(/^[a-zA-Z0-9\-_]+$/)) {
    return false;
  }

  return true;
}
