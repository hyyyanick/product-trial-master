import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WishlistService } from 'app/services/wishlist.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [TableModule, ButtonModule, TagModule, CommonModule, FormsModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
  private readonly wishlistService = inject(WishlistService);
  public readonly wishlistItems = this.wishlistService.wishlistItems;
  
  ngOnInit() {
    this.wishlistService.get().subscribe();
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

  remove(wishlistItem: any) {
    this.wishlistService.delete(wishlistItem._id).subscribe();
  }
}
