import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Product } from 'app/models/product.model';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule, InputNumberModule],
  templateUrl: './cart-list.component.html',
  styleUrl: './cart-list.component.scss'
})
export class CartListComponent {
  public readonly cartItems = input.required<any[]>();
  public readonly total = computed(() => this.cartItems().reduce((acc, item) => acc + item.product.price * item.quantity, 0));
  public readonly onRemove = output<Product>();
  public readonly onUpdateQuantity = output<any>();

  public remove(cartItem: Product) {
    this.onRemove.emit(cartItem);
  }

  public updateQuantity(cartItem: Product, quantity: number) {
    this.onUpdateQuantity.emit({ product: cartItem, quantity });
  }
}
