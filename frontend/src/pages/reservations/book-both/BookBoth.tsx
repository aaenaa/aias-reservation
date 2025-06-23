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
  SelectChangeEvent,
  Autocomplete,
  Chip,
  IconButton,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DeleteIcon from "@mui/icons-material/Delete";

interface CreateAmenitiesProps {
  open: boolean;
  onClose: () => void;
}

export const BookBoth: React.FC<CreateAmenitiesProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    contact: "",
    email: "",
    eventRole: "",
    address: "",
    purpose: "",
    amenity: "",
    startDateTime: new Date() as Date | null,
    endDateTime: new Date() as Date | null,
    statusAmenity: "UPCOMING",
    statusEquipment: "UPCOMING",
  });

  const equipmentOptions = ["Baseball Bat (15)", "Basketball (20)"];

  const [selectedEquipments, setSelectedEquipments] = useState<
    { name: string; quantity: number }[]
  >([]);

  const handleAddEquipment = (
    event: React.ChangeEvent<{}>,
    newValues: string[]
  ) => {
    setSelectedEquipments((prev) => {
      const updatedEquipments = newValues.map((item) => {
        const existing = prev.find((e) => e.name === item);
        return existing ? existing : { name: item, quantity: 1 };
      });
      return updatedEquipments;
    });
  };

  const handleQuantityChange = (name: string, value: number) => {
    setSelectedEquipments((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, quantity: value } : item
      )
    );
  };

  const handleRemoveEquipment = (name: string) => {
    setSelectedEquipments((prev) => prev.filter((item) => item.name !== name));
  };

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Book Equipments</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3}>
            {/* Left Box - Client Information */}
            <Grid item xs={3}>
              <h3>Client Information</h3>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                margin="dense"
              />
              <TextField
                fullWidth
                label="Middle Name"
                name="middleName"
                margin="dense"
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                margin="dense"
              />
              <TextField
                fullWidth
                label="Contact"
                name="contact"
                margin="dense"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                margin="dense"
              />
              <TextField
                fullWidth
                label="Event Role"
                name="eventRole"
                margin="dense"
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                margin="dense"
              />
            </Grid>

            {/* Right Box - Equipment Information */}
            <Grid item xs={4.5}>
              <h3>Equipment Information</h3>

              {/* Multi-select Autocomplete for Equipments */}
              <FormControl fullWidth margin="dense">
                <Typography>Select Equipments</Typography>
                <Autocomplete
                  multiple
                  fullWidth
                  options={equipmentOptions}
                  value={selectedEquipments.map((item) => item.name)}
                  onChange={handleAddEquipment}
                  renderInput={(params) => <TextField {...params} />}
                />
              </FormControl>

              {/* List of Selected Equipments with Quantity Input */}
              {selectedEquipments.length > 0 && (
                <div>
                  {selectedEquipments.map((equipment) => (
                    <Grid
                      key={equipment.name}
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
                              equipment.name,
                              parseInt(e.target.value) || 1
                            )
                          }
                          size="small"
                          inputProps={{ min: 1 }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          onClick={() => handleRemoveEquipment(equipment.name)}
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
                name="purpose"
                margin="dense"
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 4,
                }}
              >
                <DateTimePicker
                  sx={{ marginTop: 2 }}
                  label="Start Date & Time"
                  value={formData.startDateTime}
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
                  onChange={(newValue) =>
                    setFormData((prev) => ({ ...prev, endDateTime: newValue }))
                  }
                  slots={{ textField: TextField }}
                />
              </div>

              <FormControl fullWidth margin="dense" sx={{ marginTop: 2 }}>
                <Typography>Status</Typography>
                <Select name="status" value={formData.statusEquipment}>
                  <MenuItem value="UPCOMING">UPCOMING</MenuItem>
                  <MenuItem value="ONGOING">ON GOING</MenuItem>
                  <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                  <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4.5}>
              <h3>Amenity Information</h3>

              <FormControl fullWidth margin="dense">
                <Typography>Amenity</Typography>
                <Select
                  name="amenity"
                  value={formData.amenity}
                  onChange={handleChange}
                >
                  <MenuItem value="Gymnasium">Gymnasium</MenuItem>
                  <MenuItem value="Field">Field</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                margin="dense"
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 4,
                }}
              >
                <DateTimePicker
                  sx={{ marginTop: 2 }}
                  label="Start Date & Time"
                  value={formData.startDateTime}
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
                  onChange={(newValue) =>
                    setFormData((prev) => ({ ...prev, endDateTime: newValue }))
                  }
                  slots={{ textField: TextField }}
                />
              </div>

              <FormControl fullWidth margin="dense" sx={{ marginTop: 2 }}>
                <Typography>Status</Typography>
                <Select
                  name="status"
                  value={formData.statusEquipment}
                  //   onChange={handleChange}
                >
                  <MenuItem value="UPCOMING">UPCOMING</MenuItem>
                  <MenuItem value="ONGOING">ON GOING</MenuItem>
                  <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                  <MenuItem value="COMPLETED">COMPLETED</MenuItem>
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
        <Button color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
