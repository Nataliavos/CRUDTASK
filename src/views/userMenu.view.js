import { mount } from "../utils/dom.js";
import { LayoutTemplate } from "../templates/layout.template.js";
import { ProductCardTemplate } from "../templates/components/productCard.template.js";
import { CartItemTemplate } from "../templates/components/cartItem.template.js";
import { escapeHtml } from "../utils/safe.js";
import { fmt } from "../utils/format.js";
import { store } from "../state/store.js";
import { menuService } from "../services/menu.service.js";
import { ordersService } from "../services/orders.service.js";

/*
  cartLinesDetailed(menu, cart)

  Responsabilidad:
  - Construir un arreglo "enriquecido" del carrito:
    toma [{ productId, qty }] y lo convierte en líneas con nombre, precio, total por línea.
  - Depende del menú para encontrar datos del producto.

  REQUISITOS:
  - map (requisito): transformar cada línea del carrito
  - find (requisito): buscar el producto en el menú por id
*/
function cartLinesDetailed(menu, cart) {
  // map + find (requisito)
  return cart.map((line) => {
    const p = menu.find((x) => x.id === line.productId);
    const unitPrice = Number(p?.price ?? 0);

    return {
      productId: line.productId,
      qty: line.qty,
      name: p?.name ?? "Unknown",
      unitPrice,
      lineTotal: unitPrice * line.qty,
    };
  });
}

/*
  totals(lines)

  Responsabilidad:
  - Calcular subtotal, tax y total con base en las líneas del carrito.
  - Usa reduce para sumar los totales por línea.
*/
function totals(lines) {
  const subtotal = lines.reduce((a, b) => a + b.lineTotal, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

/*
  UserMenuView

  Responsabilidad:
  - Mostrar el menú (productos) y el carrito en la misma vista
  - Permitir filtrar por categoría y buscar por nombre
  - Permitir agregar productos al carrito y ajustar cantidades
  - Confirmar pedido (crear order en JSON Server)
  - Cumplir requisitos: DOM dinámico, eventos, preventDefault, map/filter/find/some/every
*/
export async function UserMenuView() {
  const st = store.getState();

  /*
    Carga inicial del menú:
    - Si el menú aún no está en el store, se trae desde la API.
    - Esto evita repetir el fetch en cada re-render.
  */
  if (st.menu.length === 0) {
    const menu = await menuService.list();
    store.actions.setMenu(menu);
  }

  // Se vuelven a leer datos del store ya hidratados
  const { session, menu, cart, ui } = store.getState();

  /*
    Categorías:
    - "All" + categorías únicas tomadas del menú
    - Se usa Set para unicidad y map para extraer category
  */
  const categories = ["All", ...Array.from(new Set(menu.map((p) => p.category)))];

  /*
    Filtro de productos visibles:

    REQUISITO:
    - filter (requisito): filtrar por categoría y por búsqueda de texto
  */
  const filtered = menu
    .filter((p) => (ui.menuCategory === "All" ? true : p.category === ui.menuCategory))
    .filter((p) => p.name.toLowerCase().includes(ui.menuSearch.toLowerCase()));

  /*
    Construye líneas detalladas del carrito + calcula totales.
  */
  const lines = cartLinesDetailed(menu, cart);
  const { subtotal, tax, total } = totals(lines);

  /*
    REQUISITO:
    - every (requisito): validar que el carrito sea coherente (qty >= 1)

    Si algo está mal (por ejemplo qty 0 o negativo),
    se limpia el carrito para evitar inconsistencias.
  */
  const cartOk = cart.every((x) => x.qty >= 1);
  if (!cartOk) store.actions.clearCart();

  /*
    Render del layout:
    - Panel izquierdo: filtros + búsqueda + cards de producto
    - Panel derecho: carrito + totales + confirmación
  */
  const html = LayoutTemplate({
    session,
    activeRoute: "#/menu",
    title: "Our Menu",
    subtitle: "Choose your favorite food and confirm your order.",
    content: `
      <div class="grid menu">
        <div>
          <div class="toolbar">
            <div class="filters">
              ${categories
        .map(
          (c) => `
                    <button class="chip ${c === ui.menuCategory ? "active" : ""}" data-cat="${c}">
                      ${c}
                    </button>
                  `
        )
        .join("")}
            </div>

            <div class="search" style="max-width:420px">
              <span style="font-weight:900;color:#9aa3a0">⌕</span>
              <input id="menuSearch" placeholder="Search food..." value="${escapeHtml(ui.menuSearch)}" />
            </div>
          </div>

          <div class="products">
            ${filtered.map(ProductCardTemplate).join("")}
          </div>
        </div>

        <div class="card orderBox">
          <div class="head">
            <h3>Your Order <span class="tag listo" style="margin-left:8px">${cart.reduce((a, b) => a + b.qty, 0)}</span></h3>
            <button class="btn small secondary" id="clearCartBtn">Clear all</button>
          </div>

          <div class="list" id="cartList">
            ${lines.length === 0 ? `<div class="mini">Your cart is empty. Add items from the menu.</div>` : ""}
            ${lines.map(CartItemTemplate).join("")}
          </div>

          <div class="totals">
            <div class="totalRow"><span>Subtotal</span><span>${fmt.money(subtotal)}</span></div>
            <div class="totalRow"><span>Tax (8%)</span><span>${fmt.money(tax)}</span></div>
            <div class="totalBig"><span>Total</span><span style="color:#0f7a35">${fmt.money(total)}</span></div>
            <div class="sep"></div>

            <form id="confirmForm">
              <button class="btn" style="width:100%" ${lines.length === 0 ? "disabled style='opacity:.6;cursor:not-allowed'" : ""}>
                Confirm Order →
              </button>
            </form>
          </div>
        </div>
      </div>
    `
  });

  // Inserta el HTML en #app (reemplaza la vista anterior)
  mount(html);

  /*
    Logout:
    - Limpia sesión y redirige al login
  */
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", () => {
    store.actions.clearSession();
    window.location.hash = "#/login";
  });

  /*
    Filtros por categoría:
    - Se guardan en store.ui
    - Se re-renderiza la vista para aplicar el filtro
  */
  document.querySelectorAll("[data-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      store.actions.setUI({ menuCategory: btn.dataset.cat });
      UserMenuView();
    });
  });

  /*
    Búsqueda por texto:
    - Se actualiza store.ui.menuSearch en cada input
    - Se re-renderiza para filtrar en tiempo real
  */
  const search = document.getElementById("menuSearch");
  search?.addEventListener("input", (e) => {
    store.actions.setUI({ menuSearch: e.target.value });
    UserMenuView();
  });

  /*
    Agregar al carrito:
    - ProductCardTemplate debe renderizar un botón con data-add="<id>"
    - Se llama store.actions.addToCart y se re-renderiza
  */
  document.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.add);
      store.actions.addToCart(id);
      UserMenuView();
    });
  });

  /*
    Cambios de cantidad:
    - data-inc / data-dec ajustan qty con +1 o -1
    - data-rm elimina "forzado" usando -999 (lógica del store deja qty <= 0 fuera)
  */
  document.querySelectorAll("[data-inc]").forEach((b) => {
    b.addEventListener("click", () => {
      store.actions.changeQty(Number(b.dataset.inc), +1);
      UserMenuView();
    });
  });
  document.querySelectorAll("[data-dec]").forEach((b) => {
    b.addEventListener("click", () => {
      store.actions.changeQty(Number(b.dataset.dec), -1);
      UserMenuView();
    });
  });
  document.querySelectorAll("[data-rm]").forEach((b) => {
    b.addEventListener("click", () => {
      store.actions.changeQty(Number(b.dataset.rm), -999);
      UserMenuView();
    });
  });

  /*
    Clear all:
    - Vacía carrito y re-renderiza
  */
  document.getElementById("clearCartBtn")?.addEventListener("click", () => {
    store.actions.clearCart();
    UserMenuView();
  });

  /*
    Confirmar pedido:

    REQUISITO:
    - Formularios con preventDefault
    - some (requisito): verificar que haya items en el carrito

    Flujo:
    - Recalcular líneas y total usando el estado actual
    - Crear un objeto order con status "pendiente"
    - Guardar en JSON Server (persistencia)
    - Limpiar carrito
    - Navegar a "#/orders"
  */
  document.getElementById("confirmForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { session: s2, menu: m2, cart: c2 } = store.getState();
    const lines2 = cartLinesDetailed(m2, c2);
    const { total: total2 } = totals(lines2);

    // some (requisito): al menos un item con qty > 0
    const hasItems = c2.some((x) => x.qty > 0);
    if (!hasItems) return;

    /*
      order:
      - id como string (UUID) para compatibilidad con /orders/:id en JSON Server beta
      - userId se guarda como number
      - items se serializa con la información necesaria para ver el pedido después
    */
    const order = {
      id: crypto.randomUUID(),
      userId: Number(s2.id),
      items: lines2.map((l) => ({
        productId: l.productId,
        qty: l.qty,
        unitPrice: l.unitPrice,
        name: l.name
      })),
      total: Number(total2.toFixed(2)),
      status: "pendiente",
      createdAt: new Date().toISOString()
    };

    await ordersService.create(order);
    store.actions.clearCart();

    // Navegación SPA a "My Orders"
    window.location.hash = "#/orders";
  });
}
