import { fmt } from "../../utils/format.js";
import { StatusTagTemplate } from "./statusTag.template.js";

export function OrderRowTemplate(order, isAdmin = false) {
  return `
    <tr>
      <td>${order.id}</td>
      <td>${fmt.date(order.createdAt)}</td>
      <td>${StatusTagTemplate(order.status)}</td>
      <td>${fmt.money(order.total)}</td>
      <td>
        ${isAdmin ? `<button class="btn small secondary" data-open="${order.id}">Details</button>` : ""}
      </td>
    </tr>
  `;
}
