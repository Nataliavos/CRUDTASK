import { mount } from "../utils/dom.js";
import { usersService } from "../services/users.service.js";
import { store } from "../state/store.js";

/*
  LoginView

  Responsabilidad:
  - Renderizar el formulario de login
  - Capturar el submit con preventDefault (requisito)
  - Validar si el usuario existe (por email + rol)
  - Crear el usuario si no existe (persistencia en JSON Server)
  - Guardar la sesión en el store (y localStorage mediante store.actions)
  - Redirigir según rol (admin -> #/admin, user -> #/menu)

  Nota: aquí no hay contraseña; la “autenticación” es simulada con email + rol.
*/
export async function LoginView() {

  /*
    Render del formulario (HTML inyectado desde JS).
    - El id="loginForm" se usa para enlazar el submit con addEventListener.
  */
  mount(`
    <div class="centerBox">
      <div class="card authCard">
        <div class="brand" style="justify-content:center"><span class="logo"></span></div>
        <h2>CRUDZASO</h2>
        <h2>Welcome back</h2>
        <p>Enter your credentials to acces the platform</p>

        <form id="loginForm">
          <div class="field">
            <label>Full Name</label>
            <input name="name" placeholder="e.g. John Doe" required />
          </div>
          <div class="field">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="name@example.com" required />
          </div>
          <div class="field">
            <label>Password</label>
            <input name="password" type="password" required />
          </div>
          <div class="field">
            <label>Select Role</label>
            <select name="role" required>
              <option value="user">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button class="btn" style="width:100%">Sign In</button>
        </form>

        <div class="footerNote">Don't have an account? <a href="#/register">Register</a></div>
      </div>
    </div>
  `);

  // Referencia al formulario para manejar el submit
  const form = document.getElementById("loginForm");

  /*
    Submit handler:
    - preventDefault (requisito)
    - Lee inputs con FormData
    - Valida/crea usuario en JSON Server
    - Guarda sesión y redirige
  */
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // REQUISITO: formularios con preventDefault

    // Extrae datos del formulario
    const fd = new FormData(form);
    const name = String(fd.get("name")).trim();
    const email = String(fd.get("email")).trim().toLowerCase();
    const password = String(fd.get("password") || "");
    const role = String(fd.get("role"));

    // Carga usuarios desde API y sincroniza con store
    const users = await usersService.list();
    store.actions.setUsers(users);

    /*
      some (requisito):
      Conflicto si existe el mismo email con un rol distinto.
      Esto fuerza coherencia: un mismo email no debería ser user y admin a la vez.
    */
    const conflict = users.some((u) => u.email === email && u.role !== role);
    if (conflict) {
      alert("Ese email ya existe con otro rol. Usa el rol correcto.");
      return;
    }

    /*
      find (requisito):
      Busca si ya existe un usuario con ese email y ese rol.
    */
    let user = users.find((u) => u.email === email && u.role === role);

    /*
      Si no existe, se crea en la API.
      Esto cumple persistencia de usuarios (JSON Server).
    */
    if (!user) {
      user = await usersService.create({ name, email, role });
      store.actions.setUsers([...users, user]);
    }

    // Guarda sesión en el store (y localStorage por dentro)
    store.actions.setSession(user);

    // Redirige según rol (protección/flujo de rutas)
    window.location.hash = role === "admin" ? "#/admin" : "#/menu";
  });
}
