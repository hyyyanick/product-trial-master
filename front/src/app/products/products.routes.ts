import { Routes } from "@angular/router";
import { ProductsComponent } from "./products.component";

export const PRODUCTS_ROUTES: Routes = [
	{
		path: "list",
		component: ProductsComponent,
	},
	{ path: "**", redirectTo: "list" },
];
