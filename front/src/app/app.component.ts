import {
  Component,
  inject,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./components/panel-menu/panel-menu.component";
import { ButtonModule } from "primeng/button";
import { CartService } from "./services/cart.service";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, ButtonModule, PanelMenuComponent],
})
export class AppComponent {
  private readonly cartService = inject(CartService);
  private readonly authServiece = inject(AuthService);

  public readonly isLoggedIn = this.authServiece.isLoggedIn;
  public readonly cartItems = this.cartService.cartItems;

  title = "ALTEN SHOP";
}
