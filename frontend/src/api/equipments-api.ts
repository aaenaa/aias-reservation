import useAxios from "@/utilities/useAxios";

const SERVICE = `${import.meta.env.VITE_DND_APP_BACKEND_URL}`;

interface SearchEquipmentsProps {
  keyword: string;
  page: number;
  size: number;
}

export const searchStatusCountsAmenity = async () => {
  try {
    const response = await useAxios.get(`${SERVICE}/amenity-reservation/dashboard`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchStatusCountsEquipments = async () => {
  try {
    const response = await useAxios.get(`${SERVICE}/equipment-reservation/dashboard`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const searchAllEquipments = async (params: SearchEquipmentsProps) => {
  try {
    const response = await useAxios.get(`${SERVICE}/equipment/search`, {
      params,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchSpecificReservation = async (date: string) => {
  try {
    const response = await useAxios.get(`${SERVICE}/reservation?date=${date}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchActiveReservations = async (date: string) => {
  try {
    const response = await useAxios.get(`${SERVICE}/reservation/monthly-reservation?monthYear=${date}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

interface CreateEquipmentProps {
  name: string
  type: string
  quantity: number
  category: string
  status: string
  dateAcquired: string
}


export const createEquipment = async (data: CreateEquipmentProps) => {
  try {
    const response = await useAxios.post(`${SERVICE}/equipment`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const updateEquipment = async (id: string, data: CreateEquipmentProps) => {
  try {
    const response = await useAxios.put(
      `${SERVICE}/equipment/${id}`,
      data
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteEquipment = async (id: number) => {
  try {
    const response = await useAxios.delete(`${SERVICE}/equipment/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

