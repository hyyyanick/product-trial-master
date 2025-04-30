import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Product } from 'app/models/product.model';
import { getSeverity } from 'app/utils/severity.util';

@Component({
  selector: 'app-wishlist-table',
  standalone: true,
  imports: [TableModule, ButtonModule, TagModule, CommonModule, FormsModule],
  templateUrl: './wishlist-table.component.html',
  styleUrl: './wishlist-table.component.scss'
})
export class WishListTableComponent {
  public readonly wishlistItems = input.required<Product[]>();
  public readonly onRemove = output<Product>();

  public getSeverity(status: string) {
    return getSeverity(status);
  }

  public remove(wishlistItem: Product) {
    this.onRemove.emit(wishlistItem);
  }
}
