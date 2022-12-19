import Header from "./header";
import Footer from "./footer";

const LayoutWrapper = (props) => {
  return (
    <div className="mainContainer">
      <Header />
      {props.children}
      <Footer />
    </div>
  );
};

export default LayoutWrapper;
