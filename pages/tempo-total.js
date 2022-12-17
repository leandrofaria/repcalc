import Link from "next/link";

const TempoTotal = () => {
  return (
    <main>
      <div className="contentContainer">
        <div className="breadcrumbs">
          <span>
            <Link href="/">Home</Link> &rarr; TempoTotal
          </span>
        </div>
        <div className="feature">
          <p>Página do tempo total.</p>
        </div>
      </div>
    </main>
  );
};

export default TempoTotal;
