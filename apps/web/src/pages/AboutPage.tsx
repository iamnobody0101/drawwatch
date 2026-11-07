import styles from "./AboutPage.module.css";

export function AboutPage() {
  return (
    <div>
      <h1 className={styles.title}>About DrawWatch</h1>

      <section className={styles.section}>
        <h2 className={styles.heading}>What is DrawWatch?</h2>
        <p>
          DrawWatch shows past lottery draw results in a simple, clear way. You can look at the
          winning numbers and the bonus number of each draw, and filter the draws by game.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>About the data</h2>
        <p>
          All draws on this site are sample data. A computer program made them at random, so they
          are not real lottery results. Please do not use them to make any decision.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Not affiliated with OLG</h2>
        <p>
          DrawWatch is a learning project. It is not affiliated with, endorsed by, or connected to
          OLG (Ontario Lottery and Gaming). It has no gambling features: you cannot buy tickets,
          place bets, or win anything here.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Source code</h2>
        <p>
          The code is open source. You can read it on{" "}
          <a className={styles.link} href="https://github.com/iamnobody0101/drawwatch">
            GitHub
          </a>
          .
        </p>
      </section>
    </div>
  );
}
