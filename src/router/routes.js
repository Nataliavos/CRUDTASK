import { LoginView } from "../views/Login.view.js";
import { RegisterView } from "../views/Register.View.js";
import { MyTasksView } from "../views/MyTasks.view.js";
import { AdminDashboardView } from "../views/AdminDashboard.view.js";
import { ProfileView } from "../views/Profile.view.js";
import { NotFoundView } from "../views/NotFound.view.js";

export const ROUTES = {
  "#/login": LoginView,
  "#/register": RegisterView,
  "#/tasks": MyTasksView,
  "#/admin": AdminDashboardView,
  "#/profile": ProfileView,
  "*": NotFoundView
};
