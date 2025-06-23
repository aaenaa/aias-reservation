import useAxios from "@/utilities/useAxios";

const SERVICE = `${import.meta.env.VITE_DND_APP_BACKEND_URL}`;

interface SearchAmenitiesProps {
  keyword: string;
  page: number;
  size: number;
}

export const searchAllAmenities = async (params: SearchAmenitiesProps) => {
  try {
    const response = await useAxios.get(`${SERVICE}/amenities/search`, {
      params,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

interface CreateAmenitiesProps {
  name: string;
  capacity: number;
  status: string;
}

export const createAmenity = async (data: CreateAmenitiesProps) => {
  try {
    const response = await useAxios.post(`${SERVICE}/amenities`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateAmenity = async (id: string, data: CreateAmenitiesProps) => {
  try {
    const response = await useAxios.put(`${SERVICE}/amenities/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteAmenity = async (id: number) => {
  try {
    const response = await useAxios.delete(`${SERVICE}/amenities/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
