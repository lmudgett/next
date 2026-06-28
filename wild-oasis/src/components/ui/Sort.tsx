"use client";
import { ReactNode, useState } from "react";
import { HiArrowDown, HiArrowUp, HiArrowsUpDown } from "react-icons/hi2";

enum SortOrder {
  NONE = "none",
  ASC = "asc",
  DESC = "desc",
}

type SortProps<T extends Record<string, unknown>> = {
  columnName: keyof T;
  children: ReactNode;
  data?: T[];
  setData?: React.Dispatch<React.SetStateAction<T[] | undefined>>;
  activeSort?: string | null;
  setActiveSort?: React.Dispatch<React.SetStateAction<string | null>>;
};

/**
 * sort component allows for the sorting of a dataset in ascending, descending or default. sorts can be linked using the setActiveSort and activeSort properties
 * @param param0
 * @returns
 */
export const Sort = <T extends Record<string, unknown>>({
  children,
  columnName,
  data,
  setData,
  activeSort,
  setActiveSort,
}: SortProps<T>) => {
  const [currentSort, setCurrentSort] = useState<SortOrder>(SortOrder.NONE);

  const handleOnClick = () => {
    const nextSortOrder =
      currentSort === SortOrder.NONE
        ? SortOrder.DESC
        : currentSort === SortOrder.DESC
        ? SortOrder.ASC
        : SortOrder.NONE;

    setCurrentSort(nextSortOrder);

    if (!data || !setData) return;

    //active sort is used to link the sorts together
    if (setActiveSort) setActiveSort(columnName as string);

    if (nextSortOrder === SortOrder.NONE) {
      setData([...data]);
      return;
    }

    setData(
      [...data].sort((a, b) => {
        const valueA = a[columnName] as string | number;
        const valueB = b[columnName] as string | number;

        if (typeof valueA === "number" && typeof valueB === "number") {
          return nextSortOrder === SortOrder.ASC
            ? valueA - valueB
            : valueB - valueA;
        }

        if (typeof valueA === "string" && typeof valueB === "string") {
          return nextSortOrder === SortOrder.ASC
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        return 0;
      })
    );
  };

  // When another column becomes the active sort, reset this one's indicator.
  // Adjusting state during render avoids an effect's cascading re-render.
  const [prevActiveSort, setPrevActiveSort] = useState(activeSort);
  if (activeSort !== prevActiveSort) {
    setPrevActiveSort(activeSort);
    if (activeSort && activeSort !== columnName) setCurrentSort(SortOrder.NONE);
  }

  return (
    <>
      <button
        className="flex items-center justify-center gap-2 w-full"
        onClick={handleOnClick}
      >
        {children}
        {currentSort === SortOrder.ASC ? (
          <HiArrowUp size={18} />
        ) : currentSort === SortOrder.DESC ? (
          <HiArrowDown size={18} />
        ) : (
          <HiArrowsUpDown size={18} />
        )}
      </button>
    </>
  );
};
