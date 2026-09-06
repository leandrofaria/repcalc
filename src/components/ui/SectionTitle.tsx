/**
 * The page heading.
 *
 * This was an h2 with no h1 anywhere on the content pages: the only h1 was
 * the site name in the header, and another in the footer.
 */
const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="w-full font-display text-xl font-bold tracking-tight pb-3 mb-5 border-b border-hairline">
      {children}
    </h1>
  );
};

export default SectionTitle;
