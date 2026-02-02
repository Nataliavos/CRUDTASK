/*
  Utilidad de acceso a localStorage.

  Responsabilidad única:
  - Encapsular la lectura y escritura en localStorage
  - Manejar automáticamente la serialización/deserialización JSON
  - Evitar que errores de parseo rompan la aplicación
*/
export const storage = {

  /*
    Obtiene un valor desde localStorage.

    Parámetros:
    - key: nombre de la clave en localStorage
    - fallback: valor por defecto si no existe o hay error

    Uso típico:
    - restaurar sesión
    - restaurar estado persistido (ej. carrito)
  */
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);

      // Si existe el valor, se parsea desde JSON
      // Si no existe, se retorna el fallback
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      // Si el JSON está corrupto o falla el parseo,
      // se retorna el fallback para evitar crash
      return fallback;
    }
  },

  /*
    Guarda un valor en localStorage.

    El valor se serializa automáticamente a JSON,
    lo que permite guardar objetos y arrays.
  */
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
