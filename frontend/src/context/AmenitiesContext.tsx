import React, { createContext, useContext, ReactNode, useState } from "react";
import useSWR from "swr";
import { searchAllAmenities } from "@/api/amenities-api";

type Amenity = {
  id: number;
  name: string;
  capacity: number;
  status: string;
};

type AmenitiesContextType = {
  amenities: Amenity[];
  isLoading: boolean;
  totalPages: number;
  totalElements: number;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  mutateAmenities: () => void;
};

const AmenitiesContext = createContext<AmenitiesContextType | undefined>(
  undefined
);

export const useAmenitiesContext = (): AmenitiesContextType => {
  const context = useContext(AmenitiesContext);
  if (!context) {
    throw new Error(
      "useAmenitiesContext must be used within an AmenitiesContextProvider"
    );
  }
  return context;
};

type AmenitiesContextProviderProps = {
  children: ReactNode;
};

export const AmenitiesContextProvider: React.FC<
  AmenitiesContextProviderProps
> = ({ children }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");

  const fetcher = async () => {
    const response = await searchAllAmenities({
      keyword,
      page,
      size: rowsPerPage,
    });
    return response.data?.object;
  };

  const { data, isLoading, mutate } = useSWR(
    `/api/amenities?keyword=${keyword}&page=${page}&size=${rowsPerPage}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  return (
    <AmenitiesContext.Provider
      value={{
        amenities: data?.content || [],
        isLoading,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        keyword,
        setKeyword,
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
        mutateAmenities: mutate,
      }}
    >
      {children}
    </AmenitiesContext.Provider>
  );
};