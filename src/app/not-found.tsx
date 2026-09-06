import ErrorPage from "@/components/errors/ErrorPage";

const NotFound = () => (
  <ErrorPage
    title="Erro 404 - Página não encontrada"
    message="A página que você está tentando acessar não existe."
  />
);

export default NotFound;
