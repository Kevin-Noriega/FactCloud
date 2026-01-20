import  api  from "/src/api/axios.js";

export const getUsuarios = async () => {
  const response = await api.get("usuarios/me");
  return response.data;
};
