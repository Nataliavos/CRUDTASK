import { storage } from "../services/storage.service.js";

/*
  Store global (estado central) de la aplicación.

  Responsabilidad única:
  - Mantener el estado central requerido por el enunciado (arrays principales)
  - Exponer métodos para leer estado (getState), suscribirse (subscribe)
  - Proveer "actions" para modificar el estado de forma controlada
  - Persistir partes del estado en localStorage (sesión y carrito)

  Nota: este patrón es un "mini store" tipo Redux, pero hecho con JS puro.
*/

const initialState = {
  session: null,            // Sesión activa: { id, name, email, role }
  users: [],                // Usuarios cargados desde API
  menu: [],                 // Menú cargado desde API
  orders: [],               // Pedidos cargados desde API
  cart: [],                 // Carrito: [{ productId, qty }]
  ui: {                     // Estado de UI (filtros/búsquedas)
    menuCategory: "All",
    menuSearch: "",
    adminFilter: "all",
  }
};

// Estado actual (se clona para evitar mutaciones accidentales sobre initialState)
let state = structuredClone(initialState);

// Lista de listeners para notificar cambios de estado
const listeners = new Set();

export const store = {
  // Devuelve el estado actual (lectura)
  getState: () => state,

  /*
    Suscribe un listener que se ejecuta cada vez que el estado cambia.
    Retorna una función para desuscribirse.

    Uso típico:
    - Vistas que quieren reaccionar a cambios (opcional)
  */
  subscribe: (fn) => (listeners.add(fn), () => listeners.delete(fn)),

  /*
    Setter general de estado (parches superficiales).
    Nota: en este proyecto se usa poco porque hay actions específicas.
  */
  setState: (patch) => {
    state = { ...state, ...patch };
    listeners.forEach((fn) => fn(state));
  },

  /*
    Acciones para modificar el estado de manera explícita.
    En una sustentación, se puede decir:
    "Centralizamos la modificación de estado en actions para mantener orden
    y respetar responsabilidad única en cada módulo."
  */
  actions: {
    /*
      Guarda sesión en memoria y la persiste en localStorage.
      REQUISITO: persistencia de sesión.
    */
    setSession(session) {
      state = { ...state, session };
      storage.set("ra_session", session);
      listeners.forEach((fn) => fn(state));
    },

    // Limpia sesión (logout) y la persiste como null
    clearSession() {
      state = { ...state, session: null };
      storage.set("ra_session", null);
      listeners.forEach((fn) => fn(state));
    },

    // Carga usuarios en estado (normalmente desde usersService.list())
    setUsers(users) {
      state = { ...state, users };
      listeners.forEach((fn) => fn(state));
    },

    // Carga menú en estado (normalmente desde menuService.list())
    setMenu(menu) {
      state = { ...state, menu };
      listeners.forEach((fn) => fn(state));
    },

    // Carga pedidos en estado (admin: listAll, user: listByUser o filtro en front)
    setOrders(orders) {
      state = { ...state, orders };
      listeners.forEach((fn) => fn(state));
    },

    // Actualiza solo el sub-objeto ui (filtros/búsquedas) con un patch
    setUI(patch) {
      state = { ...state, ui: { ...state.ui, ...patch } };
      listeners.forEach((fn) => fn(state));
    },

    /*
      Agrega un producto al carrito:
      - Si ya existe, incrementa qty
      - Si no existe, lo crea en qty=1

      REQUISITO: uso de find
    */
    addToCart(productId) {
      const cart = [...state.cart];

      // find (requisito): buscar si ya existe la línea del producto
      const line = cart.find((x) => x.productId === productId);

      if (line) line.qty += 1;
      else cart.push({ productId, qty: 1 });

      state = { ...state, cart };

      // Persistencia del carrito
      storage.set("ra_cart", cart);

      // Notifica a los listeners (si alguna vista depende de esto)
      listeners.forEach((fn) => fn(state));
    },

    /*
      Cambia la cantidad de un producto en el carrito.
      delta puede ser +1 o -1 (u otro valor).

      REQUISITO: uso de filter
    */
    changeQty(productId, delta) {
      let cart = [...state.cart];

      // Busca la línea del producto
      const line = cart.find((x) => x.productId === productId);
      if (!line) return;

      // Ajusta cantidad
      line.qty += delta;

      // filter (requisito): elimina líneas con qty <= 0
      cart = cart.filter((x) => x.qty > 0);

      state = { ...state, cart };
      storage.set("ra_cart", cart);
      listeners.forEach((fn) => fn(state));
    },

    // Vacía el carrito (y lo persiste)
    clearCart() {
      state = { ...state, cart: [] };
      storage.set("ra_cart", []);
      listeners.forEach((fn) => fn(state));
    }
  }
};

/*
  hydrate():
  Carga estado persistido (sesión y carrito) desde localStorage
  y lo mezcla con el estado actual.

  Se llama típicamente al iniciar la app (bootstrapping).
*/
export function hydrate() {
  const session = storage.get("ra_session", null);
  const cart = storage.get("ra_cart", []);

  // Asegura que cart sea un array para evitar errores si se corrompe el storage
  state = { ...state, session, cart: Array.isArray(cart) ? cart : [] };
}
