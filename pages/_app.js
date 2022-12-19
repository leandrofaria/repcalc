import { useEffect } from "react";
import { useRouter } from "next/router";

import * as gtag from "../lib/gtag";
import Analytics from "../components/Analytics";

import LayoutWrapper from "../components/layout/layoutWrapper";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <LayoutWrapper>
      <Component {...pageProps} />
      <Analytics />
    </LayoutWrapper>
  );
}

export default MyApp;
