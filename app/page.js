import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section style={{ textAlign: "center", padding: "4rem 0" }}>
        <h1>Welcome to ZoroKart</h1>
        <p>buy stuff.</p>
        <div style={{ marginTop: "2rem" }}>
          <Link href="/register">
            <button>
              Get Started
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
