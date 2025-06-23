import {
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Tabs,
  Tab,
  TablePagination,
  Card,
  CardContent,
} from "@mui/material";
import { useDashboardContext } from "@/context/DashboardContext";
import { DateTime } from "luxon";
import {
  searchStatusCountsAmenity,
  searchStatusCountsEquipments,
} from "@/api/equipments-api";
import useSWR from "swr";

export const Dashboard = () => {
  const {
    selectedTab,
    setSelectedTab,
    equipmentsReservationData,
    equipmentsLoading,
    equipmentsPage,
    equipmentsRowsPerPage,
    equipmentsKeyword,
    equipmentsStatus,
    setEquipmentsPage,
    setEquipmentsRowsPerPage,
    setEquipmentsKeyword,
    setEquipmentsStatus,
    amenitiesReservationData,
    amenitiesLoading,
    amenitiesPage,
    amenitiesRowsPerPage,
    amenitiesKeyword,
    amenitiesStatus,
    setAmenitiesPage,
    setAmenitiesRowsPerPage,
    setAmenitiesKeyword,
    setAmenitiesStatus,
  } = useDashboardContext();

  const isEquipmentTab = selectedTab === "Equipments";
  const data = isEquipmentTab
    ? equipmentsReservationData
    : amenitiesReservationData;
  const loading = isEquipmentTab ? equipmentsLoading : amenitiesLoading;

  const fetchDashboardAmenity = async () => {
    const response = await searchStatusCountsAmenity();
    return response?.data.object ?? [];
  };

  const fetchDashboardEquipments = async () => {
    const response = await searchStatusCountsEquipments();
    return response?.data.object ?? [];
  };

  const { data: dashboardAmenitiesCount } = useSWR(
    `/amenity-reservation/dashboard`,
    fetchDashboardAmenity,
    { revalidateOnFocus: true }
  );

  const { data: dashboardEquipmentsCount } = useSWR(
    `/amenity-equipments/dashboard`,
    fetchDashboardEquipments,
    { revalidateOnFocus: true }
  );

  const handleTabChange = (e: any, newValue: any) => setSelectedTab(newValue);

  const formatDateTime = (dateTimeString: string) => {
    return DateTime.fromISO(dateTimeString).toFormat("MMMM d, yyyy h:mm a");
  };

  const statusCounts = isEquipmentTab ? dashboardEquipmentsCount : dashboardAmenitiesCount;
  const statusMap: Record<"UPCOMING" | "ONGOING" | "CANCELLED" | "COMPLETED", string> = {
    UPCOMING: "#AEDFF7",
    ONGOING: "#C8E6C9",
    CANCELLED: "#F8BBD0",
    COMPLETED: "#D1C4E9",
  };


  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Dashboard
      </Typography>

      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{ marginBottom: 2 }}
      >
        <Tab label="Equipment" value="Equipments" />
        <Tab label="Amenities" value="Amenities" />
      </Tabs>

      {/* Status Count Boxes */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        {Object.entries(statusMap).map(([status, color]) => {
          const count = statusCounts?.find((s: any) => s.status === status)?.count || 0;
          return (
            <Grid item xs={3} key={status}>
              <Paper
                sx={{
                  padding: 2,
                  backgroundColor: color,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                <Typography variant="h6">{status}</Typography>
                <Typography variant="h4">{count}</Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Search & Filter Section */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <Typography>Search</Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={isEquipmentTab ? equipmentsKeyword : amenitiesKeyword}
              onChange={(e) =>
                isEquipmentTab
                  ? setEquipmentsKeyword(e.target.value)
                  : setAmenitiesKeyword(e.target.value)
              }
              size="small"
            />
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <Typography>Status</Typography>
            <Select
              value={isEquipmentTab ? equipmentsStatus : amenitiesStatus}
              onChange={(e) =>
                isEquipmentTab
                  ? setEquipmentsStatus(e.target.value)
                  : setAmenitiesStatus(e.target.value)
              }
              size="small"
            >
              <MenuItem value="ALL">ALL</MenuItem>
              <MenuItem value="UPCOMING">UPCOMING</MenuItem>
              <MenuItem value="ONGOING">ON GOING</MenuItem>
              <MenuItem value="CANCELLED">CANCELLED</MenuItem>
              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Data Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>
                <b>ID</b>
              </TableCell>
              <TableCell>
                <b>Client</b>
              </TableCell>
              <TableCell>
                <b>{isEquipmentTab ? "Equipment" : "Amenity"}</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
              <TableCell>
                <b>Purpose</b>
              </TableCell>
              <TableCell>
                <b>Start Date</b>
              </TableCell>
              <TableCell>
                <b>End Date</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.length > 0 ? (
              data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    {item.client?.firstName + " " + item.client?.lastName}
                  </TableCell>
                  <TableCell>
                    {isEquipmentTab
                      ? item.reservationDetails
                          ?.map((detail: any) => detail.equipment.name)
                          .join(", ")
                      : item.amenities?.name}
                  </TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.purpose}</TableCell>
                  <TableCell>{formatDateTime(item.startDateTime)}</TableCell>
                  <TableCell>{formatDateTime(item.endDateTime)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={data?.length || 0}
        page={isEquipmentTab ? equipmentsPage : amenitiesPage}
        onPageChange={(_, newPage) =>
          isEquipmentTab
            ? setEquipmentsPage(newPage)
            : setAmenitiesPage(newPage)
        }
        rowsPerPage={
          isEquipmentTab ? equipmentsRowsPerPage : amenitiesRowsPerPage
        }
        onRowsPerPageChange={(e) =>
          isEquipmentTab
            ? setEquipmentsRowsPerPage(parseInt(e.target.value, 10))
            : setAmenitiesRowsPerPage(parseInt(e.target.value, 10))
        }
      />
    </div>
  );
};
