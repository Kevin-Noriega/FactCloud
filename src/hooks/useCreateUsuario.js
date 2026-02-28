import { useMutation } from "@tanstack/react-query";
import { createUsuario } from "../api/usuariosApi";

export const useCreateUsuario = () => {
  return useMutation({
    mutationFn: createUsuario,
  });
};
