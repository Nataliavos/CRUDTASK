import { mount } from "../utils/dom.js";
import { LayoutTemplate } from "../templates/layout.template.js";
import { fmt } from "../utils/format.js";
import { store } from "../state/store.js";
import { ordersService } from "../services/orders.service.js";

/*
  ProfileView

  Responsabilidad:
  - Mostrar la información del usuario logueado
  - Calcular estadísticas básicas del usuario
    (cantidad de pedidos y total gastado)
  - Cumplir el requisito de "Vista de perfil"
*/
export async function ProfileView() {
  const { session } = store.getState();

  /*
    Obtiene los pedidos del usuario actual desde la API.
    Se usa listByUser para evitar traer pedidos de otros usuarios.
  */
  const orders = await ordersService.listByUser(session.id);

  /*
    Estadísticas del perfil:

    - count: número total de pedidos
    - totalSpent: suma del total de todos los pedidos

    reduce (implícito en el cálculo):
    Se acumula el total gastado recorriendo todos los pedidos.
  */
  const count = orders.length;
  const totalSpent = orders.reduce((acc, o) => acc + Number(o.total || 0), 0);

  /*
    Render del layout:
    - Columna izquierda: información del usuario
    - Columna derecha: estadísticas
  */
  mount(LayoutTemplate({
    session,
    activeRoute: "#/profile",
    title: "Profile",
    subtitle: "Your account information.",
    content: `
      <div class="split">
        <div class="card pad">
          <h3 style="margin:0 0 8px">User Info</h3>

          <div class="mini">Name</div>
          <div style="font-weight:900; margin-bottom:10px">${session.name}</div>

          <div class="mini">Email</div>
          <div style="font-weight:900; margin-bottom:10px">${session.email}</div>

          <div class="mini">Role</div>
          <div style="font-weight:900; margin-bottom:10px">${session.role}</div>
        </div>

        <div class="card pad">
          <h3 style="margin:0 0 8px">Stats</h3>

          <div class="totalRow">
            <span>Orders</span>
            <span style="font-weight:900">${count}</span>
          </div>

          <div class="totalRow">
            <span>Total Spent</span>
            <span style="font-weight:900">${fmt.money(totalSpent)}</span>
          </div>

          <div class="sep"></div>
          <p class="mini">
            Optional advanced: total spent is calculated from your saved orders.
          </p>
        </div>
      </div>
    `
  }));

  /*
    Logout:
    - Limpia la sesión del store
    - Redirige al login
  */
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    store.actions.clearSession();
    window.location.hash = "#/login";
  });
}
