/*
  Utilidad de escape HTML.

  Responsabilidad única:
  - Sanitizar strings antes de inyectarlos en el HTML
  - Prevenir inyección de HTML/XSS cuando se renderiza contenido dinámico
*/
export function escapeHtml(str = "") {
  return String(str)
    // Escapa el símbolo &
    .replaceAll("&", "&amp;")
    // Escapa etiquetas HTML
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    // Escapa comillas dobles
    .replaceAll('"', "&quot;")
    // Escapa comillas simples
    .replaceAll("'", "&#039;");
}
