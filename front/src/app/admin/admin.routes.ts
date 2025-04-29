import { Routes } from "@angular/router";
import { ProductListComponent } from "./products/product-list/product-list.component";

export const ADMIN_ROUTES: Routes = [
    {
        path: "products",
        component: ProductListComponent,
    },
];