import { http } from "./http.js";

/*
  Servicio de menú.

  Responsabilidad única:
  - Encargarse exclusivamente de obtener los productos del menú
    desde la API (JSON Server).

  Este service NO renderiza nada ni maneja estado;
  solo devuelve datos para que las vistas los consuman.
*/
export const menuService = {

  // Obtiene la lista completa de productos del menú
  // Endpoint: GET /menu
  list() {
    return http.get("/menu");
  }
};
