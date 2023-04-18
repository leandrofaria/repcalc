import { useEffect } from "react";
import { useRouter } from "next/router";

import * as gtag from "../lib/gtag";
import Analytics from "../components/Analytics";

import Head from "next/head";
import LayoutWrapper from "../components/layout/layoutWrapper";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  if (gtag.GA_TRACKING_ID != null) {
    useEffect(() => {
      const handleRouteChange = (url) => {
        gtag.pageview(url);
      };
      router.events.on("routeChangeComplete", handleRouteChange);

      return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }, [router.events]);
  } else {
    console.log("Analytics is not enabled.");
  }

  return (
    <LayoutWrapper>
      <Head>
        <title>REP Calc - Leandro Faria</title>
        <meta
          name="description"
          content="Calculadora de horas para uso com relógio eletrônico de ponto"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </LayoutWrapper>
  );
}

export default MyApp;
