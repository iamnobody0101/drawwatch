import { Link as RouterLink } from "react-router";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
  return (
    <div>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>
        Sorry, we could not find this page. The address may be wrong, or the page may have moved.
      </p>
      <RouterLink className={styles.link} to="/">
        Go to the results
      </RouterLink>
    </div>
  );
}
