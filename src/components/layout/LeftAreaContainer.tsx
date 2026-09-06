const LeftAreaContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grow w-full sm:w-3/4 sm:mr-7 sm:border-r sm:border-r-hairline sm:pr-7">
      {children}
    </div>
  );
};

export default LeftAreaContainer;
