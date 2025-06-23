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
import { createAmenity, updateAmenity } from "@/api/amenities-api";


interface CreateAmenitiesProps {
  open: boolean;
  onClose: () => void;
  mutateAmenities: () => void;
  values?: any;
}

export const CreateAmenities: React.FC<CreateAmenitiesProps> = ({
  open,
  onClose,
  mutateAmenities,
  values,
}) => {
  const [formData, setFormData] = useState(
    values || {
      name: "",
      capacity: 0,
      status: "GOOD",
    }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "capacity" ? Number(value) : value,
    });
  };

  const handleSave = async () => {
    if (!formData.name || formData.capacity <= 0) {
      setError("Please fill out all required fields correctly.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (values) {
        await updateAmenity(values.id, formData);
      } else {
        await createAmenity(formData);
      }
      mutateAmenities();
      onClose();
    } catch (err) {
      setError("Failed to save amenity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>{values ? "Update Amenity" : "Add New Amenity"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              size="small"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Capacity *"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              variant="outlined"
              size="small"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Condition *"
              name="status"
              value={formData.status}
              onChange={handleChange}
              variant="outlined"
              size="small"
              margin="dense"
            >
              <MenuItem value="GOOD">Good</MenuItem>
              <MenuItem value="FAIR">Fair</MenuItem>
              <MenuItem value="UNDER_MAINTENANCE">Under Maintenance</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        {error && (
          <p style={{ color: "red", marginTop: 10, textAlign: "center" }}>{error}</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained" disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={isLoading}>
          {isLoading ? "Saving..." : values ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
