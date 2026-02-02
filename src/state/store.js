import { storage } from "../services/storage.service.js";

/*
  Estado global de la aplicación.
*/

const initialState = {
  session: null,            // Sesión activa: { id, name, email, role }
  users: [],                // Usuarios cargados desde API
  tasks: [],                // Tareas cargadas desde API
  ui: {                     // Estado de UI (filtros/búsquedas)
    taskFilter: "all",      // all | pending | in_progress | completed
    taskSearch: ""          // Texto de búsqueda en tareas
  }
};



// Estado actual (se clona para evitar cambios accidentales sobre initialState)
let state = structuredClone(initialState);

// Lista de listeners para notificar cambios de estado
const listeners = new Set();

export const store = {
  // Devuelve el estado actual (lectura)
  getState: () => state,

  /*
    Suscribe un listener que se ejecuta cada vez que el estado cambia.
    Retorna una función para desuscribirse.
  */
  subscribe: (fn) => (listeners.add(fn), () => listeners.delete(fn)),


  actions: {
    /*
      Guarda sesión en memoria y la persiste en localStorage.
    */
    setSession(session) {
      state = { ...state, session };
      storage.set("crudtask_session", session);
      listeners.forEach((fn) => fn(state));
    },

    // Limpia sesión (logout) y la persiste como null
    clearSession() {
      state = { ...state, session: null };
      storage.set("crudtask_session", null);
      listeners.forEach((fn) => fn(state));
    },

    // Carga tasks en estado (admin: listAll, user: listByUser)
    setTasks(tasks) {
      state = { ...state, tasks };
      listeners.forEach((fn) => fn(state));
    },

    // Actualiza solo el sub-objeto ui (filtros/búsquedas) con un patch
    setUI(patch) {
      state = { ...state, ui: { ...state.ui, ...patch } };
      listeners.forEach((fn) => fn(state));
    },

  }
};

/*
  Restaura sesión desde LocalStorage
*/
export function hydrate() {
  const session = storage.get("crudtask_session", null);
  state = { ...state, session };
}
