const ContentContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto h-full flex flex-col justify-start items-start bg-surface shadow-md p-6">
      {children}
    </div>
  );
};

export default ContentContainer;
