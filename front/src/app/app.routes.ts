import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./guards/auth.guard";
import { CartComponent } from "./cart/cart.component";
import { ContactComponent } from "./contact/contact.component";
import { WishlistComponent } from "./wishlist/wishlist.component";

export const APP_ROUTES: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "admin",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./admin/admin.routes").then((m) => m.ADMIN_ROUTES),
  },
  {
    path: "products",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./products/products.routes").then((m) => m.PRODUCTS_ROUTES)
  },
  {
    path: "cart",
    canActivate: [AuthGuard],
    component: CartComponent,
  },
  {
    path: "wishlist",
    canActivate: [AuthGuard],
    component: WishlistComponent,
  },
  {
    path: "contact",
    canActivate: [AuthGuard],
    component: ContactComponent,
  },
  { path: "", redirectTo: "home", pathMatch: "full" },
];
