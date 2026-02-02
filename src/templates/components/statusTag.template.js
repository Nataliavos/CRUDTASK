export function StatusTagTemplate(status) {
  const s = String(status || "pending").toLowerCase();
  return `<span class="tag ${s}">${s}</span>`;
}
