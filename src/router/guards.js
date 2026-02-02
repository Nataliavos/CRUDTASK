import { store } from "../state/store.js";

export function guard(route) {
  const session = store.getState().session;

  // sin sesión: solo login
  if (!session && route !== "#/login") return "#/login";

  // con sesión: no volver a login
  if (session && route === "#/login") {
    return session.role === "admin" ? "#/admin" : "#/menu";
  }

  // protección por rol
  if (session?.role === "user" && route === "#/admin") return "#/menu";
  if (session?.role === "admin" && ["#/menu", "#/orders", "#/profile"].includes(route)) return "#/admin";

  return route;
}
