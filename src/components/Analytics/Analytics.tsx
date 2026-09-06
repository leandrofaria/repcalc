import Script from "next/script";

/**
 * Google Analytics, genuinely off unless configured.
 *
 * The previous condition was `process.env.NEXT_PUBLIC_GA_ID !== null`. An
 * unset variable is undefined, not null, so it was always true: the app
 * loaded gtag.js with the id "undefined" even with no configuration at all,
 * contradicting the README.
 *
 * The full `process.env.NEXT_PUBLIC_*` expression has to be read literally,
 * because it is substituted at build time and a computed key would not be.
 */
const Analytics = () => {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID;
  if (!measurementId || process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="GoogleAnalytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `,
        }}
      />
    </>
  );
};

export default Analytics;
