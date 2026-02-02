// antes orders.service.js

import { http } from "./http.js";

/*
  Servicio CRUD de tareas (tasks).

  Centraliza todas las operaciones CRUD relacionadas con tareas 
*/
export const tasksService = {

  // Obtiene TODOS los pedidos del sistema
  // Usado principalmente por el panel de administrador
  // JSON Server v1 beta usa _sort=-campo para orden descendente
  listAll() {
    return http.get(`/tasks?_sort=-createdAt`); 
  },

  // Obtiene las tareas de un usuario específico
  // Se filtra por userId (number) y se ordena por fecha descendente
  listByUser(userId) {
    return http.get(`/tasks?userId=${Number(userId)}&_sort=-createdAt`);
  },

  // Crea una nueva tarea
  // El objeto task debe venir completo desde la vista
  create(task) {
    return http.post("/tasks", task);
  },

  // Actualiza una tarea existente
  // El patch es un objeto con los campos a modificar
  update(taskId, patch) {
    return http.patch(`/tasks/${String(taskId)}`, patch);
  },

  // Elimina una tarea por id
  remove(taskId) {
    return http.delete(`/tasks/${String(taskId)}`);
  }

};
