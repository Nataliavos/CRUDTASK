import { router } from "./router/index.js";
import { store, hydrate } from "./state/store.js";

/*
  Punto de entrada de la aplicación.

  Responsabilidad:
  - Inicializar el estado persistido
  - Configurar el router basado en hash
  - Arrancar la SPA sin recargar la página
*/

// Hidrata sesión y carrito desde LocalStorage
// REQUISITO: persistencia de datos (sesión + carrito)
hydrate();

/*
  Suscripción al store (opcional).

  Aquí no se fuerza un re-render automático en cada cambio de estado
  para evitar loops innecesarios.
  El render se controla explícitamente desde el router y las vistas.
*/
store.subscribe(() => {
  // Intencionalmente vacío:
  // el router se encarga del render bajo demanda
});

/*
  Enrutamiento SPA por hash:
  - hashchange: cuando el usuario navega entre vistas (#/menu, #/orders, etc.)
  - load: render inicial al cargar la página
*/
window.addEventListener("hashchange", router);
window.addEventListener("load", router);