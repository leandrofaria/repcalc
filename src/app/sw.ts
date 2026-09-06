/// <reference lib="webworker" />
// The service worker runs in a worker scope, not the DOM, so it pulls in
// the WebWorker lib on its own rather than widening the app tsconfig.

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { NetworkOnly, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  // Deliberately not skipWaiting: swapping chunks under a running SPA is how
  // you get a blank screen in the middle of a calculation. The page offers a
  // reload instead, and the new worker takes over when the user accepts.
  skipWaiting: false,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Analytics is never cached. A stale tracker keeps reporting from a
    // version of the code that no longer exists, and there is nothing useful
    // it can do offline anyway.
    {
      matcher: ({ url }) =>
        url.hostname === "www.googletagmanager.com" ||
        url.hostname === "www.google-analytics.com",
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

serwist.addEventListeners();
