import TopNav from "@/components/layout/TopNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grow flex flex-col">
      <TopNav />
      <div className="grow">{children}</div>
    </div>
  );
}
