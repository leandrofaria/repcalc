import Link from "next/link";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

/** Shared body for the error and not-found pages, which were near-identical. */
const ErrorPage = ({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) => (
  <div className="page-container flex w-full flex-col items-start gap-4 rounded-[12px] border border-hairline bg-surface p-6">
    <h1 className="font-display text-xl font-bold tracking-tight">{title}</h1>
    <p className="text-ink-muted">{message}</p>
    {action}
    <Link
      href="/"
      className="mx-auto mt-6 flex flex-col items-center gap-1 font-semibold text-brand"
    >
      <HomeOutlinedIcon fontSize="large" aria-hidden />
      Voltar ao início
    </Link>
  </div>
);

export default ErrorPage;
