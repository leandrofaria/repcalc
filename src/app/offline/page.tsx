import ErrorPage from "@/components/errors/ErrorPage";

export const metadata = { title: "REP Calc - Sem conexão" };

/**
 * Only reached for a URL outside the app: every real route is precached and
 * works offline, which is the point for someone standing at a time clock in
 * a building with no signal.
 */
const Offline = () => (
  <ErrorPage
    title="Sem conexão"
    message="Esta página não está disponível offline. As telas do REP Calc continuam funcionando normalmente."
  />
);

export default Offline;
