import { http } from "./http.js";

/*
  Servicio de pedidos (orders).

  Responsabilidad única:
  - Encargarse de TODAS las operaciones relacionadas con pedidos
    (listar, crear, actualizar estado, eliminar)
  - Comunicarse con la API mediante http.js
  - No contiene lógica de UI ni DOM
*/
export const ordersService = {

  // Obtiene TODOS los pedidos del sistema
  // Usado principalmente por el panel de administrador
  // JSON Server v1 beta usa _sort=-campo para orden descendente
  listAll() {
    return http.get("/orders?_sort=-createdAt");
  },

  // Obtiene los pedidos de un usuario específico
  // Se filtra por userId (number) y se ordena por fecha descendente
  // Usado en la vista "My Orders"
  listByUser(userId) {
    return http.get(`/orders?userId=${Number(userId)}&_sort=-createdAt`);
  },

  // Crea un nuevo pedido
  // El objeto order debe venir completo desde la vista (userMenu)
  // REQUISITO: persistencia de datos (JSON Server)
  create(order) {
    return http.post("/orders", order);
  },

  // Actualiza únicamente el estado del pedido
  // Se usa PATCH para modificar solo el campo "status"
  // IMPORTANTE: orderId se maneja como string para compatibilidad
  updateStatus(orderId, status) {
    return http.patch(`/orders/${String(orderId)}`, { status });
  },

  // Elimina un pedido por id
  // Usado desde el panel de administrador
  remove(orderId) {
    return http.delete(`/orders/${String(orderId)}`);
  }
};
