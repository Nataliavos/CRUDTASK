/*
  LayoutTemplate

  Responsabilidad única:
  - Generar la estructura base (topbar + contenedor de contenido) para todas las vistas
  - Mostrar navegación según el rol de la sesión (admin vs user)
  - Marcar la ruta activa (activeRoute) para resaltar el link actual
  - Incluir botón de logout si hay sesión

  Nota: este template NO maneja eventos; los eventos (logout) se conectan en cada vista.
*/
export function LayoutTemplate({ session, activeRoute, title = "", subtitle = "", content = "" }) {

  /*
    Construye los links del navbar según el rol.

    - Admin: solo ve Dashboard
    - User: ve tasks, Profile

    activeRoute se usa para aplicar la clase "active" y resaltar el link actual.
  */
  const nav = session?.role === "admin"
    ? `
      <a href="#/admin" data-nav="#/admin" class="${activeRoute==="#/admin" ? "active" : ""}">Dashboard</a>
    `
    : `
      <a href="#/menu" data-nav="#/menu" class="${activeRoute==="#/menu" ? "active" : ""}">Menu</a>
      <a href="#/orders" data-nav="#/orders" class="${activeRoute==="#/orders" ? "active" : ""}">My Orders</a>
      <a href="#/profile" data-nav="#/profile" class="${activeRoute==="#/profile" ? "active" : ""}">Profile</a>
    `;

  /*
    Botón de logout:
    - Solo se renderiza si existe sesión
    - Se identifica por id="logoutBtn" para que la vista lo pueda enlazar con addEventListener
  */
  const right = session ? `<button class="btn small secondary" id="logoutBtn">Log Out</button>` : "";

  /*
    Retorna el HTML completo:
    - Topbar sticky (clase .topbar en CSS)
    - Brand con link condicional:
      - Si hay sesión admin: va a #/admin
      - Si hay sesión user: va a #/menu
      - Si no hay sesión: va a #/login
    - Contenedor principal con title/subtitle opcionales y content inyectado por la vista
  */
  return `
    <div class="topbar">
      <div class="container inner">
        <a class="brand" href="${session ? (session.role === "admin" ? "#/admin" : "#/menu") : "#/login"}">
          <span class="logo"></span>
          <span>RestorApp</span>
        </a>

        <nav class="nav">
          ${session ? nav : ""}
        </nav>

        <div class="nav">
          ${right}
        </div>
      </div>
    </div>

    <div class="page">
      <div class="container">
        ${title ? `<h1 class="h1">${title}</h1>` : ""}
        ${subtitle ? `<p class="sub">${subtitle}</p>` : ""}
        <div class="sep"></div>
        ${content}
      </div>
    </div>
  `;
}
