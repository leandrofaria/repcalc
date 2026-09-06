const LeftAreaContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grow h-full w-full sm:w-3/4 sm:mr-6 sm:border-r-[1px] sm:border-r-hairline sm:pr-6">
      {children}
    </div>
  );
};

export default LeftAreaContainer;
