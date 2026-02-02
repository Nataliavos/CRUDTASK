import { ROUTES } from "./routes.js";
import { guard } from "./guards.js";

/*
  Router principal de la SPA basado en hash (#/ruta).

  Responsabilidad:
  - Leer la ruta actual desde window.location.hash
  - Aplicar reglas de acceso (guard)
  - Resolver qué vista ejecutar según la ruta
  - Ejecutar la vista correspondiente sin recargar la página
*/
export async function router() {
  // Obtiene el hash actual; si no existe, redirige al login por defecto
  const raw = window.location.hash || "#/login";

  // Aplica la protección de rutas según sesión/rol
  // (por ejemplo: evitar que un user entre al admin)
  const route = guard(raw);

  // Si el guard cambia la ruta (redirección),
  // actualiza el hash y corta la ejecución
  if (route !== raw) {
    window.location.hash = route;
    return;
  }

  // Busca la vista asociada a la ruta
  // Si no existe, usa la ruta comodín (*)
  const View = ROUTES[route] || ROUTES["*"];

  // Ejecuta la vista (render dinámico)
  // Se usa await porque algunas vistas hacen fetch async
  await View();
}
