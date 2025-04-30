import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from 'app/models/product.model';
import { CartService } from 'app/services/cart.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  private readonly cartService = inject(CartService);

  public readonly cartItems = this.cartService.cartItems;
  public readonly total = computed(() => this.cartItems().reduce((acc, item) => acc + item.price * item.quantity, 0));

  ngOnInit() {
    this.cartService.get().subscribe();
  }

  remove(cartItem: any) {
  }

}
