import { Component, inject } from '@angular/core';
import { ProductListComponent } from './product-list/product-list.component';
import { ToastModule } from "primeng/toast";
import { ProductsService } from 'app/services/products.service';
import { CartService } from 'app/services/cart.service';
import { WishlistService } from 'app/services/wishlist.service';
import { MessageService } from 'primeng/api';
import { Product } from 'app/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductListComponent, ToastModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly messageService = inject(MessageService);
  
  public readonly products = this.productsService.products;
  
  ngOnInit() {
    this.productsService.get().subscribe();
  }

  public handleAddCart(product: Product) {
    this.cartService.create(product._id).subscribe();
  }
  
  public handleAddWishlist(product: Product) {
    this.wishlistService.create(product._id).subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Succès",
          detail: "Produit ajouté à la liste de souhaits"
        });
      },
      error: (err) => {
        if (err?.error?.message === "Product already in wishlist") {
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: "Produit déjà dans la liste de souhaits"
          });
        }
      },
    });
  }
}
