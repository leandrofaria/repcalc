const ContentContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="page-container w-full flex flex-col justify-start items-start rounded-[12px] border border-hairline bg-surface p-5 sm:p-7">
      {children}
    </div>
  );
};

export default ContentContainer;
