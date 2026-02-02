import { mount } from "../utils/dom.js";
import { LayoutTemplate } from "../templates/layout.template.js";
import { fmt } from "../utils/format.js";
import { store } from "../state/store.js";
import { tasksService } from "../services/tasks.service.js";

/*
  ProfileView
  - Muestra la información del usuario logueado
*/
export async function ProfileView() {
  const { session } = store.getState();

  /*
    Obtiene las tareas del usuario actual desde la API.
    Se usa listByUser para evitar traer tareas de otros usuarios.
  */
  const tasks = await tasksService.listByUser(session.id);

  /*
    count: número total de tareas
  */
  const count = tasks.length;

  /*
    Render del layout
  */
  mount(LayoutTemplate({
    session,
    activeRoute: "#/profile",
    title: "Profile",
    subtitle: "Your account information.",
    content: `
      <div class="split">
        <div class="card pad">
          <h3 style="margin:0 0 8px">User Info</h3>

          <div class="mini">Name</div>
          <div style="font-weight:900; margin-bottom:10px">${session.name}</div>

          <div class="mini">Email</div>
          <div style="font-weight:900; margin-bottom:10px">${session.email}</div>

          <div class="mini">Role</div>
          <div style="font-weight:900; margin-bottom:10px">${session.role}</div>
        </div>

        <div class="card pad">
          <h3 style="margin:0 0 8px">Stats</h3>

          <div class="totalRow">
            <span>Tasks</span>
            <span style="font-weight:900">${count}</span>
          </div>
          
        </div>
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
