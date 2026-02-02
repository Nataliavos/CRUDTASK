import { mount } from "../utils/dom.js";
import { authService } from "../services/auth.service.js";
import { store } from "../state/store.js";

/*
  LoginView
  - Renderiza el formulario de login
  - Captura el submit con preventDefault
  - Valida si el usuario existe (por email)
  - Redirecciona a "Registrar" si el usuario no existe 
  - Guarda la sesión en el store (y localStorage mediante store.actions)
*/
export async function LoginView() {

  mount(`
    <div class="centerBox">
      <div class="card authCard">
        <div class="brand" style="justify-content:center"><span class="logo"></span></div>
        <h2>CRUDTASK</h2>
        <p>Login to your account</p>

        <form id="loginForm">
          <div class="field">
            <label>Email</label>
            <input name="email" required />
          </div>

          <div class="field">
            <label>Password</label>
            <input name="password" type="password" required />
          </div>

          <button class="btn" style="width:100%">Sign In</button>
        </form>

        <div class="footerNote">Don't have an account? <a href="#/register" target="_blank" rel="noopener noreferrer">Register</a></div>
      </div>
    </div>
  `);



  // Referencia al formulario para manejar el submit
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Extrae datos del formulario
    const fd = new FormData(e.target);
    const email = fd.get("email");
    const password = fd.get("password");

    const user = await authService.login(email, password);
    if (!user) {
      alert("Invalid credentials");
      return;
    }

    store.actions.setSession(user);
    window.location.hash = user.role === "#/admin" ? "#/admin" : "#/tasks";
  });

}
