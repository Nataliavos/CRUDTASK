import { store } from "../state/store.js";

export function guard(route) {
  const session = store.getState().session;

  // sin sesión: solo login
  if (!session && route !== "#/login") return "#/login";

  // con sesión: no volver a login
  if (session && route === "#/login") {
    return session.role === "admin" ? "#/admin" : "#/tasks";
  }

  // protección por rol
  if (session?.role === "user" && route === "#/admin") return "#/tasks";
  if (session?.role === "admin" && ["#/tasks", "#/profile"].includes(route)) return "#/admin";

  return route;
}
