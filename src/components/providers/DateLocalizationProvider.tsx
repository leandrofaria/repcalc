"use client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";

/**
 * Supplies the date adapter to the pickers.
 *
 * Renamed from MultiProvider, which promised several providers and held one,
 * and given the pt-BR locale it was missing: the picker UI rendered in
 * English inside a Portuguese app.
 */
const DateLocalizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
    {children}
  </LocalizationProvider>
);

export default DateLocalizationProvider;
