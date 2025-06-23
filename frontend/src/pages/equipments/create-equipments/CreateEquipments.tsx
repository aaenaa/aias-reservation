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
} from "@mui/material";
import { createEquipment, updateEquipment } from "@/api/equipments-api";

interface EquipmentProps {
  name: string
  type: string
  quantity: number
  category: string
  status: string
  dateAcquired: string
}

interface CreateEquipmentsProps {
  open: boolean;
  onClose: () => void;
  mutateEquipments: () => void;
  values?: any;
}



export const CreateEquipments: React.FC<CreateEquipmentsProps> = ({
  open,
  onClose,
  mutateEquipments,
  values,
}) => {
  const [formData, setFormData] = useState(
    values || {
      name: "",
      type: "",
      quantity: 0,
      status: "GOOD",
      dateAcquired: "",
      category: "",
    }
  );

  console.log("Values here ", values);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "quantity" ? Number(value) : value,
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.type || formData.quantity <= 0 || !formData.category) {
      setError("Please fill out all required fields correctly.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (values) {
        await updateEquipment(values.id, formData);
      } else {
        await createEquipment(formData);
      }
      mutateEquipments();
      onClose();
    } catch (err) {
      setError("Failed to save equipment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>{values ? "Update Equipment" : "Add New Equipment"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Equipment Name *" name="name" value={formData.name} onChange={handleChange} variant="outlined" size="small" margin="dense" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Equipment Type *" name="type" value={formData.type} onChange={handleChange} variant="outlined" size="small" margin="dense" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Quantity *" name="quantity" type="number" value={formData.quantity} onChange={handleChange} variant="outlined" size="small" margin="dense" />
          </Grid>
          <Grid item xs={12}>
            <TextField select fullWidth label="Condition *" name="status" value={formData.status} onChange={handleChange} variant="outlined" size="small" margin="dense">
              <MenuItem value="GOOD">Good</MenuItem>
              <MenuItem value="BAD">Bad</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Date Acquired *" name="dateAcquired" type="date" value={formData.dateAcquired} onChange={handleChange} InputLabelProps={{ shrink: true }} variant="outlined" size="small" margin="dense" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Category *" name="category" value={formData.category} onChange={handleChange} variant="outlined" size="small" margin="dense" />
          </Grid>
        </Grid>
        {error && <p style={{ color: "red", marginTop: 10, textAlign: "center" }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained" disabled={isLoading}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={isLoading}>{isLoading ? "Saving..." : values ? "Update" : "Save"}</Button>
      </DialogActions>
    </Dialog>
  );
};