import { LoginView } from "../views/login.view.js";
import { UserMenuView } from "../views/userMenu.view.js";
import { MyOrdersView } from "../views/myOrders.view.js";
import { ProfileView } from "../views/profile.view.js";
import { AdminDashboardView } from "../views/adminDashboard.view.js";
import { NotFoundView } from "../views/notFound.view.js";

export const ROUTES = {
  "#/login": LoginView,
  "#/menu": UserMenuView,
  "#/orders": MyOrdersView,
  "#/profile": ProfileView,
  "#/admin": AdminDashboardView,
  "*": NotFoundView
};
