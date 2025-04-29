
import { Component, OnInit, inject, signal } from "@angular/core";
import { Product } from "app/models/product.model";
import { ProductsService } from "app/services/products.service";

import { ButtonModule } from "primeng/button";
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [TableModule, RatingModule, TagModule, ButtonModule, CommonModule, FormsModule],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  public readonly products = this.productsService.products;

  ngOnInit() {
    this.productsService.get().subscribe();
  }

  public addCart(product: Product) {
  }

  public addWishlist(product: Product) {
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
}
