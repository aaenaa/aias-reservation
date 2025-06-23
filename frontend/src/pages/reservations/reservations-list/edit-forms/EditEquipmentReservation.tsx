import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateEquipmentReservation } from "@/api/reservations-api";

interface Equipment {
  id: number;
  name: string;
  quantity: number;
}

interface EditEquipmentProps {
  open: boolean;
  onClose: () => void;
  equipments: Equipment[];
  values: any;
  mutate: () => void;
}

export const EditEquipmentReservation: React.FC<EditEquipmentProps> = ({
  open,
  onClose,
  equipments,
  values,
  mutate,
}) => {
  const [formData, setFormData] = useState<any>({
    id: "",
    purpose: "",
    status: "",
    startDateTime: null,
    endDateTime: null,
    selectedEquipments: [],
    clientData: {},
  });

  console.log("values here ", values)
  useEffect(() => {
    if (values) {
      const parsedEquipments = values.name
        ? values.equipmentNamess.split(", ").map((item: any) => {
            const [quantityStr, ...nameParts] = item.split(" ");
            const quantity = parseInt(quantityStr, 10);
            const name = nameParts.slice(0, -2).join(" ");
            const equipmentId = parseInt(nameParts[nameParts.length - 1], 10);
            
            return {
              name,
              quantity,
              id: equipmentId, 
            };
          })
        : [];
  
      setFormData({
        id: values.id,
        purpose: values.purpose || "",
        status: values.status || "",
        startDateTime: values.startTime ? new Date(values.startTime) : null,
        endDateTime: values.endTime ? new Date(values.endTime) : null,
        selectedEquipments: parsedEquipments,
        clientData: values.clientData || {},
      });
    }
  }, [values]);
  
  

  const handleAddEquipment = (_event: any, newValues: Equipment[]) => {
    setFormData((prev: any) => ({
      ...prev,
      selectedEquipments: newValues,
    }));
  };

  const handleQuantityChange = (id: number, value: number) => {
    setFormData((prev: any) => ({
      ...prev,
      selectedEquipments: prev.selectedEquipments.map((item: any) =>
        item.id === id
          ? { ...item, quantity: Math.min(value, item.maxQuantity) }
          : item
      ),
    }));
  };

  const handleRemoveEquipment = (id: number) => {
    setFormData((prev: any) => ({
      ...prev,
      selectedEquipments: prev.selectedEquipments.filter(
        (item: any) => item.id !== id
      ),
    }));
  };

  const handleSave = async () => {
    try {
      const convertToUTC8 = (date: Date | null) => {
        if (!date) return new Date().toISOString();
        const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
        return utc8Date.toISOString();
      };

      const payload = {
        id: formData.id,
        purpose: formData.purpose,
        status: formData.status,
        startDateTime: convertToUTC8(formData.startDateTime),
        endDateTime: convertToUTC8(formData.endDateTime),
        equipments: formData.selectedEquipments.map((item: any) => ({
          equipmentId: item.id,
          quantity: item.quantity,
        })),
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
      };

      console.log("payload passed ", payload)

      await updateEquipmentReservation(payload, formData.id);
      mutate();
      onClose();
    } catch (error) {
      console.error("Failed to update reservation", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Update Equipment Reservation</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h3>Equipment Information</h3>
              <Autocomplete
                multiple
                fullWidth
                options={equipments}
                getOptionLabel={(option) =>
                  `${option.name} (${option.quantity})`
                }
                value={formData.selectedEquipments}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={handleAddEquipment}
                disabled
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Equipments"
                    margin="dense"
                  />
                )}
              />
              {/* {formData.selectedEquipments.length > 0 && (
                <div>
                  {formData.selectedEquipments.map((equipment: any) => (
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
                            max: equipment.maxQuantity,
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
              )} */}
              <TextField
                fullWidth
                label="Purpose"
                margin="dense"
                value={formData.purpose}
                onChange={(e) =>
                  setFormData((prev: any) => ({
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
                  onChange={(newValue) =>
                    setFormData((prev: any) => ({
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
                    setFormData((prev: any) => ({
                      ...prev,
                      endDateTime: newValue,
                    }))
                  }
                  slots={{ textField: TextField }}
                />
              </div>
              <FormControl fullWidth margin="dense">
                <Typography>Status</Typography>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
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
        <Button color="primary" variant="contained" onClick={handleSave}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
