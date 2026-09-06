"use client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { ptBR } from "@mui/x-date-pickers/locales";
import "dayjs/locale/pt-br";

// Without this the pickers' own strings stay in English: the hour and minute
// sections announce as "Hours" and "Minutes", and the open button as
// "Choose time", inside a Portuguese app.
const localeText =
  ptBR.components.MuiLocalizationProvider.defaultProps.localeText;

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
  <LocalizationProvider
    dateAdapter={AdapterDayjs}
    adapterLocale="pt-br"
    localeText={localeText}
  >
    {children}
  </LocalizationProvider>
);

export default DateLocalizationProvider;
