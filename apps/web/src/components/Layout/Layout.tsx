import { NavLink, Outlet } from "react-router";
import { ServerStatus } from "../ServerStatus/ServerStatus.tsx";
import styles from "./Layout.module.css";

export function Layout() {
  return (
    <>
      <a className={styles.skipLink} href="#main">
        Skip to main content
      </a>
      <header className={styles.header}>
        <div className={styles.inner}>
          <p className={styles.brand}>DrawWatch</p>
          <nav className={styles.nav} aria-label="Main">
            <NavLink to="/" end>
              Results
            </NavLink>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1} className={styles.main}>
        <ServerStatus />
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>
          Sample data for practice. DrawWatch is not affiliated with OLG and has no gambling
          features.
        </p>
      </footer>
    </>
  );
}
