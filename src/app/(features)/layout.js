import FeatureContainer from "@/components/layout/featureContainer";
import "../globals.css";
import TopNav from "@/components/ui/topNav";

export default function Layout({ children }) {
  return (
    <main>
      <TopNav />
      <FeatureContainer>{children}</FeatureContainer>
    </main>
  );
}
