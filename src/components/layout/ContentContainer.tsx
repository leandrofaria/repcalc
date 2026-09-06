/**
 * The column every screen lives in.
 *
 * The nested card-inside-a-card is gone: the screens now compose their own
 * cards, and this only sets the width and the rhythm between them.
 */
const ContentContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="page-container flex w-full flex-col items-stretch gap-4 sm:max-w-[760px]">
      {children}
    </div>
  );
};

export default ContentContainer;
