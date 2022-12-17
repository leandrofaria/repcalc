import Link from "next/link";

const Calculadora = () => {
  return (
    <main>
      <div className="contentContainer">
        <div className="breadcrumbs">
          <span>
            <Link href="/">Home</Link> &rarr; Calculadora
          </span>
        </div>
        <div className="feature">
          <p>Página da calculadora.</p>
        </div>
      </div>
    </main>
  );
};

export default Calculadora;
