import useAxios from "@/utilities/useAxios";

const SERVICE = `${import.meta.env.VITE_DND_APP_BACKEND_URL}`;

interface SearchUsersProps {
  keyword: string;
  page: number;
  size: number;
}

export const searchAllUsers = async (params: SearchUsersProps) => {
  try {
    const response = await useAxios.get(`${SERVICE}/user/search`, { params });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

interface CreateUserProps {
  firstName: string;
  lastName: string;
  middleInitial?: string;
  username: string;
  password: string;
  role: string;
  contact: string;
  email: string;
  address: string;
}

export const createUser = async (data: CreateUserProps) => {
  try {
    const response = await useAxios.post(`${SERVICE}/user/register`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUser = async (userId: string, data: CreateUserProps) => {
  try {
    const response = await useAxios.put(
      `${SERVICE}/user/update/${userId}`,
      data
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const response = await useAxios.delete(`${SERVICE}/user/delete/${userId}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
