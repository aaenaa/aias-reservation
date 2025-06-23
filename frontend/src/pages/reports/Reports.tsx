import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import useAxios from "@/utilities/useAxios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const Reports = () => {
  const SERVICE = `${import.meta.env.VITE_DND_APP_BACKEND_URL}`;
  const [filters, setFilters] = useState({ from: "", to: "", status: "UPCOMING" });

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGenerate = async () => {
    const { from, to, status } = filters;
    if (!from || !to) {
      alert("Please select a date range.");
      return;
    }

    try {
      const response = await useAxios.get(`${SERVICE}/reservation/report`, {
        params: { startDate: from, endDate: to, status },
        headers: { Accept: "*/*" },
      });

      const reportData = response.data?.object;

      console.log("Report data ", reportData)
      generatePDF(reportData);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    }
  };

  const generatePDF = (data: any) => {
    const doc = new jsPDF();
    doc.text("Reservation Report", 14, 15);
  
    // Utility function to format date as YYYY-MM-DD
    const formatDate = (date: string) => {
      const d = new Date(date);
      return d.toLocaleDateString("en-CA"); // "en-CA" locale returns YYYY-MM-DD format
    };
  
    if (data.amenityReservations.length) {
      autoTable(doc, {
        startY: 20,
        head: [["ID", "Amenity", "Client", "Purpose", "Status", "Start", "End"]],
        body: data.amenityReservations.map((res: any) => [
          res.id,
          res.amenities?.name || "N/A",  // Safely access amenities.name
          `${res.client.firstName} ${res.client.lastName}`,
          res.purpose,
          res.status,
          formatDate(res.startDateTime),
          formatDate(res.endDateTime),
        ]),
        theme: "striped",
      });
    }
  
    if (data.equipmentReservations.length) {
      autoTable(doc, {
        startY: doc?.lastAutoTable?.finalY + 10,
        head: [["ID", "Equipment", "Client", "Purpose", "Status", "Quantity", "Start", "End"]],
        body: data.equipmentReservations.map((res: any) => [
          res.id,
          res.reservationDetails?.[0]?.equipment?.name || "N/A", // Safely access equipment.name
          `${res.client.firstName} ${res.client.lastName}`,
          res.purpose,
          res.status,
          res.reservationDetails?.[0]?.quantity || "N/A", // Add quantity
          formatDate(res.startDateTime),
          formatDate(res.endDateTime),
        ]),
        theme: "striped",
      });
    }
  
    doc.save("Reservation_Report.pdf");
  };
  
  


  console.log("filters here ", filters);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={"100%"}
    >
      <Box
        p={4}
        border={1}
        borderRadius={2}
        borderColor="grey.300"
        boxShadow={3}
        display="flex"
        flexDirection="column"
        gap={2}
        width={300}
      >
        <Typography variant="h6" align="center">
          Reports
        </Typography>
        <TextField
          label="From"
          type="date"
          name="from"
          value={filters.from}
          onChange={handleTextFieldChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To"
          type="date"
          name="to"
          value={filters.to}
          onChange={handleTextFieldChange}
          InputLabelProps={{ shrink: true }}
        />
        <Select
          name="status"
          value={filters.status}
          onChange={(e) => handleSelectChange(e as SelectChangeEvent<string>)}
          displayEmpty
        >
          <MenuItem value="UPCOMING">UPCOMING</MenuItem>
          <MenuItem value="ONGOING">ON GOING</MenuItem>
          <MenuItem value="CANCELLED">CANCELLED</MenuItem>
          <MenuItem value="COMPLETED">COMPLETED</MenuItem>
          <MenuItem value="ALL">ALL</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerate}
          fullWidth
        >
          Generate PDF
        </Button>
      </Box>
    </Box>
  );
};