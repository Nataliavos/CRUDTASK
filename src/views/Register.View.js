import { mount } from "../utils/dom";
import { authService } from "../services/auth.service";

export async function RegisterView() {
    mount(`
    <div class="centerBox">
      <div class="card authCard">
        <h2>Create account</h2>

        <form id="registerForm">
          <div class="field">
            <label>Full Name</label>
            <input name="name" required />
          </div>

          <div class="field">
            <label>Email</label>
            <input name="email" required />
          </div>

          <div class="field">
            <label>Password</label>
            <input type="password" name="password" required />
          </div>

          <button class="btn">Register</button>
        </form>

        <div class="footerNote">Already have an account? <a href="#/login" target="_blank" rel="noopener noreferrer">Sign in</a></div>

      </div>
    </div>
  `);

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(e.target);

    try {
        await authService.register({
            name: fd.get("name"),
            email: fd.get("email"),
            password: fd.get("password")
        });

        window.location.hash = "#/login";

    } catch (err) {
        alert(err.message);
    }
    });
}