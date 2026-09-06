import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";

/**
 * Monochrome stroke icons, in the theme's colour.
 *
 * The previous five were Icons8 illustrations that did not read as a set — a
 * house, a calculator, a bar chart, some map pins and a speech bubble — and
 * lost all definition at 20px next to the new palette.
 */
const ICONS = {
  "/jornada": ScheduleOutlinedIcon,
  "/calculadora": CalculateOutlinedIcon,
  "/tempo-total": SummarizeOutlinedIcon,
  "/sobre": InfoOutlinedIcon,
} as const;

const NavIcon = ({
  href,
  fontSize = "small",
}: {
  href: string;
  fontSize?: "small" | "medium";
}) => {
  const Icon = ICONS[href as keyof typeof ICONS];
  return Icon === undefined ? null : <Icon fontSize={fontSize} aria-hidden />;
};

export default NavIcon;
