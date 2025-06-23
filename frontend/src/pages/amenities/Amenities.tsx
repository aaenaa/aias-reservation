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
import { CreateAmenities } from "./create-amenities/CreateAmenities";
import { useAmenitiesContext } from "@/context/AmenitiesContext";
import { deleteAmenity } from "@/api/amenities-api";

export const Amenities = () => {
  const {
    amenities,
    isLoading,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    setKeyword,
    totalElements,
    mutateAmenities,
  } = useAmenitiesContext();

  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setKeyword(value);
      setPage(0);
    }, 1000);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        Amenities
      </Typography>

      {/* Search & Filter Section */}
      <Grid
        container
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"flex-end"}
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
              size={"small"}
            />
          </FormControl>
        </Grid>
        <Grid item>
          <Button onClick={handleDisplayCreate} variant="contained">
            Create Amenity
          </Button>
        </Grid>
      </Grid>

      {/* Data Table */}
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
                <b>Capacity</b>
              </TableCell>
              <TableCell>
                <b>Condition</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : amenities.length > 0 ? (
              amenities.map((amenity) => (
                <TableRow key={amenity.id}>
                  <TableCell size="small">{amenity.id}</TableCell>
                  <TableCell size="small">{amenity.name}</TableCell>
                  <TableCell size="small">{amenity.capacity}</TableCell>
                  <TableCell size="small">{amenity.status}</TableCell>
                  <TableCell size="small">
                    <Button
                      variant="contained"
                      sx={{ marginRight: 1, width: 100 }}
                      size="small"
                      onClick={() => handleDisplayUpdate(amenity)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ width: 100 }}
                      size="small"
                      onClick={async () => {
                        await deleteAmenity(amenity.id);
                        mutateAmenities();
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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
        <CreateAmenities
          open={showCreate}
          onClose={handleCloseCreate}
          mutateAmenities={mutateAmenities}
        />
      )}

      {showUpdate && (
        <CreateAmenities
          values={values}
          open={showUpdate}
          onClose={handleCloseUpdate}
          mutateAmenities={mutateAmenities}
        />
      )}
    </div>
  );
};
