import { fmt } from "../../utils/format.js";

export function CartItemTemplate(line) {
  return `
    <div class="line">
      <div>
        <div style="font-weight:900">${line.name}</div>
        <div class="mini">${fmt.money(line.unitPrice)} x ${line.qty} = ${fmt.money(line.lineTotal)}</div>
      </div>
      <div class="qty">
        <div class="stepper">
          <button data-dec="${line.productId}">−</button>
          <span style="min-width:18px; text-align:center; font-weight:900">${line.qty}</span>
          <button data-inc="${line.productId}">+</button>
        </div>
        <button class="danger" data-rm="${line.productId}">Remove</button>
      </div>
    </div>
  `;
}
