export function StatusTagTemplate(status) {
  const s = String(status || "pendiente").toLowerCase();
  return `<span class="tag ${s}">${s}</span>`;
}
