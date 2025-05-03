import axios from "./axios";

export const updateprofile = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await axios.put("/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
