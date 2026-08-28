"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import styles from "./Sidebar.module.css";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return <div className={styles.bareContent}>{children}</div>;
  }

  return (
    <>
      <Sidebar />
      <div className={styles.content}>{children}</div>
    </>
  );
}
