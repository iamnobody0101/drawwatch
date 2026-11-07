import type { ReactNode } from "react";
import styles from "./StatusMessage.module.css";

type StatusMessageProps = {
  title: string;
  message: string;
  role?: "status" | "alert";
  action?: ReactNode;
};

export function StatusMessage({ title, message, role = "status", action }: StatusMessageProps) {
  return (
    <div className={styles.card} role={role}>
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
