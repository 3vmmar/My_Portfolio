import Link from "next/link";
import { identity } from "@/lib/content";

export const metadata = {
  title: "Page not found",
  // Inheriting the root canonical would make the 404 claim to be the homepage.
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <section className="nf">
      <div className="stone" aria-hidden="true" />
      <div className="wall-wash" aria-hidden="true" />
      <div className="fixture nf-fixture" aria-hidden="true" />
      <div className="shell nf-inner">
        <p className="hero-type nf-code">404</p>
        <h1 className="h1">This room is empty.</h1>
        <p className="lead" style={{ marginTop: "1rem" }}>
          The page you asked for does not exist. The work is one click away.
        </p>
        <div className="nf-actions">
          <Link className="btn btn-primary" href="/">
            Back to the start
          </Link>
          <Link className="btn btn-ghost" href="/#work">
            See the work
          </Link>
          <a className="btn btn-ghost" href={`mailto:${identity.email}`}>
            Email me
          </a>
        </div>
      </div>
    </section>
  );
}
