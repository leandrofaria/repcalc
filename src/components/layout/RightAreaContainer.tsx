const RightAreaContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full sm:w-1/4 flex flex-col justify-start items-center">
      {children}
    </div>
  );
};

export default RightAreaContainer;
