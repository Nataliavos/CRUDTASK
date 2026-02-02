import { mount } from "../utils/dom.js"; // render dinámico
import { LayoutTemplate } from "../templates/layout.template.js";
import { tasksService } from "../services/tasks.service.js";
import { store } from "../state/store.js";

/*
  Vista del panel administrador.

  Responsabilidad:
  - Cargar y mostrar todas las tareas
  - Permitir filtrar por estado
  - Manejar logout del admin

  Nota: Esta vista hace render dinámico (mount) y usa eventos (addEventListener).
*/
export async function AdminDashboardView() {
  const { session } = store.getState();
  if (!session || session.role !== "admin") {
    window.location.hash = "#/login";
    return;
  }

  // carga todas las tareas de la API
  const tasks = await tasksService.listAll();


  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "pending").length;
  const completed = tasks.filter(t => t.status === "completed").length;


  mount(LayoutTemplate({
    session,
    activeRoute: "#/admin",
    title: "Task Manager",
    subtitle: "Overview of your current academic performance tasks",
    content: `
      <div class="grid">
        <div class="card pad">Total Tasks: ${total}</div>
        <div class="card pad">Pending: ${pending}</div>
        <div class="card pad">Completed: ${completed}</div>
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
