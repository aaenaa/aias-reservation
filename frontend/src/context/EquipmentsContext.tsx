import React, { createContext, useContext, ReactNode, useState } from "react";
import useSWR from "swr";
import { searchAllEquipments } from "@/api/equipments-api";

type Equipment = {
  id: number;
  name: string;
  type: string;
  quantity: number;
  category: string;
  status: string
};

type EquipmentsContextType = {
  equipments: Equipment[];
  isLoading: boolean;
  totalPages: number;
  totalElements: number;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  mutateEquipments: () => void;
};

const EquipmentsContext = createContext<EquipmentsContextType | undefined>(
  undefined
);

export const useEquipmentsContext = (): EquipmentsContextType => {
  const context = useContext(EquipmentsContext);
  if (!context) {
    throw new Error(
      "useEquipmentsContext must be used within an EquipmentsContextProvider"
    );
  }
  return context;
};

type EquipmentsContextProviderProps = {
  children: ReactNode;
};

export const EquipmentsContextProvider: React.FC<
  EquipmentsContextProviderProps
> = ({ children }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");

  const fetcher = async () => {
    const response = await searchAllEquipments({
      keyword,
      page,
      size: rowsPerPage,
    });
    return response.data?.object;
  };

  const { data, isLoading, mutate } = useSWR(
    `/api/equipments?keyword=${keyword}&page=${page}&size=${rowsPerPage}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  return (
    <EquipmentsContext.Provider
      value={{
        equipments: data?.content || [],
        isLoading,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        keyword,
        setKeyword,
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
        mutateEquipments: mutate,
      }}
    >
      {children}
    </EquipmentsContext.Provider>
  );
};
