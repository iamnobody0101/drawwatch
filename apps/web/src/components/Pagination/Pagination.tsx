import { Button } from "../Button/Button.tsx";
import styles from "./Pagination.module.css";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <div className={styles.slot}>
        {page > 1 ? <Button onClick={() => onPageChange(page - 1)}>Previous</Button> : null}
      </div>
      <p className={styles.status} aria-live="polite">
        Page {page} of {totalPages}
      </p>
      <div className={styles.slot}>
        {page < totalPages ? <Button onClick={() => onPageChange(page + 1)}>Next</Button> : null}
      </div>
    </nav>
  );
}
