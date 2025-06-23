import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import enUS from "date-fns/locale/en-US";
import { useForm } from "@/utilities/useForm";
import { ReservationList } from "./reservations-list/ReservationsList";
import { Alert, Button, Snackbar } from "@mui/material";
import { BookAmenity } from "./book-amenity/BookAmenity";
import { BookEquipments } from "./book-equipments/BookEquipments";
import { BookBoth } from "./book-both/BookBoth";
import { searchAllAmenities } from "@/api/amenities-api";
import useSWR from "swr";
import {
  searchActiveReservations,
  searchAllEquipments,
} from "@/api/equipments-api";
import { useAlert } from "@/utilities/useAlert";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export const Reservations = () => {
  const { handleAlertMessage, ...alertRest } = useAlert();

  const role = localStorage.getItem("role");

  const fetcherAmenities = async () => {
    const response = await searchAllAmenities({
      keyword: "",
      page: 0,
      size: 9999,
    });
    return response.data?.object?.content ?? [];
  };

  const fetcherEquipments = async () => {
    const response = await searchAllEquipments({
      keyword: "",
      page: 0,
      size: 9999,
    });
    return response.data?.object?.content ?? [];
  };

  const fetchActiveReservations = async () => {
    const response = await searchActiveReservations("2025-03-31");
    return response.data.object ?? [];
  };

  const { data: activeReservations, mutate: mutateReservations } = useSWR(
    `/reservation/monthly-reservation`,
    fetchActiveReservations,
    { revalidateOnFocus: true }
  );

  console.log("Active reservations ", activeReservations);

  const { data: amenities } = useSWR(
    `/amenities/search?page=0&size=9999`,
    fetcherAmenities,
    { revalidateOnFocus: false }
  );

  const { data: equipments } = useSWR(
    `/equipment/search?page=0&size=9999`,
    fetcherEquipments,
    { revalidateOnFocus: false }
  );

  console.log("equipments here ", equipments);

  const {
    formData: reservationDate,
    showModal: showReservations,
    handleDisplayData: handleDisplayReservations,
    handleCloseModal: handleCloseReservations,
  } = useForm();

  const {
    showModal: showBookAmenity,
    handleDisplayData: handleDisplayBookAmenity,
    handleCloseModal: handleCloseBookAmenity,
  } = useForm();

  const {
    showModal: showBookEquipments,
    handleDisplayData: handleDisplayBookEquipments,
    handleCloseModal: handleCloseBookEquipments,
  } = useForm();

  const {
    showModal: showBookBoth,
    handleDisplayData: handleDisplayBookBoth,
    handleCloseModal: handleCloseBookBoth,
  } = useForm();

  const handleSelectSlot = ({ start }: { start: Date }) => {
    handleDisplayReservations({ date: format(start, "yyyy-MM-dd") });
  };

  const handleSelectEvent = (event: any) => {
    handleDisplayReservations({ date: format(event.start, "yyyy-MM-dd") });
  };

  const events = (activeReservations || []).map((reservation: any) => ({
    start: new Date(reservation.startDate),
    end: new Date(reservation.endDate),
    title: "Reserved",
    allDay: true,
  }));

  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: "green",
        color: "white",
        borderRadius: "5px",
        opacity: 0.8,
        padding: "5px",
      },
    };
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reservations</h2>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ width: "70%" }}>
          <Calendar
            localizer={localizer}
            selectable
            events={events}
            onSelectSlot={handleSelectSlot}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 400 }}
            views={["month"]}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
          />
        </div>

        {role !== "Schedule Viewer" && (
          <div
            style={{
              width: "70%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              marginTop: "25px",
            }}
          >
            <Button
              variant="contained"
              sx={{ background: "#aec6cf", color: "#000" }}
              onClick={handleDisplayBookAmenity}
            >
              BOOK AMENITY ONLY
            </Button>
            <Button
              variant="contained"
              sx={{ background: "#FFC067", color: "#000" }}
              onClick={handleDisplayBookEquipments}
            >
              BOOK EQUIPMENT ONLY
            </Button>
          </div>
        )}
      </div>

      {showReservations && (
        <ReservationList
          open={showReservations}
          onClose={handleCloseReservations}
          values={reservationDate}
          amenities={amenities}
          equipments={equipments}
        />
      )}

      {showBookAmenity && (
        <BookAmenity
          open={showBookAmenity}
          onClose={handleCloseBookAmenity}
          amenities={amenities}
          mutate={mutateReservations}
          handleAlertMessage={handleAlertMessage}
        />
      )}

      {showBookEquipments && (
        <BookEquipments
          open={showBookEquipments}
          onClose={handleCloseBookEquipments}
          equipments={equipments}
          mutate={mutateReservations}
          handleAlertMessage={handleAlertMessage}
        />
      )}

      {showBookBoth && (
        <BookBoth open={showBookBoth} onClose={handleCloseBookBoth} />
      )}

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alertRest.showAlert}
        onClose={alertRest.handleCloseAlert}
        autoHideDuration={3000}
      >
        <Alert
          onClose={alertRest.handleCloseAlert}
          elevation={6}
          variant="filled"
          severity={alertRest.alertSeverity}
        >
          {alertRest.alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
