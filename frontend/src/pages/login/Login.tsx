import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  AlertColor,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import enUS from "date-fns/locale/en-US";
import useSWR from "swr";
import { searchActiveReservations } from "@/api/equipments-api";
import { useForm } from "@/utilities/useForm";
import { ReservationListLogin } from "../reservations/reservations-list/ReservationListLogin";
import { userSignIn } from "@/api/auth-api";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

type Reservation = {
  startDate: string;
  endDate: string;
  title?: string;
};

const fetchReservations = async (): Promise<Reservation[]> => {
  const response = await searchActiveReservations("2025-03-31");
  return response?.data.object ?? [];
};

export const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertRest, setAlertRest] = useState<{
    showAlert: boolean;
    alertSeverity: AlertColor;
    alertMessage: string;
  }>({
    showAlert: false,
    alertSeverity: "error",
    alertMessage: "",
  });

  const { data: activeReservations = [] } = useSWR<Reservation[]>(
    "/reservation/monthly-reservation",
    fetchReservations,
    {
      revalidateOnFocus: true,
    }
  );

  const events = activeReservations.map((reservation: Reservation) => ({
    start: new Date(reservation.startDate),
    end: new Date(reservation.endDate),
    title: "Reserved",
    allDay: true,
    reservation, 
  }));

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: "green",
      color: "white",
      borderRadius: "5px",
      opacity: 0.8,
      padding: "5px",
      cursor: "pointer",
    },
  });

  const {
    formData: reservationDate,
    showModal: showReservations,
    handleDisplayData: handleDisplayReservations,
    handleCloseModal: handleCloseReservations,
  } = useForm();

  const handleSelectEvent = (event: any) => {
    handleDisplayReservations({ date: format(event.start, "yyyy-MM-dd") });
  };

  const handleCloseAlert = () => {
    setAlertRest((prev) => ({ ...prev, showAlert: false }));
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await userSignIn({ username, password });
      if (response?.data?.object.token) {
        const { token, username, firstName, lastName, role, profileImage } =
          response.data.object;

        localStorage.setItem("username", username);
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        localStorage.setItem("role", role);
        localStorage.setItem("token", token);
        localStorage.setItem("profile", profileImage);

        navigate("/dashboard");
      } else {
        setAlertRest({
          showAlert: true,
          alertSeverity: "error",
          alertMessage: "Invalid username or password",
        });
      }
    } catch (error) {
      setAlertRest({
        showAlert: true,
        alertSeverity: "error",
        alertMessage: "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/assets/loginbackground.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.5, 
          zIndex: -1, 
        },
      }}
    >
      <Box sx={{ width: "50%", padding: 4 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: 400,
            backgroundColor: "white",
            padding: 10,
            borderRadius: 4,

          }}
          selectable
          views={["month"]}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
        />
      </Box>
      <Paper elevation={3} sx={{ padding: 4, width: 300, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>

        <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={alertRest.showAlert}
        onClose={handleCloseAlert}
        autoHideDuration={3000}
      >
        <Alert
          onClose={handleCloseAlert}
          elevation={6}
          variant="filled"
          severity={alertRest.alertSeverity}
        >
          {alertRest.alertMessage}
        </Alert>
      </Snackbar>
      </Paper>

      {showReservations && (
        <ReservationListLogin
          open={showReservations}
          onClose={handleCloseReservations}
          values={reservationDate}
        />
      )}
    </Box>
  );
};
