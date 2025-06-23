import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  Select,
  Typography,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { createAmenityReservation } from "@/api/reservations-api";

interface BookAmenityProps {
  open: boolean;
  onClose: () => void;
  amenities: { id: number; name: string, status: string }[];
  mutate: () => void;
  handleAlertMessage: any
}

export const BookAmenity: React.FC<BookAmenityProps> = ({
  open,
  onClose,
  amenities,
  mutate,
  handleAlertMessage
}) => {

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    contact: "",
    email: "",
    eventRole: "",
    address: "",
    amenityId: "",
    purpose: "",
    startDateTime: new Date(),
    endDateTime: new Date(),
    status: "UPCOMING",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    let newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "middleName" && !value) {
        newErrors[key] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const convertToUTC8 = (date: Date | null) => {
        if (!date) return new Date().toISOString();
        const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000); 
        return utc8Date.toISOString();
      };

      const response = await createAmenityReservation({
        client: {
          id: 0,
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          contact: formData.contact,
          email: formData.email,
          eventRole: formData.eventRole,
          address: formData.address,
        },
        amenityId: parseInt(formData.amenityId),
        purpose: formData.purpose,
        status: formData.status,
        startDateTime: convertToUTC8(formData.startDateTime),
        endDateTime: convertToUTC8(formData.endDateTime),
      });

      if (response.data.httpStatus === "UNPROCESSABLE_ENTITY") {
        handleAlertMessage(response.data.message, "error");
        onClose();
      } else {
        handleAlertMessage("Amenity successfully booked", "success");
        mutate();
        onClose();
      }
    } catch (error: any) {
      console.error("Failed to create booking", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Book Amenity</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <h3>Client Information</h3>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleTextFieldChange}
                margin="dense"
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
              <TextField
                fullWidth
                label="Middle Name (Optional)"
                name="middleName"
                value={formData.middleName}
                onChange={handleTextFieldChange}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleTextFieldChange}
                margin="dense"
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
              <TextField
                fullWidth
                label="Contact"
                name="contact"
                value={formData.contact}
                onChange={handleTextFieldChange}
                margin="dense"
                error={!!errors.contact}
                helperText={errors.contact}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleTextFieldChange}
                margin="dense"
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                fullWidth
                label="Event Role"
                name="eventRole"
                value={formData.eventRole}
                onChange={handleTextFieldChange}
                margin="dense"
                error={!!errors.eventRole}
                helperText={errors.eventRole}
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleTextFieldChange}
                margin="dense"
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <h3>Amenity Information</h3>
              <FormControl fullWidth margin="dense" error={!!errors.amenityId}>
                <Typography>Amenity</Typography>
                <Select
                  name="amenityId"
                  value={formData.amenityId}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="">Select an Amenity</MenuItem>
                  {amenities.filter(item => item.status !== "UNDER_MAINTENANCE").map((amenity) => (
                    <MenuItem key={amenity.id} value={amenity.id}>
                      {amenity.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.amenityId}</FormHelperText>
              </FormControl>
              <TextField
                fullWidth
                label="Purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleTextFieldChange}
                margin="dense"
                error={!!errors.purpose}
                helperText={errors.purpose}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <DateTimePicker
                  label="Start Date & Time"
                  value={formData.startDateTime}
                  minDateTime={new Date()}
                  onChange={(newValue) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      startDateTime: newValue,
                    }))
                  }
                />
                <DateTimePicker
                  label="End Date & Time"
                  value={formData.endDateTime}
                  minDateTime={new Date()}
                  onChange={(newValue) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      endDateTime: newValue,
                    }))
                  }
                />
              </div>
              <FormControl fullWidth margin="dense" error={!!errors.status}>
                <Typography>Status</Typography>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="UPCOMING">UPCOMING</MenuItem>
                  <MenuItem value="ONGOING">ON GOING</MenuItem>
                  <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                </Select>
                <FormHelperText>{errors.status}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          Close
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Book
        </Button>
      </DialogActions>
    </Dialog>
  );
};
