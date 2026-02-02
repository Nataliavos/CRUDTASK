/*
  Utilidades de DOM.

  Responsabilidad única:
  - Centralizar operaciones comunes de manipulación del DOM
  - Simplificar el código de las vistas
*/

/*
  mount(html)

  Inserta el HTML generado por una vista dentro del contenedor principal (#app).

  Uso típico:
  - Cada vista llama a mount(LayoutTemplate(...))
  - Reemplaza completamente el contenido anterior (SPA sin recarga)

  Retorna el nodo #app para uso opcional posterior.
*/
export function mount(html) {
  const app = document.querySelector("#app");
  app.innerHTML = html;
  return app;
}

/*
  on(id, event, handler)

  Helper para agregar event listeners de forma segura.
  - Busca un elemento por id
  - Si existe, registra el listener

  Ventaja:
  - Evita errores si el elemento aún no existe
  - Reduce código repetido en las vistas
*/
export function on(id, event, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, handler);
}
