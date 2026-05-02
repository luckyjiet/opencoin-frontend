function parseListUrls(value: string | undefined): string[] {
  return value
    ? value
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean)
    : []
}

export const UNSUPPORTED_LIST_URLS: string[] = parseListUrls(process.env.REACT_APP_UNSUPPORTED_TOKEN_LIST_URLS)

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...parseListUrls(process.env.REACT_APP_DEFAULT_TOKEN_LIST_URLS || process.env.REACT_APP_DEFAULT_TOKEN_LIST_URL),
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = parseListUrls(
  process.env.REACT_APP_DEFAULT_ACTIVE_LIST_URLS ||
    process.env.REACT_APP_DEFAULT_TOKEN_LIST_URLS ||
    process.env.REACT_APP_DEFAULT_TOKEN_LIST_URL,
)
