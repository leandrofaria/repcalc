const FeatureContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-center items-start">
      {children}
    </div>
  );
};

export default FeatureContainer;
