import { useRef, useState } from "react";
import {
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { useForm } from "@/utilities/useForm";
import { CreateEquipments } from "./create-equipments/CreateEquipments";
import { useEquipmentsContext } from "@/context/EquipmentsContext";
import { deleteEquipment } from "@/api/equipments-api";

export const Equipments = () => {
  const {
    equipments,
    isLoading,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    setKeyword,
    totalElements,
    mutateEquipments,
  } = useEquipmentsContext();

  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new debounce timeout
    debounceTimeout.current = setTimeout(() => {
      setKeyword(value);
      setPage(0); // Reset page when searching
    }, 1000);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page when changing page size
  };

  const {
    showModal: showCreate,
    handleDisplayData: handleDisplayCreate,
    handleCloseModal: handleCloseCreate,
  } = useForm();

  const {
    formData: values,
    showModal: showUpdate,
    handleUpdateData: handleDisplayUpdate,
    handleCloseModal: handleCloseUpdate,
  } = useForm();

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Equipments
      </Typography>

      <Grid
        container
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        sx={{ marginBottom: 2 }}
      >
        <Grid item xs={3}>
          <FormControl fullWidth>
            <Typography>Search</Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
            />
          </FormControl>
        </Grid>
        <Grid item>
          <Button onClick={handleDisplayCreate} variant="contained">
            Create Equipment
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>
                <b>ID</b>
              </TableCell>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Type</b>
              </TableCell>
              <TableCell>
                <b>Quantity</b>
              </TableCell>
              <TableCell>
                <b>Condition</b>
              </TableCell>
              <TableCell>
                <b>Category</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : equipments.length > 0 ? (
              equipments.map((equipment) => (
                <TableRow key={equipment.id}>
                  <TableCell>{equipment.id}</TableCell>
                  <TableCell>{equipment.name}</TableCell>
                  <TableCell>{equipment.type}</TableCell>
                  <TableCell>{equipment.quantity}</TableCell>
                  <TableCell>{equipment?.status}</TableCell>
                  <TableCell>{equipment.category}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      sx={{ marginRight: 1, width: 100 }}
                      size="small"
                      onClick={() => handleDisplayUpdate(equipment)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ width: 100 }}
                      size="small"
                      onClick={async () => {
                        await deleteEquipment(equipment.id);
                        mutateEquipments();
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No matching equipment found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalElements}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {showCreate && (
        <CreateEquipments
          open={showCreate}
          onClose={handleCloseCreate}
          mutateEquipments={mutateEquipments}
        />
      )}

      {showUpdate && (
        <CreateEquipments
          values={values}
          open={showUpdate}
          onClose={handleCloseUpdate}
          mutateEquipments={mutateEquipments}
        />
      )}
    </div>
  );
};
