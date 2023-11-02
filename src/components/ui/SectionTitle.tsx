const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h2 className="w-full text-lg font-semibold pb-2 mb-6 border-b-[1px] border-b-[#E9E9E9]">
      {children}
    </h2>
  );
};

export default SectionTitle;
