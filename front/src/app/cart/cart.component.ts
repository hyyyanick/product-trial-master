import { Component, inject, OnInit } from '@angular/core';
import { CartService } from 'app/services/cart.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CartListComponent } from './cart-list/cart-list.component';
import { Product } from 'app/models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartListComponent, ToastModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);

  public readonly cartItems = this.cartService.cartItems;

  ngOnInit() {
    this.cartService.get().subscribe();
  }

  public handleRemove(cartItem: Product) {
    this.cartService.delete(cartItem._id).subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Succès",
          detail: "Produit supprimé du panier"
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Erreur lors de la suppression du produit du panier"
        });
      }
    });
  }

  public handleUpdateQuantity(event: any) {
    this.cartService.update(event.product._id, event.quantity).subscribe({
      next: () => {},
      error: (err) => {
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Erreur lors de la mise à jour de la quantité"
        });
      }
    });
  }
}
