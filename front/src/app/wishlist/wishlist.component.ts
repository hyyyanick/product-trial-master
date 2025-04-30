import { Component, inject } from '@angular/core';

import { WishlistService } from 'app/services/wishlist.service';
import { WishListTableComponent } from './wish-list-table/wishlist-table.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [WishListTableComponent, ToastModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
  private readonly wishlistService = inject(WishlistService);
  private readonly messageService = inject(MessageService);

  public readonly wishlistItems = this.wishlistService.wishlistItems;
  
  ngOnInit() {
    this.wishlistService.get().subscribe();
  }

  handleRemove(wishlistItem: any) {
    this.wishlistService.delete(wishlistItem._id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Le produit a été supprimé de la liste de souhaits',
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue lors de la suppression du produit de la liste de souhaits'
        });
      }
    });
  }
}
