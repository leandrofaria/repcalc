import LayoutWrapper from "../components/layout/layoutWrapper";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <LayoutWrapper>
      <Component {...pageProps} />
    </LayoutWrapper>
  );
}

export default MyApp;
