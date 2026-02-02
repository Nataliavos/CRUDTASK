import { mount } from "../utils/dom.js";
import { LayoutTemplate } from "../templates/layout.template.js";
import { OrderRowTemplate } from "../templates/components/orderRow.template.js";
import { StatusTagTemplate } from "../templates/components/statusTag.template.js";
import { fmt } from "../utils/format.js";
import { store } from "../state/store.js";
import { ordersService } from "../services/orders.service.js";

/*
  Estados permitidos para el flujo del pedido.
  Se usan para:
  - Mostrar filtros
  - Validar status con every (requisito)
  - Calcular el siguiente estado en el panel admin
*/
const FLOW = ["pendiente", "preparando", "listo", "entregado"];

/*
  Retorna el siguiente estado dentro del flujo.
  Si el estado ya está en el final, se mantiene en "entregado".
*/
function nextStatus(current) {
  const i = FLOW.indexOf(String(current).toLowerCase());
  return FLOW[Math.min(i + 1, FLOW.length - 1)];
}

/*
  Vista del panel administrador.

  Responsabilidad:
  - Cargar y mostrar todos los pedidos
  - Permitir filtrar por estado (adminFilter)
  - Abrir detalle de un pedido
  - Cambiar estado del pedido (pendiente -> preparando -> listo -> entregado)
  - Eliminar pedidos
  - Manejar logout del admin

  Nota: Esta vista hace render dinámico (mount) y usa eventos (addEventListener).
*/
export async function AdminDashboardView() {
  const { session, ui } = store.getState();

  /*
    Carga todos los pedidos desde la API.
    Luego los guarda en el estado global para que otras acciones/funciones
    (como openDetail) trabajen sobre un "single source of truth".
  */
  const orders = await ordersService.listAll();
  store.actions.setOrders(orders);

  /*
    filter (requisito):
    - Si adminFilter es "all", se muestran todos
    - Si no, se filtra por status (case-insensitive)
  */
  const filtered = ui.adminFilter === "all"
    ? orders
    : orders.filter((o) => String(o.status).toLowerCase() === ui.adminFilter);

  /*
    every (requisito):
    Valida que todos los pedidos tengan un status permitido.
    Esto sirve como control de integridad de datos.
  */
  const allValid = orders.every((o) => FLOW.includes(String(o.status).toLowerCase()));
  if (!allValid) {
    // Aquí podría manejarse un aviso visual.
    // En esta implementación se deja como validación silenciosa.
  }

  /*
    Render del layout:
    - toolbar con filtros (chips)
    - tabla de pedidos (OrderRowTemplate)
    - panel de detalle inicialmente oculto
  */
  mount(LayoutTemplate({
    session,
    activeRoute: "#/admin",
    title: "Admin Dashboard",
    subtitle: "Manage all orders and update their status.",
    content: `
      <div class="toolbar">
        <div class="filters">
          ${["all", ...FLOW].map((s) => `
            <button class="chip ${ui.adminFilter === s ? "active" : ""}" data-filter="${s}">
              ${s}
            </button>
          `).join("")}
        </div>

        <div class="search" style="max-width:360px">
          <span class="mini" style="font-weight:900">Total orders:</span>
          <span style="font-weight:900">${orders.length}</span>
        </div>
      </div>

      <div class="card pad">
        <table class="table">
          <thead>
            <tr>
              <th>Order</th><th>Date</th><th>Status</th><th>Total</th><th></th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map((o) => OrderRowTemplate(o, true)).join("")}
          </tbody>
        </table>
      </div>

      <div class="sep"></div>

      <div class="card pad" id="detailCard" style="display:none">
        <h3 style="margin:0 0 10px">Order Detail</h3>
        <div id="detailBody"></div>
      </div>
    `
  }));

  /*
    Logout:
    - Limpia sesión del store + localStorage
    - Redirige al login
  */
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    store.actions.clearSession();
    window.location.hash = "#/login";
  });

  /*
    FIX 2: Delegación de eventos para botones del Admin.

    Motivo:
    - En una SPA, al re-renderizar, los nodos cambian y listeners directos se pierden.
    - La delegación escucha en un contenedor estable (#app) y detecta clicks en botones
      usando data-attributes (data-open, data-next, data-delete).
  */
  const app = document.querySelector("#app");

  // Evita duplicar el listener si AdminDashboardView se ejecuta varias veces.
  if (app.__adminClickHandler) {
    app.removeEventListener("click", app.__adminClickHandler);
  }

  app.__adminClickHandler = async (e) => {
    // closest("button") permite capturar clicks incluso si se hace click en un <span> interno
    const btn = e.target.closest("button");
    if (!btn) return;

    // Identificadores de acción tomados del HTML (templates) con data-attributes
    const openId = btn.dataset.open;
    const nextId = btn.dataset.next;
    const deleteId = btn.dataset.delete;

    // 1) Details: abre el detalle del pedido
    if (openId) {
      openDetail(String(openId));
      return;
    }

    // 2) Next status: actualiza el estado del pedido en el backend
    if (nextId) {
      const orderId = String(nextId);

      // find: buscar el pedido en el estado global para leer su status actual
      const order = store.getState().orders.find((o) => String(o.id) === orderId);
      if (!order) return;

      // Calcula el siguiente estado dentro del flujo
      const FLOW = ["pendiente", "preparando", "listo", "entregado"];
      const idx = FLOW.indexOf(String(order.status).toLowerCase());
      const newStatus = FLOW[Math.min(idx + 1, FLOW.length - 1)];

      // Persiste el cambio en JSON Server
      await ordersService.updateStatus(orderId, newStatus);

      // Re-render para reflejar los datos actualizados en la tabla
      await AdminDashboardView();

      // Reabre el detalle (opcional) para mostrar el status actualizado
      setTimeout(() => openDetail(orderId), 0);
      return;
    }

    // 3) Delete: elimina el pedido del backend
    if (deleteId) {
      const orderId = String(deleteId);

      const ok = confirm("Delete this order?");
      if (!ok) return;

      // Persiste la eliminación en JSON Server
      await ordersService.remove(orderId);

      // Re-render para refrescar la lista
      await AdminDashboardView();
      return;
    }
  };

  // Registra el listener delegado en el contenedor principal
  app.addEventListener("click", app.__adminClickHandler);

  /*
    Listeners para filtros (chips).

    Aquí se usa listener directo porque:
    - Estos botones se renderizan dentro del layout actual
    - Al cambiar el filtro, se re-renderiza la vista completa
  */
  document.querySelectorAll("[data-filter]").forEach((b) => {
    b.addEventListener("click", () => {
      store.actions.setUI({ adminFilter: b.dataset.filter });
      AdminDashboardView();
    });
  });

  /*
    openDetail(orderId)

    Renderiza el panel de detalle para un pedido específico.
    - Busca el pedido en store.orders (find requisito)
    - Muestra el panel oculto (display:block)
    - Inyecta HTML con información del pedido e items

    Nota: Los botones de detalle usan data-next / data-delete
    y se manejan por delegación (FIX 2), no con listeners directos.
  */
  function openDetail(orderId) {
    const st = store.getState();

    // find (requisito): localizar el pedido por id (id se maneja como string)
    const order = st.orders.find((o) => String(o.id) === String(orderId));
    if (!order) return;

    const card = document.getElementById("detailCard");
    const body = document.getElementById("detailBody");
    card.style.display = "block";

    body.innerHTML = `
      <div class="split">
        <div>
          <div class="mini">Order</div>
          <div style="font-weight:900; margin-bottom:10px">#${order.id}</div>

          <div class="mini">Created</div>
          <div style="font-weight:900; margin-bottom:10px">${fmt.date(order.createdAt)}</div>

          <div class="mini">Status</div>
          <div style="margin-bottom:10px">${StatusTagTemplate(order.status)}</div>

          <div class="mini">Total</div>
          <div style="font-weight:900; margin-bottom:10px">${fmt.money(order.total)}</div>

          <div class="right">
            <button class="btn small" data-next="${order.id}">Next status →</button>
            <button class="btn small ghost" data-delete="${order.id}">Delete</button>
          </div>
        </div>

        <div>
          <div class="mini">Items</div>
          <div class="card pad" style="box-shadow:none">
            ${order.items.map((it) => `
              <div class="line">
                <div style="font-weight:900">${it.qty}x ${it.name}</div>
                <div class="mini">${fmt.money(it.unitPrice)}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }
}
