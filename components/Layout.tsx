import * as React from "react";
import Head from "next/head";
import styles from "./Layout.module.scss";

export type LayoutProps = {
  children: React.ReactChildren;
  title: string;
};

export default function Layout({ children, title }) {
  return (
    <main className={styles.layout}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </main>
  );
}
