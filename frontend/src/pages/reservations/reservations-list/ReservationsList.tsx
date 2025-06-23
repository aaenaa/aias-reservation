import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import { searchSpecificReservation } from "@/api/equipments-api";
import useSWR from "swr";
import {
  PDFViewer,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import {
  deleteAmenityReservation,
  deleteEquipmentReservation,
} from "@/api/reservations-api";
import { useForm } from "@/utilities/useForm";
import { EditAmenityReservation } from "./edit-forms/EditAmenityReservation";
import { EditEquipmentReservation } from "./edit-forms/EditEquipmentReservation";

interface Equipment {
  id: number;
  name: string;
  quantity: number;
}

interface CreateAmenitiesProps {
  open: boolean;
  onClose: () => void;
  values: any;
  amenities: { id: number; name: string }[];
  equipments: Equipment[];
}

const styles = StyleSheet.create({
  page: { padding: 20 },
  section: { marginBottom: 10, padding: 10, border: "1px solid black" },
  title: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
});

const TermsAndAgreementPDF = ({ reservation }: any) => (
  <Document
    title={`${
      reservation?.client?.replace(/\s+/g, "_") || "Reservation"
    }_Booking`}
  >
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Terms and Agreements</Text>
        <Text>
          1. The client agrees to adhere to all facility rules and regulations.
        </Text>
        <Text>
          2. The facility reserves the right to cancel reservations under
          unforeseen circumstances.
        </Text>
        <Text>
          3. The client is responsible for any damages incurred during the
          reservation period.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Client Details</Text>
        <Text>Name: {reservation.client}</Text>
        <Text>Contact: {reservation.contact}</Text>
        <Text>Email: {reservation.email}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Reservation Details</Text>
        <Text>ID: {reservation.id}</Text>
        <Text>Amenity/Equipment: {reservation.name}</Text>
        <Text>Status: {reservation.status}</Text>
        <Text>Purpose: {reservation.purpose}</Text>
        <Text>
          Start Time: {format(new Date(reservation.startTime), "hh:mm a")}
        </Text>
        <Text>
          End Time: {format(new Date(reservation.endTime), "hh:mm a")}
        </Text>
      </View>
    </Page>
  </Document>
);

export const ReservationList: React.FC<CreateAmenitiesProps> = ({
  open,
  onClose,
  values,
  amenities,
  equipments,
}) => {
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  const role = localStorage.getItem("role");

  const {
    formData: amenitiesData,
    showModal: showEditAmenities,
    handleDisplayData: handleDisplayAmenities,
    handleCloseModal: handleCloseAmenities,
  } = useForm();

  const {
    formData: equipmentsData,
    showModal: showEditEquipments,
    handleDisplayData: handleDisplayEquipments,
    handleCloseModal: handleCloseEquipments,
  } = useForm();

  const fetchReservations = async () => {
    const response = await searchSpecificReservation(
      format(new Date(values.date), "yyyy-MM-dd")
    );
    return (
      response?.data.object ?? {
        amenityReservations: [],
        equipmentReservations: [],
      }
    );
  };

  const {
    data: reservationsData,
    error,
    isLoading,
    mutate,
  } = useSWR(
    `/reservation/${format(new Date(values.date), "yyyy-MM-dd")}`,
    fetchReservations,
    { revalidateOnFocus: false }
  );

  const reservations = useMemo(() => {
    if (!reservationsData) return [];

    return [
      ...reservationsData.amenityReservations.map((res: any) => ({
        id: res.id,
        client: `${res.client.firstName} ${res.client.lastName}`,
        clientData: { ...res.client },
        contact: res.client.contact,
        email: res.client.email,
        name: res.amenities.name,
        status: res.status,
        purpose: res.purpose,
        startTime: res.startDateTime,
        endTime: res.endDateTime,
        type: "amenity",
      })),
      ...reservationsData.equipmentReservations.map((res: any) => ({
        id: res.id,
        client: `${res.client.firstName} ${res.client.lastName}`,
        clientData: { ...res.client },
        contact: res.client.contact,
        email: res.client.email,
        name: res.reservationDetails
          .map((item: any) => `${item.quantity}x ${item.equipment.name}`)
          .join(", "),
        equipmentNamess: res.reservationDetails
          .map(
            (item: any) =>
              `${item.quantity}x ${item.equipment.name} - ${item.equipment.id}`
          )
          .join(", "),
        status: res.status,
        purpose: res.purpose,
        startTime: res.startDateTime,
        endTime: res.endDateTime,
        type: "equipment",
      })),
    ];
  }, [reservationsData]);

  console.log("reservations here ", reservations);
  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>Loading Reservations...</DialogTitle>
        <DialogContent
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          Error loading reservations. Please try again.
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const handleDelete = async (id: number, type: string) => {
    if (type === "amenity") {
      await deleteAmenityReservation(id);
    } else {
      await deleteEquipmentReservation(id);
    }
    mutate();
  };

  const handleShowEdit = (data: any, type: string) => {
    if (type === "amenity") {
      handleDisplayAmenities(data);
    } else {
      handleDisplayEquipments(data);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>
          Reservation List - {format(new Date(values.date), "MMMM dd, yyyy")}
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Amenity/Equipment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Purpose</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  {role !== "Schedule Viewer" && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.length > 0 ? (
                  reservations.map((reservation: any) => (
                    <TableRow key={reservation.id}>
                      <TableCell>{reservation.id}</TableCell>
                      <TableCell>{reservation.client}</TableCell>
                      <TableCell>{reservation.name}</TableCell>
                      <TableCell>{reservation.status}</TableCell>
                      <TableCell>{reservation.purpose}</TableCell>
                      <TableCell>
                        {format(new Date(reservation.startTime), "hh:mm a")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(reservation.endTime), "hh:mm a")}
                      </TableCell>
                      {role !== "Schedule Viewer" && (
                        <TableCell>
                          <Button
                            onClick={() =>
                              handleShowEdit(reservation, reservation.type)
                            }
                            color="primary"
                            variant="contained"
                            style={{ marginRight: 8 }}
                            size="small"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => setSelectedReservation(reservation)}
                            color="primary"
                            variant="contained"
                            style={{ marginRight: 8 }}
                            size="small"
                          >
                            Details
                          </Button>
                          <Button
                            onClick={() =>
                              handleDelete(reservation.id, reservation.type)
                            }
                            color="error"
                            variant="contained"
                            style={{ marginRight: 8 }}
                            size="small"
                          >
                            Delete
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No Reservations Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {showEditAmenities && (
        <EditAmenityReservation
          open={showEditAmenities}
          onClose={handleCloseAmenities}
          amenities={amenities}
          values={amenitiesData}
          mutate={mutate}
        />
      )}

      {showEditEquipments && (
        <EditEquipmentReservation
          open={showEditEquipments}
          onClose={handleCloseEquipments}
          equipments={equipments}
          values={equipmentsData}
          mutate={mutate}
        />
      )}

      {/* PDF Viewer Dialog - Only Show When a Reservation is Selected */}
      {selectedReservation && (
        <Dialog
          open={Boolean(selectedReservation)}
          onClose={() => setSelectedReservation(null)}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle>Reservation Terms & Agreement</DialogTitle>
          <DialogContent style={{ height: "80vh" }}>
            <PDFViewer width="100%" height="100%">
              <TermsAndAgreementPDF reservation={selectedReservation} />
            </PDFViewer>
          </DialogContent>
          <DialogActions>
            <PDFDownloadLink
              document={
                <TermsAndAgreementPDF reservation={selectedReservation} />
              }
              fileName={`${
                selectedReservation?.client?.replace(/\s+/g, "_") ||
                "Reservation"
              }_Booking.pdf`}
              style={{ textDecoration: "none" }}
            >
              {({ loading }) => (
                <Button color="primary" variant="contained" disabled={loading}>
                  {loading ? "Preparing PDF..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
            <Button
              onClick={() => setSelectedReservation(null)}
              color="secondary"
              variant="contained"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
