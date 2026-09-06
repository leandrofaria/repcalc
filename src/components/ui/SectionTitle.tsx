/**
 * The page heading.
 *
 * This was an h2 with no h1 anywhere on the content pages: the only h1 was
 * the site name in the header, and another in the footer.
 */
const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="w-full text-lg font-semibold pb-2 mb-6 border-b-[1px] border-b-[#E9E9E9]">
      {children}
    </h1>
  );
};

export default SectionTitle;
