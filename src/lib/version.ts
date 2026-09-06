import pkg from "../../package.json";

/**
 * The app version, read from package.json at build time.
 *
 * Importing package.json is safe here because this module is only reached
 * from Server Components; the value is inlined into the rendered HTML.
 */
export const APP_VERSION: string = pkg.version;
