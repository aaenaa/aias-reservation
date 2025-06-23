import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Typography,
  Autocomplete,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DeleteIcon from "@mui/icons-material/Delete";
import { createEquipmentReservation } from "@/api/reservations-api";
import { useAlert } from "@/utilities/useAlert";

interface Equipment {
  id: number;
  name: string;
  quantity: number;
}

interface CreateAmenitiesProps {
  open: boolean;
  onClose: () => void;
  equipments: Equipment[]; // Equipments data from API
  mutate: () => void;
  handleAlertMessage: any
}

export const BookEquipments: React.FC<CreateAmenitiesProps> = ({
  open,
  onClose,
  equipments,
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
    purpose: "",
    startDateTime: new Date() as Date | null,
    endDateTime: new Date() as Date | null,
    status: "UPCOMING",
  });

  const [selectedEquipments, setSelectedEquipments] = useState<
    { id: number; name: string; quantity: number; maxQuantity: number }[]
  >([]);

  const handleAddEquipment = (_event: any, newValues: Equipment[]) => {
    setSelectedEquipments((prev) => {
      return newValues.map((equipment) => {
        const existing = prev.find((e) => e.id === equipment.id);
        return existing
          ? existing // Preserve existing quantity
          : {
              id: equipment.id,
              name: equipment.name,
              quantity: 1, // Default to 1 when first selected
              maxQuantity: equipment.quantity, // Store max limit
            };
      });
    });
  };

  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleQuantityChange = (id: number, value: number) => {
    setSelectedEquipments((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(value, item.maxQuantity) }
          : item
      )
    );
  };

  const handleRemoveEquipment = (id: number) => {
    setSelectedEquipments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    try {
      const convertToUTC8 = (date: Date | null) => {
        if (!date) return new Date().toISOString();
        const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000); 
        return utc8Date.toISOString();
      };

      const payload = {
        client: {
          id: 0,
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName,
          contact: formData.contact,
          email: formData.email,
          eventRole: formData.eventRole,
          address: formData.address,
        },
        equipments: selectedEquipments.map((item) => ({
          equipmentId: item.id,
          quantity: item.quantity,
        })),
        purpose: formData.purpose,
        status: formData.status,
        startDateTime: convertToUTC8(formData.startDateTime),
        endDateTime: convertToUTC8(formData.endDateTime),
      };

      const response = await createEquipmentReservation(payload);

      if (response.data.httpStatus === "UNPROCESSABLE_ENTITY") {
        handleAlertMessage(response.data.message, "error");
        onClose();
      } else {
        handleAlertMessage("Equipment successfully booked", "success");
        mutate();
        onClose();
      }
    } catch (error) {
      console.error("Failed to create booking", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Book Equipments</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3}>
            {/* Left Box - Client Information */}
            <Grid item xs={12} md={6}>
              <h3>Client Information</h3>
              <TextField
                fullWidth
                label="First Name"
                margin="dense"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                label="Middle Name"
                margin="dense"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    middleName: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                label="Last Name"
                margin="dense"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                label="Contact"
                margin="dense"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="dense"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                label="Event Role"
                margin="dense"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    eventRole: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                label="Address"
                margin="dense"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
              />
            </Grid>

            {/* Right Box - Equipment Information */}
            <Grid item xs={12} md={6}>
              <h3>Equipment Information</h3>

              {/* Multi-select Autocomplete for Equipments */}
              <Autocomplete
                multiple
                fullWidth
                options={equipments}
                getOptionLabel={(option) =>
                  `${option.name} (${option.quantity})`
                } // Show max quantity
                value={selectedEquipments}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={handleAddEquipment}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Equipments"
                    margin="dense"
                  />
                )}
              />

              {/* Selected Equipments with Quantity Input */}
              {selectedEquipments.length > 0 && (
                <div>
                  {selectedEquipments.map((equipment) => (
                    <Grid
                      key={equipment.id}
                      container
                      alignItems="center"
                      style={{
                        marginBottom: "2px",
                        paddingLeft: "5px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    >
                      <Grid item xs={6}>
                        <Typography>{equipment.name}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          type="number"
                          fullWidth
                          value={equipment.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              equipment.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          size="small"
                          inputProps={{
                            min: 1,
                            max: equipment.maxQuantity, // Max limit from API
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          onClick={() => handleRemoveEquipment(equipment.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </div>
              )}

              <TextField
                fullWidth
                label="Purpose"
                margin="dense"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    purpose: e.target.value,
                  }))
                }
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <DateTimePicker
                  sx={{ marginTop: 2 }}
                  label="Start Date & Time"
                  value={formData.startDateTime}
                  minDateTime={new Date()}
                  onChange={(newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDateTime: newValue,
                    }))
                  }
                  slots={{ textField: TextField }}
                />

                <DateTimePicker
                  sx={{ marginTop: 2 }}
                  label="End Date & Time"
                  value={formData.endDateTime}
                  minDateTime={new Date()}
                  onChange={(newValue) =>
                    setFormData((prev) => ({ ...prev, endDateTime: newValue }))
                  }
                  slots={{ textField: TextField }}
                />
              </div>

              <FormControl fullWidth margin="dense">
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
              </FormControl>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          Close
        </Button>
        <Button color="primary" variant="contained" onClick={handleSave}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
