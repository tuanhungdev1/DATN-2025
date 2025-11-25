import { useCallback, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ITableEntity {
  id: number;
  [key: string]: any;
}

export interface UseTableMenuReturn<T extends ITableEntity> {
  anchorEl: HTMLElement | null;
  selectedItem: T | null;
  isMenuOpen: boolean;
  handleOpenMenu: (event: React.MouseEvent<HTMLElement>, item: T) => void;
  handleCloseMenu: () => void;
}

export const useTableMenu = <
  T extends ITableEntity
>(): UseTableMenuReturn<T> => {
  const anchorRef = useRef<HTMLElement | null>(null);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const handleOpenMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>, item: T) => {
      anchorRef.current = event.currentTarget;
      setSelectedItem(item);
    },
    []
  );

  const handleCloseMenu = useCallback(() => {
    anchorRef.current = null;
    setSelectedItem(null);
  }, []);

  return {
    anchorEl: anchorRef.current,
    selectedItem,
    isMenuOpen: Boolean(anchorRef.current && selectedItem),
    handleOpenMenu,
    handleCloseMenu,
  };
};
