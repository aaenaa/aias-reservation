import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { updateAmenityReservation } from "@/api/reservations-api";

interface BookAmenityProps {
  open: boolean;
  onClose: () => void;
  amenities: { id: number; name: string }[];
  values: any
  mutate: () => void;
}

export const EditAmenityReservation: React.FC<BookAmenityProps> = ({
  open,
  onClose,
  amenities,
  values,
  mutate
}) => {
    const [formData, setFormData] = useState<any>({
        amenityId: "",
        purpose: "",
        status: "",
        startDateTime: null,
        endDateTime: null,
        contact: "",
        email: "",
        client: "",
        clientData: {}
      });

      useEffect(() => {
        if (values) {
          const matchedAmenity = amenities.find(a => a.name === values.name);
    
          setFormData({
            id: values.id,
            amenityId: matchedAmenity?.id || "",
            purpose: values.purpose || "",
            status: values.status || "",
            startDateTime: values.startTime ? new Date(values.startTime) : null,
            endDateTime: values.endTime ? new Date(values.endTime) : null,
            contact: values.contact || "",
            email: values.email || "",
            client: values.client || "",
            clientData: values.clientData || {}
          });
        }
      }, [values, amenities]);

  console.log("values here ", values)


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
    setFormData((prev: any) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;
    if (name) {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    }
  };

  console.log("values", values)


  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const convertToUTC8 = (date: Date | null) => {
        if (!date) return new Date().toISOString();
        const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000); 
        return utc8Date.toISOString();
      };
      const payload = {
        client: {
          id: formData.clientData.id,
          firstName: formData.clientData.firstName,
          middleName: formData.clientData.middleInitial,
          lastName: formData.clientData.lastName,
          contact: formData.clientData.contact,
          email: formData.clientData.email,
          eventRole: formData.clientData.eventRole,
          address: formData.clientData.address,
        },
        amenityId: parseInt(formData.amenityId),
        purpose: formData.purpose,
        status: formData.status,
        startDateTime: convertToUTC8(formData.startDateTime),
        endDateTime: convertToUTC8(formData.endDateTime),
      }

      console.log("paylaod passed ", payload)

      await updateAmenityReservation(payload, formData.id);
      mutate()
      onClose();
    } catch (error) {
      console.error("Failed to create booking", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Update Amenity Reservation</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container>
            <Grid item xs={12}>
              <h3>Amenity Information</h3>
              <FormControl fullWidth margin="dense" error={!!errors.amenityId}>
                <Typography>Amenity</Typography>
                <Select
                  name="amenityId"
                  value={formData.amenityId}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="">Select an Amenity</MenuItem>
                  {amenities.map((amenity) => (
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
                  <MenuItem value="COMPLETED">COMPLETED</MenuItem>
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
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
