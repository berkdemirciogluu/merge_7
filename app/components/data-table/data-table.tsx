'use client';

import styles from './data-table.module.css';

/* eslint-disable-next-line */
export interface DataTableProps {}

export function DataTable(props: DataTableProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to DataTable!</h1>
    </div>
  );
}

export default DataTable;
