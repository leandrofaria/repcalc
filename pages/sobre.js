import Link from "next/link";

const Sobre = () => {
  return (
    <main>
      <div className="contentContainer">
        <div className="breadcrumbs">
          <span>
            <Link href="/">Home</Link> &rarr; Sobre
          </span>
        </div>
        <div className="feature">
          <p>Página de sobre.</p>
        </div>
      </div>
    </main>
  );
};

export default Sobre;
