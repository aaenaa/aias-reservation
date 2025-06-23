import React, { createContext, useContext, ReactNode, useState } from "react";
import useSWR from "swr";
import { searchAllUsers } from "@/api/users-api";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  middleInitial: string;
  username: string;
  role: string;
  contact: string;
  email: string;
  address: string;
  dateCreated: string;
  dateModified: string;
};

type UsersContextType = {
  users: User[];
  isLoading: boolean;
  totalPages: number;
  totalElements: number;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  mutateUsers: () => void;
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const useUsersContext = (): UsersContextType => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsersContext must be used within a UsersContextProvider");
  }
  return context;
};

type UsersContextProviderProps = {
  children: ReactNode;
};

export const UsersContextProvider: React.FC<UsersContextProviderProps> = ({ children }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");
  
  const fetcher = async () => {
    const response = await searchAllUsers({ keyword, page, size: rowsPerPage });
    return response.data?.object; 
  };

  const { data, isLoading, mutate } = useSWR(
    `/api/users?keyword=${keyword}&page=${page}&size=${rowsPerPage}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  return (
    <UsersContext.Provider
      value={{
        users: data?.content || [],
        isLoading,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        keyword,
        setKeyword,
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
        mutateUsers: mutate,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
