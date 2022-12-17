import Link from "next/link";

const Jornada = () => {
  return (
    <main>
      <div className="contentContainer">
        <div className="breadcrumbs">
          <span>
            <Link href="/">Home</Link> &rarr; Jornada
          </span>
        </div>
        <div className="feature">
          <p>Página da jornada.</p>
        </div>
      </div>
    </main>
  );
};

export default Jornada;
