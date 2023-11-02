const LeftAreaContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grow h-full w-full sm:w-3/4 sm:mr-6 sm:border-r-[1px] sm:border-r-[#E9E9E9] sm:pr-6">
      {children}
    </div>
  );
};

export default LeftAreaContainer;
