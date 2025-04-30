import {
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./components/panel-menu/panel-menu.component";
import { ButtonModule } from "primeng/button";
import { CartService } from "./services/cart.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, ButtonModule, PanelMenuComponent],
})
export class AppComponent implements OnInit {
  private readonly cartService = inject(CartService);

  public readonly cartItems = this.cartService.cartItems;

  ngOnInit() {
    this.cartService.get().subscribe();
  }
  title = "ALTEN SHOP";
}
