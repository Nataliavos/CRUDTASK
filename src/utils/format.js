/*
  Utilidades de formato (format helpers).

  Responsabilidad única:
  - Centralizar la forma en que se muestran valores numéricos y fechas
  - Evitar repetir lógica de formateo en las vistas
*/
export const fmt = {

  /*
    Formatea un número como dinero.

    - Convierte el valor a Number por seguridad
    - Aplica dos decimales
    - Anteponen el símbolo de moneda ($)

    Uso típico:
    - Mostrar precios de productos
    - Mostrar totales de pedidos
  */
  money(n) {
    return `$${Number(n).toFixed(2)}`;
  },

  /*
    Formatea una fecha en formato ISO a un string legible.

    - Recibe un string ISO (ej. createdAt)
    - Crea un objeto Date
    - Usa toLocaleString para formato según el navegador/idioma

    Uso típico:
    - Mostrar fecha de creación de pedidos
  */
  date(iso) {
    const d = new Date(iso);
    return d.toLocaleString();
  }
};
