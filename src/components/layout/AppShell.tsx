import Footer from "./Footer";

/**
 * The frame every screen sits in: a column exactly the height of the screen,
 * with one scrolling area in the middle.
 *
 * The document itself does not scroll. That is the point — it is what makes
 * the bottom bar and the footer land in the same place on every browser,
 * rather than depending on whether the phone's address bar happens to be
 * collapsed at that moment. Everything that must stay put is a sibling of the
 * scroller, in the normal flow, so nothing is positioned against a viewport
 * that changes size while you read.
 *
 * The cost is that the address bar no longer retracts as you scroll a page,
 * since the page is not what scrolls. Installed — which is how this app is
 * meant to be used, in front of the clock — there is no address bar to
 * retract, and the trade buys a layout that cannot shift.
 */
const AppShell = ({
  children,
  bottomBar,
}: {
  children: React.ReactNode;
  /** The bar within reach of the thumb, on a phone. */
  bottomBar?: React.ReactNode;
}) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* The only thing that scrolls. min-h-0 is what lets it actually
          shrink inside the flex column instead of pushing the bar off. */}
      <div
        data-scroll-area
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
      >
        <main className="flex grow flex-col items-stretch justify-start px-4 pt-4 pb-4 sm:justify-center sm:px-6 sm:py-6">
          {children}
        </main>
      </div>
      {bottomBar}
      <Footer />
    </div>
  );
};

export default AppShell;
