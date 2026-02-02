import { mount } from "../utils/dom.js";
import { LayoutTemplate } from "../templates/layout.template.js";
import { store } from "../state/store.js";
import { tasksService } from "../services/tasks.service.js";
import { fmt } from "../utils/format.js";

/*
  MyTasksView
    Muestra únicamente las tareas del usuario logueado
    
  Nota: esta vista hace render dinámico (SPA) usando LayoutTemplate + mount.
*/
export async function MyTasksView() {
  const { session } = store.getState();

  /*
    Protección básica por sesión:
    si no hay sesión activa, redirige al login.
  */
  if (!session) {
    window.location.hash = "#/login";
    return;
  }

  /*
    Trae las tareas filtradas según el usuario que esté logueado
  */
  const allTasks = await tasksService.listByUser(session.id);
  store.actions.setTasks(allTasks);

  /*
    Render del layout:
    - Tabla con tareas visibles
    - Si no hay tareas, muestra "No tasks yet."
    - Se renderiza un segundo <tr> por tarea para listar items como texto
  */
  mount(LayoutTemplate({
      session,
      activeRoute: "#/tasks",
      title: "My Tasks",
      subtitle: "Manage your academic tasks.",
      content: `
        <div class="card pad">
          <table class="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Due</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${
                allTasks.length === 0
                  ? `<tr><td colspan="4">No tasks yet.</td></tr>`
                  : allTasks.map( t => `
                          <tr>
                            <td>${t.title}</td>
                            <td>${t.status}</td>
                            <td>${fmt.date(t.dueDate)}</td>
                            <td>
                              <a href="#/task/edit/${t.id}">Edit</a>
                            </td>
                          </tr>
                          <tr>
                        `).join("")
              }
            </tbody>
          </table>
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
