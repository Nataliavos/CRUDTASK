import { fmt } from "../../utils/format.js";

export function ProductCardTemplate(product) {
  return `
    <div class="product">
      <div class="img">
        <span class="badge">${product.category}</span>
      </div>
      <div class="body">
        <h3>
          <span>${product.name}</span>
          <span class="price">${fmt.money(product.price)}</span>
        </h3>
        <p>Freshly made. Add to your order.</p>
      </div>
      <div class="footer">
        <button class="btn small" data-add="${product.id}">Add to Cart</button>
      </div>
    </div>
  `;
}
