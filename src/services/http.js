// URL base de la API (JSON Server)
// Se usa 127.0.0.1 para evitar inconsistencias con "localhost"
const API = "http://127.0.0.1:3001";

/*
  Función base para realizar requests HTTP.

  Responsabilidad única:
  - Ejecutar fetch
  - Verificar si la respuesta fue correcta
  - Convertir la respuesta a JSON

  Se reutiliza para GET, POST, PATCH y PUT.
*/
async function request(path, options = {}) {
  // Construye la URL completa usando la base API
  const res = await fetch(`${API}${path}`, options);

  // Si la respuesta no es OK (status fuera de 2xx),
  // se lanza un error para que la vista lo capture
  if (!res.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed`);
  }

  // JSON Server siempre responde JSON en GET/POST/PATCH/PUT
  return res.json();
}

/*
  Abstracción del cliente HTTP.

  Ventaja:
  - Centraliza la lógica de fetch
  - Evita repetir headers y JSON.stringify en cada service
  - Facilita cambios futuros (ej: auth headers)
*/
export const http = {

  // PUT: reemplaza completamente un recurso
  // (no se usa normalmente aquí, pero queda disponible)
  put: (path, body) =>
    request(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  // GET: obtener recursos
  get: (path) => request(path),

  // POST: crear recursos (ej. crear un pedido)
  post: (path, body) =>
    request(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  // PATCH: actualizar parcialmente un recurso
  // (ej. cambiar solo el status de un pedido)
  patch: (path, body) =>
    request(path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  // DELETE: eliminar un recurso
  // Se maneja separado porque JSON Server no devuelve JSON aquí
  delete: async (path) => {
    const res = await fetch(`${API}${path}`, { method: "DELETE" });

    // Validación manual del status
    if (!res.ok) throw new Error(`DELETE ${path} failed`);

    // Se retorna true solo como confirmación de éxito
    return true;
  },
};
