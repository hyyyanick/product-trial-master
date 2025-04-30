
import { Component, OnInit, inject, signal } from "@angular/core";
import { Product } from "app/models/product.model";
import { ProductsService } from "app/services/products.service";

import { ButtonModule } from "primeng/button";
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from "primeng/inputnumber";
import { CartService } from "app/services/cart.service";
import { WishlistService } from "app/services/wishlist.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [TableModule, RatingModule, TagModule, ButtonModule, CommonModule, FormsModule, InputNumberModule, ToastModule],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly messageService = inject(MessageService);

  public readonly products = this.productsService.products;

  ngOnInit() {
    this.productsService.get().subscribe();
  }

  public addCart(product: Product) {
    this.cartService.create(product._id).subscribe();
  }

  public addWishlist(product: Product) {
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

  public getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
    }
  }

  public updateQuantity(product: Product, quantity: number) {
    product.quantity = quantity;
  }
}
