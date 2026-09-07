"use client";

import { useSyncExternalStore } from "react";

/**
 * What the screen actually reports, read from the running app.
 *
 * A phone's layout depends on values no desktop browser can be made to
 * produce: whether the window is drawn behind the system bars, and how much
 * of it those bars cover. Guessing at them from a screenshot cost two
 * attempts at the footer strip, so the app now says.
 *
 * Collapsed and at the foot of the About screen, because it is for the rare
 * moment someone is chasing a layout bug on a device that is not to hand.
 */

/** The insets, read off a probe rather than guessed. */
function readInsets(): Record<string, string> {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;visibility:hidden;padding:" +
    "env(safe-area-inset-top) env(safe-area-inset-right) " +
    "env(safe-area-inset-bottom) env(safe-area-inset-left)";
  document.body.appendChild(probe);
  const style = getComputedStyle(probe);
  const insets = {
    topo: style.paddingTop,
    direita: style.paddingRight,
    base: style.paddingBottom,
    esquerda: style.paddingLeft,
  };
  probe.remove();
  return insets;
}

function snapshot(): string {
  const insets = readInsets();
  const body = document.body.getBoundingClientRect();
  const footer = document.querySelector("footer");
  const footerBox = footer?.getBoundingClientRect();
  const bar = document.querySelector("[data-bottom-bar]");
  const barBox = bar?.getBoundingClientRect();

  const modes = ["standalone", "fullscreen", "minimal-ui", "browser"].filter(
    (mode) => window.matchMedia(`(display-mode: ${mode})`).matches
  );

  return JSON.stringify(
    {
      modo: modes.join(", ") || "desconhecido",
      insets,
      janela: {
        innerHeight: window.innerHeight,
        clientHeight: document.documentElement.clientHeight,
        screen: window.screen.height,
        visual: Math.round(window.visualViewport?.height ?? 0),
        dpr: window.devicePixelRatio,
      },
      moldura: {
        alturaDoBody: Math.round(body.height),
        baseDoBody: Math.round(body.bottom),
        sobraAbaixoDoBody: Math.round(window.innerHeight - body.bottom),
      },
      rodape: footerBox
        ? {
            padBase: footer ? getComputedStyle(footer).paddingBottom : "?",
            altura: Math.round(footerBox.height),
            base: Math.round(footerBox.bottom),
            sobraAbaixo: Math.round(window.innerHeight - footerBox.bottom),
          }
        : "oculto",
      barra: barBox
        ? {
            padBase: bar ? getComputedStyle(bar).paddingBottom : "?",
            altura: Math.round(barBox.height),
            base: Math.round(barBox.bottom),
          }
        : "ausente",
    },
    null,
    1
  );
}

/**
 * Read through useSyncExternalStore rather than an effect, so it re-reads on
 * a resize or a rotation instead of showing a value from first paint.
 */
function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  window.visualViewport?.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("resize", onChange);
    window.visualViewport?.removeEventListener("resize", onChange);
  };
}

const ScreenDiagnostics = () => {
  const report = useSyncExternalStore(
    subscribe,
    snapshot,
    () => "medido apenas no navegador"
  );

  return (
    <details className="mt-6 rounded-[9px] border border-hairline p-3 text-sm">
      <summary className="cursor-pointer font-medium text-ink-muted">
        Diagnóstico da tela
      </summary>
      <pre className="tabular mt-3 overflow-x-auto text-[11px] leading-relaxed text-ink-muted">
        {report}
      </pre>
    </details>
  );
};

export default ScreenDiagnostics;
