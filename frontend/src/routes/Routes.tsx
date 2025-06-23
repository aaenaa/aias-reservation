import { Route, Routes } from "react-router-dom";
import {
  Amenities,
  Dashboard,
  Equipments,
  Reports,
  Reservations,
  Users,
} from "@/pages/index";
import { UsersContextProvider } from "@/context/UsersContext";
import { EquipmentsContextProvider } from "@/context/EquipmentsContext";
import { AmenitiesContextProvider } from "@/context/AmenitiesContext";
import { DashboardContextProvider } from "@/context/DashboardContext";

export const allRoutes = [
  {
    path: "/dashboard",
    page: (
      <DashboardContextProvider>
        <Dashboard />
      </DashboardContextProvider>
    ),
    name: "Dashboard",
    roles: ["Administration", "Scheduler", "Schedule Viewer"],
  },
  {
    path: "/amenities",
    page: (
      <AmenitiesContextProvider>
        <Amenities />
      </AmenitiesContextProvider>
    ),
    name: "Amenities",
    roles: ["Administration"],
  },
  {
    path: "/equipments",
    page: (
      <EquipmentsContextProvider>
        <Equipments />
      </EquipmentsContextProvider>
    ),
    name: "Equipments",
    roles: ["Administration"],
  },
  {
    path: "/reports",
    page: <Reports />,
    name: "Reports",
    roles: ["Administration", "Scheduler", "Schedule Viewer"], 
  },
  {
    path: "/reservations",
    page: <Reservations />,
    name: "Reservations",
    roles: ["Administration", "Scheduler", "Schedule Viewer"], 
  },
  {
    path: "/users",
    page: (
      <UsersContextProvider>
        <Users />
      </UsersContextProvider>
    ),
    name: "Users",
    roles: ["Administration"],
  },
];

export const AppRoutes = () => {
  const role = localStorage.getItem("role") || ""; 

  const allowedRoutes = allRoutes.filter((route) =>
    route.roles.includes(role)
  );

  return (
    <Routes>
      {allowedRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.page} />
      ))}
    </Routes>
  );
};
