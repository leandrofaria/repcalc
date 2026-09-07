import AppShell from "@/components/layout/AppShell";
import BottomBar from "@/components/layout/BottomBar";
import TopNav from "@/components/layout/TopNav";

/**
 * The four tool screens, and only them.
 *
 * The navigation lives here rather than in the root layout because the home
 * does not take part in it: the way out of a tool is the bar, and the way
 * back to the home is the name in the header. Putting the bar above the home
 * as well would offer a second route to a screen that is already the one you
 * are on.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell bottomBar={<BottomBar />}>
      <div className="flex grow flex-col">
        <TopNav />
        <div className="grow">{children}</div>
      </div>
    </AppShell>
  );
}
