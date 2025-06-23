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
  Avatar,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { createUser, updateUser } from "@/api/users-api";

interface CreateUsersProps {
  open: boolean;
  onClose: () => void;
  mutateUsers: any;
  values?: any;
}

export const CreateUsers: React.FC<CreateUsersProps> = ({ open, onClose, mutateUsers, values }) => {
  const [formData, setFormData] = useState(
    values || {
      firstName: "",
      middleInitial: "",
      lastName: "",
      username: "",
      role: "",
      contact: "",
      email: "",
      password: "",
      address: "",
      profileImage: "",
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file)
      setFormData({ ...formData, profileImage: localUrl });
    }
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.username || !formData.role) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("data passed ", formData)
      if (values) {
        await updateUser(values.id, formData);
      } else {
        await createUser(formData);
      }
      mutateUsers();
      onClose();
    } catch (err) {
      setError("Failed to save user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>{values ? "Update User" : "Add New User"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="First Name *" name="firstName" value={formData.firstName} onChange={handleChange} variant="outlined" size="small" margin="dense" />
            <TextField fullWidth label="Middle Initial" name="middleInitial" value={formData.middleInitial} onChange={handleChange} variant="outlined" size="small" margin="dense" />
            <TextField fullWidth label="Last Name *" name="lastName" value={formData.lastName} onChange={handleChange} variant="outlined" size="small" margin="dense" />
            <TextField fullWidth label="Username *" name="username" value={formData.username} onChange={handleChange} variant="outlined" size="small" margin="dense" disabled={!!values} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="Role *" name="role" value={formData.role} onChange={handleChange} variant="outlined" size="small" margin="dense">
              <MenuItem value="Administration">Administration</MenuItem>
              <MenuItem value="Scheduler">Scheduler</MenuItem>
              <MenuItem value="Schedule Viewer">Schedule Viewer</MenuItem>
            </TextField>
            <TextField fullWidth label="Contact Number" name="contact" value={formData.contact} onChange={handleChange} variant="outlined" size="small" margin="dense" />
            <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} variant="outlined" size="small" margin="dense" />
            {!values && <TextField fullWidth label="Password *" name="password" type="password" value={formData.password} onChange={handleChange} variant="outlined" size="small" margin="dense" />}
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} variant="outlined" size="small" margin="dense" multiline rows={2} />
          </Grid>

          {/* Profile Image Upload */}
          <Grid item xs={12} display="flex" flexDirection="column" alignItems="center">
            <Avatar src={formData.profileImage} sx={{ width: 80, height: 80, mb: 1 }} />
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="profile-upload"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="profile-upload">
              <IconButton color="primary" component="span" sx={{ mb: 2 }}>
                <PhotoCamera />
              </IconButton>
            </label>
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