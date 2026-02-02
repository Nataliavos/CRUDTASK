import { mount } from "../utils/dom.js";
import { LayoutTemplate } from "../templates/layout.template.js";
import { StatusTagTemplate } from "../templates/components/statusTag.template.js";
import { fmt } from "../utils/format.js";
import { store } from "../state/store.js";
import { ordersService } from "../services/orders.service.js";

/*
  MyOrdersView

  Responsabilidad:
  - Mostrar únicamente los pedidos del usuario logueado
  - Renderizar el estado (StatusTagTemplate), fecha y total
  - Cumplir el requisito de "ver solo SUS pedidos"
  - Manejar logout desde esta vista

  Nota: esta vista hace render dinámico (SPA) usando LayoutTemplate + mount.
*/
export async function MyOrdersView() {
  const { session } = store.getState();

  /*
    Protección básica por sesión:
    si no hay sesión activa, redirige al login.
    (También existe guard en el router, pero aquí se refuerza el flujo.)
  */
  if (!session) {
    window.location.hash = "#/login";
    return;
  }

  /*
    1) Trae todos los pedidos.
    En lugar de pedir /orders?userId=... se trae todo y se filtra localmente.
    Esto evita problemas cuando userId o session.id pueden venir como number/string.
  */
  const allOrders = await ordersService.listAll();

  /*
    2) Filtra por userId para quedarse solo con pedidos del usuario actual.

    filter (requisito):
    - Se compara como string para robustez: "2" === 2 (normalizado)
  */
  const myOrders = allOrders.filter((o) => String(o.userId) === String(session.id));

  // Guarda en store los pedidos del usuario (útil si otra parte lo necesita)
  store.actions.setOrders(myOrders);

  /*
    Filtrado adicional para asegurar consistencia de datos antes de render:
    - que exista el pedido
    - que tenga items (array)
  */
  const visible = myOrders.filter((o) => o && o.items); // filter

  /*
    Render del layout:
    - Tabla con pedidos visibles
    - Si no hay pedidos, muestra "No orders yet."
    - Se renderiza un segundo <tr> por pedido para listar items como texto
  */
  mount(
    LayoutTemplate({
      session,
      activeRoute: "#/orders",
      title: "My Orders",
      subtitle: "Track your orders status.",
      content: `
        <div class="card pad">
          <table class="table">
            <thead>
              <tr>
                <th>Order</th><th>Date</th><th>Status</th><th>Total</th><th>Items</th>
              </tr>
            </thead>
            <tbody>
              ${
                visible.length === 0
                  ? `<tr><td colspan="5" class="mini">No orders yet.</td></tr>`
                  : visible
                      .map(
                        (o) => `
                          <tr>
                            <td>#${o.id}</td>
                            <td>${fmt.date(o.createdAt)}</td>
                            <td>${StatusTagTemplate(o.status)}</td>
                            <td>${fmt.money(o.total)}</td>
                            <td>${o.items.length}</td>
                          </tr>
                          <tr>
                            <td colspan="5" style="border-radius:12px; border:1px solid var(--border); border-top:0">
                              <div class="mini" style="padding:10px 12px">
                                ${o.items.map((it) => `${it.qty}x ${it.name}`).join(" • ")}
                              </div>
                            </td>
                          </tr>
                        `
                      )
                      .join("")
              }
            </tbody>
          </table>
        </div>
      `,
    })
  );

  /*
    Logout:
    - Limpia sesión del store + localStorage
    - Redirige a login
  */
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    store.actions.clearSession();
    window.location.hash = "#/login";
  });
}
