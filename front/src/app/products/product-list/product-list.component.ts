
import { Component, input, output } from "@angular/core";
import { Product } from "app/models/product.model";

import { ButtonModule } from "primeng/button";
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from "primeng/inputnumber";
import { getSeverity } from "app/utils/severity.util";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [TableModule, RatingModule, TagModule, ButtonModule, CommonModule, FormsModule, InputNumberModule, IconFieldModule, InputIconModule],
})
export class ProductListComponent {
  public readonly products = input.required<Product[]>();
  public readonly addCart = output<(Product)>();
  public readonly addWishlist = output<(Product)>();

  public onAddCart(product: Product) {
    this.addCart.emit(product);
  }

  public onAddWishlist(product: Product) {
    this.addWishlist.emit(product);
  }

  public getSeverity(status: string) {
    return getSeverity(status);
  }

  public updateQuantity(product: Product, quantity: number) {
    product.quantity = quantity;
  }
}
