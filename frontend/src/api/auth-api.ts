import useAxios from "@/utilities/useAxios";

const SERVICE = `${import.meta.env.VITE_DND_APP_BACKEND_URL}`;

interface UserSignInProps {
  username: String;
  password: String;
}

export const userSignIn = async (data: UserSignInProps) => {
  return await useAxios
    .post(`${SERVICE}/authentication/login`, data)
    .catch((error) => console.error(error));
};

