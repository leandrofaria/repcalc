/**
 * The app version, injected at build time from package.json by next.config.ts.
 *
 * Importing package.json directly from a component only worked while that
 * component stayed server-only; the day it did not, the whole manifest would
 * have shipped to the browser.
 */
export const APP_VERSION: string = process.env.NEXT_PUBLIC_APP_VERSION ?? "";
