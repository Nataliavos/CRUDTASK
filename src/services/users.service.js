import { http } from "./http.js";

/*
  Servicio de usuarios.

  Responsabilidad única:
  - Manejar todas las operaciones relacionadas con usuarios
    contra la API (JSON Server)
  - No contiene lógica de autenticación ni UI
*/
export const usersService = {

  // Obtiene la lista completa de usuarios
  // Usado principalmente en el login para validar credenciales
  list() {
    return http.get("/users");
  },

  // Crea un nuevo usuario
  // (no siempre se usa en el simulacro, pero deja el servicio completo)
  create(user) {
    return http.post("/users", user);
  }
};
