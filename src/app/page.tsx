import { redirect } from "next/navigation";

/**
 * The menu of four cards was one tap between the user and the tool, now that
 * the navigation bar is on screen at all times.
 */
const Page = () => {
  redirect("/jornada");
};

export default Page;
