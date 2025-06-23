import useAxios from "@/utilities/useAxios";

const SERVICE = `${import.meta.env.VITE_DND_APP_BACKEND_URL}`;

interface ReservationsProps {
  date: any;
}

export const searchAllReservation = async (params: ReservationsProps) => {
  try {
    const response = await useAxios.get(`${SERVICE}/reservation`, {
      params,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

interface AmenityReservationPayload {
  client: {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    contact: string;
    email: string;
    eventRole: string;
    address: string;
  };
  amenityId: number;
  purpose: string;
  status: string;
  startDateTime: string;
  endDateTime: string;
}

interface EquipmentReservationPayload {
  client: {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    contact: string;
    email: string;
    eventRole: string;
    address: string;
  };
  equipments: Array<{
    equipmentId: number;
    quantity: number;
  }>;
  purpose: string;
  status: string;
  startDateTime: string;
  endDateTime: string;
}

export const generateReport = async ({
  startDate,
  endDate,
  status,
}: {
  startDate: string;
  endDate: string;
  status?: string;
}) => {
  try {
    const response = await useAxios.get(`${SERVICE}/reservation/report`, {
      params: { startDate, endDate, status },
      headers: { Accept: "*/*" },
    });
    return response.data;
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};

export const createAmenityReservation = async (
  data: AmenityReservationPayload
) => {
  try {
    const response = await useAxios.post(
      `${SERVICE}/amenity-reservation`,
      data
    );
    return response;
  } catch (error) {
    console.error("Failed to create amenity reservation", error);
    throw error;
  }
};

export const updateAmenityReservation = async (
  data: AmenityReservationPayload,
  id: number
) => {
  try {
    const response = await useAxios.put(
      `${SERVICE}/amenity-reservation/${id}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Failed to update amenity reservation", error);
    throw error;
  }
};

export const updateEquipmentReservation = async (
  data: EquipmentReservationPayload,
  id: number
) => {
  try {
    const response = await useAxios.put(
      `${SERVICE}/equipment-reservation/${id}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Failed to update amenity reservation", error);
    throw error;
  }
};

export const createEquipmentReservation = async (
  data: EquipmentReservationPayload
) => {
  try {
    const response = await useAxios.post(
      `${SERVICE}/equipment-reservation`,
      data
    );
    return response;
  } catch (error) {
    console.error("Failed to create equipment reservation", error);
    throw error;
  }
};

export const deleteAmenityReservation = async (id: number) => {
  try {
    const response = await useAxios.delete(`${SERVICE}/amenity-reservation/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteEquipmentReservation = async (id: number) => {
  try {
    const response = await useAxios.delete(`${SERVICE}/equipment-reservation/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

