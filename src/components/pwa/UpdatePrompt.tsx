"use client";

import { Button, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

/**
 * Offers a reload when a new service worker is waiting.
 *
 * The worker deliberately does not skipWaiting: swapping chunks under a
 * running SPA is how someone loses a calculation half-typed. The new version
 * takes over only when the user says so.
 */
const UpdatePrompt = () => {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;

    const watch = (registration: ServiceWorkerRegistration) => {
      if (registration.waiting) setWaiting(registration.waiting);
      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (installing === null) return;
        installing.addEventListener("statechange", () => {
          // A worker that reaches "installed" while another controls the page
          // is an update sitting in the wings.
          if (
            installing.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            setWaiting(installing);
          }
        });
      });
    };

    navigator.serviceWorker.ready.then((registration) => {
      if (!cancelled) watch(registration);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (waiting === null) return null;

  return (
    <Snackbar
      open
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      message="Nova versão disponível"
      action={
        <Button
          color="primary"
          size="small"
          onClick={() => {
            waiting.postMessage({ type: "SKIP_WAITING" });
            // The new worker takes control, then the page picks it up.
            navigator.serviceWorker.addEventListener(
              "controllerchange",
              () => window.location.reload(),
              { once: true }
            );
          }}
        >
          Recarregar
        </Button>
      }
    />
  );
};

export default UpdatePrompt;
