"use client";

import { useEffect } from "react";
import { Button } from "@mui/material";
import ErrorPage from "@/components/errors/ErrorPage";

/**
 * Next passes { error, reset } here. The previous version accepted neither,
 * so the error was never surfaced and the user had no way to retry.
 */
const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPage
      title="Erro"
      message="Não foi possível processar sua requisição no momento. Tente novamente mais tarde."
      action={
        <div className="mt-6">
          <Button variant="contained" onClick={reset}>
            Tentar novamente
          </Button>
        </div>
      }
    />
  );
};

export default Error;
