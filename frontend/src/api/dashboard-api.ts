import useAxios from "@/utilities/useAxios";

const SERVICE = `${import.meta.env.VITE_DND_APP_BACKEND_URL}`;

interface SearchProps {
  keyword: string;
  page: number;
  size: number;
  equipmentReservationStatus?: string;
  amenityReservationStatus?: string;
}

export const searchAllEquipmentDashboard = async (params: SearchProps) => {
  try {
    const response = await useAxios.get(`${SERVICE}/equipment-reservation`, {
      params,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchAllAmenityDashboard = async (params: SearchProps) => {
  try {
    const response = await useAxios.get(
      `${SERVICE}/amenity-reservation/search`,
      {
        params,
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const equipmentCards = async () => {
  try {
    const response = await useAxios.get(
      `${SERVICE}/equipment-reservation/dashboard`
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const amenityCards = async () => {
  try {
    const response = await useAxios.get(
      `${SERVICE}/amenity-reservation/dashboard`
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
