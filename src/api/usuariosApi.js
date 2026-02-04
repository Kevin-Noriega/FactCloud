import  api  from "/src/api/axios.js";

export const getUsuarios = async () => {
  const response = await api.get("usuarios/me");
  return response.data;
};

export const createUsuario = async (data) => {
  const response = await api.post("usuarios", data);
  return response.data; // { id }
};

  