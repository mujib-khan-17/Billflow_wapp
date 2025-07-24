import axiosInstance from "../axiosInstance";

export const login = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", {
    email_id: email,
    password: password,
  });
  return response.data;
};
