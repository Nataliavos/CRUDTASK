import { mount } from "../utils/dom.js";

/*
  NotFoundView

  Responsabilidad:
  - Mostrar una vista simple cuando la ruta no existe
  - Servir como fallback del router ("*")

  Nota:
  - No depende de sesión ni del estado global
  - Se renderiza directamente usando mount
*/
export async function NotFoundView() {
  mount(`
    <div class="container">
      <div class="card pad">
        404 - Not Found
      </div>
    </div>
  `);
}
