import { Component, inject } from '@angular/core';
import { ProductListComponent } from './product-list/product-list.component';
import { ToastModule } from "primeng/toast";
import { ProductsService } from 'app/services/products.service';
import { CartService } from 'app/services/cart.service';
import { WishlistService } from 'app/services/wishlist.service';
import { Product } from 'app/models/product.model';
import { CustomMessageService } from 'app/services/message.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductListComponent, ToastModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly customMessageService = inject(CustomMessageService);

  public readonly products = this.productsService.products;

  ngOnInit() {
    this.productsService.get().subscribe();
  }

  public handleAddCart(product: Product) {
    this.cartService.create(product._id).subscribe({
      next: () => {
        this.customMessageService.getSuccessMessage("Produit ajouté au panier");
      },
      error: (err) => {
        this.customMessageService.getErrorMessage("Erreur lors de l'ajout du produit au panier");
      },
    });
  }

  public handleAddWishlist(product: Product) {
    this.wishlistService.create(product._id).subscribe({
      next: () => {
        this.customMessageService.getSuccessMessage("Produit ajouté à la liste de souhaits");
      },
      error: (err) => {
        if (err?.error?.message === "Product already in wishlist") {
          this.customMessageService.getErrorMessage("Produit déjà dans la liste de souhaits");
        }
      },
    });
  }
}
