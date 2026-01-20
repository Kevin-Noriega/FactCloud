import { useQuery } from "@tanstack/react-query";
import { getUsuarios } from "../api/UsuariosAPI";

export const useUsuarios = () => {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: getUsuarios,
  });
};
