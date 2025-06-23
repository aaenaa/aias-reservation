import React, { createContext, useContext, ReactNode, useState } from "react";
import useSWR from "swr";
import {
  searchAllAmenityDashboard,
  searchAllEquipmentDashboard,
} from "@/api/dashboard-api";

type DashboardContextType = {
  equipmentsReservationData: any;
  equipmentsLoading: boolean;
  mutateEquipments: () => void;
  amenitiesReservationData: any;
  amenitiesLoading: boolean;
  mutateAmenities: () => void;
  selectedTab: "Equipments" | "Amenities";
  setSelectedTab: (tab: "Equipments" | "Amenities") => void;
  equipmentsPage: number
  equipmentsRowsPerPage: number
  equipmentsKeyword: string
  equipmentsStatus: string
  amenitiesPage: number
  amenitiesRowsPerPage: number
  amenitiesKeyword: string
  amenitiesStatus: string
  setEquipmentsPage: (page: number) => void; 
  setEquipmentsRowsPerPage: (rows: number) => void;  
  setEquipmentsKeyword: (keyword: string) => void;  
  setEquipmentsStatus: (status: string) => void; 
  setAmenitiesPage: (page: number) => void;  
  setAmenitiesRowsPerPage: (rows: number) => void; 
  setAmenitiesKeyword: (keyword: string) => void;  
  setAmenitiesStatus: (status: string) => void;  
};

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const useDashboardContext = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within a DashboardContextProvider"
    );
  }
  return context;
};

type DashboardContextProviderProps = {
  children: ReactNode;
};

export const DashboardContextProvider: React.FC<
  DashboardContextProviderProps
> = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState<"Equipments" | "Amenities">(
    "Equipments"
  );

  const [equipmentsPage, setEquipmentsPage] = useState(0);
  const [equipmentsRowsPerPage, setEquipmentsRowsPerPage] = useState(10);
  const [equipmentsKeyword, setEquipmentsKeyword] = useState("");
  const [equipmentsStatus, setEquipmentsStatus] = useState("ALL");

  const [amenitiesPage, setAmenitiesPage] = useState(0);
  const [amenitiesRowsPerPage, setAmenitiesRowsPerPage] = useState(10);
  const [amenitiesKeyword, setAmenitiesKeyword] = useState("");
  const [amenitiesStatus, setAmenitiesStatus] = useState("ALL");

  const fetcher = async () => {
    return selectedTab === "Equipments"
      ? searchAllEquipmentDashboard({
          keyword: equipmentsKeyword,
          page: equipmentsPage,
          size: equipmentsRowsPerPage,
          equipmentReservationStatus: equipmentsStatus,
        })
      : searchAllAmenityDashboard({
          keyword: amenitiesKeyword,
          page: amenitiesPage,
          size: amenitiesRowsPerPage,
          amenityReservationStatus: amenitiesStatus,
        });
  };

  const {
    data: equipmentsData,
    isLoading: equipmentsLoading,
    mutate: mutateEquipments,
  } = useSWR(
    selectedTab === "Equipments" ? `/equipment-reservation?keyword=${equipmentsKeyword}&page=${equipmentsPage}&size=${equipmentsRowsPerPage}&equipmentReservationStatus=${equipmentsStatus}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateIfStale: true }
  );

  const {
    data: amenitiesData,
    isLoading: amenitiesLoading,
    mutate: mutateAmenities,
  } = useSWR(
    selectedTab === "Amenities" ? `/amenity-reservation/search?keyword=${amenitiesKeyword}&page=${amenitiesPage}&size=${amenitiesRowsPerPage}&amenityReservationStatus=${amenitiesStatus}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateIfStale: true }
  );

  console.log("equipments data ", equipmentsData?.data.object.content)

  return (
    <DashboardContext.Provider
      value={{
        equipmentsReservationData: equipmentsData?.data.object.content,
        equipmentsLoading: equipmentsLoading,
        mutateEquipments: mutateEquipments,
        amenitiesReservationData: amenitiesData?.data.object.content,
        amenitiesLoading: amenitiesLoading,
        mutateAmenities: mutateAmenities,
        selectedTab,
        setSelectedTab,
        equipmentsPage,
        equipmentsRowsPerPage,
        equipmentsKeyword,
        equipmentsStatus,
        amenitiesPage,
        amenitiesRowsPerPage,
        amenitiesKeyword,
        amenitiesStatus,
        setEquipmentsPage,
        setEquipmentsRowsPerPage,
        setEquipmentsKeyword,
        setEquipmentsStatus,
        setAmenitiesPage,
        setAmenitiesRowsPerPage,
        setAmenitiesKeyword,
        setAmenitiesStatus
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
