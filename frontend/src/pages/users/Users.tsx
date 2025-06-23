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
import { CreateUsers } from "./create-users/CreateUsers";
import { useUsersContext } from "@/context/UsersContext";
import { deleteUser } from "@/api/users-api";

export const Users = () => {
  const {
    users,
    isLoading,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    setKeyword,
    totalElements,
    mutateUsers,
  } = useUsersContext();

  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle search input with debounce
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

  // Handle pagination
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
        Users
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
            Create User
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
                <b>Username</b>
              </TableCell>
              <TableCell>
                <b>Role</b>
              </TableCell>
              <TableCell>
                <b>Contact</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Address</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell size="small">{user.id}</TableCell>
                  <TableCell size="small">{`${user.firstName} ${
                    user.middleInitial ? user.middleInitial + "." : ""
                  } ${user.lastName}`}</TableCell>
                  <TableCell size="small">{user.username}</TableCell>
                  <TableCell size="small">{user.role}</TableCell>
                  <TableCell size="small">{user.contact}</TableCell>
                  <TableCell size="small">{user.email}</TableCell>
                  <TableCell size="small">{user.address}</TableCell>
                  <TableCell size="small">
                    <Button
                      variant="contained"
                      sx={{ marginRight: 1, width: 100 }}
                      size="small"
                      onClick={() => handleDisplayUpdate(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ width: 100 }}
                      size="small"
                      onClick={async () => {
                        await deleteUser(user.id);
                        mutateUsers();
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
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
        <CreateUsers
          open={showCreate}
          onClose={handleCloseCreate}
          mutateUsers={mutateUsers}
        />
      )}

      {showUpdate && (
        <CreateUsers
          values={values}
          open={showUpdate}
          onClose={handleCloseUpdate}
          mutateUsers={mutateUsers}
        />
      )}
    </div>
  );
};
