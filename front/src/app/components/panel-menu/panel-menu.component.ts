import {
    Component,
    inject,
    signal,
  } from "@angular/core";
import { AuthService } from "app/services/auth.service";
import { MenuItem } from "primeng/api";
  import { PanelMenuModule } from 'primeng/panelmenu';
  
  @Component({
    selector: "app-panel-menu",
    standalone: true,
    imports: [PanelMenuModule],
    template: `
        <p-panelMenu [model]="items" styleClass="w-full" />
    `
  })
  export class PanelMenuComponent {
    private readonly authService = inject(AuthService);
    // public readonly isVisible = signal<boolean>(this.authService.isLoggedIn());

    public readonly items: MenuItem[] = [
        {
            label: 'Accueil',
            icon: 'pi pi-home',
            routerLink: ['/home']
        },
        {
            label: 'Produits',
            icon: 'pi pi-barcode',
            routerLink: ['/products/list'],
            visible: this.authService.isLoggedIn()
        },
        {
            label: 'Wishlist',
            icon: 'pi pi-heart',
            routerLink: ['/wishlist'],
            visible: this.authService.isLoggedIn()
        },
        {
            label: 'Contact',
            icon: 'pi pi-envelope',
            routerLink: ['/contact'],
            visible: this.authService.isLoggedIn()
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => {
            this.authService.logout();
          },
          visible: this.authService.isLoggedIn()
      }
    ]
  }
  