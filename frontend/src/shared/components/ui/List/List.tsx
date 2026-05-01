import styles from "./list.module.css";

type ListProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyComponent: React.ReactNode;
};

export function List<T>({ items, renderItem, emptyComponent }: ListProps<T>) {
  if (items.length === 0) {
    return <>{emptyComponent}</>;
  }

  return (
    <div className={styles.listContainer}>
      {items.map((item, index) => (
        renderItem(item, index)
      ))}
    </div>
  );
}
