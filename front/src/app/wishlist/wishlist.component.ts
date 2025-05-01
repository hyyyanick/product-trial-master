import { Component, inject } from '@angular/core';

import { WishlistService } from 'app/services/wishlist.service';
import { WishListTableComponent } from './wish-list-table/wishlist-table.component';
import { ToastModule } from 'primeng/toast';
import { CustomMessageService } from 'app/services/message.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [WishListTableComponent, ToastModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
  private readonly wishlistService = inject(WishlistService);
  private readonly customMessageService = inject(CustomMessageService);

  public readonly wishlistItems = this.wishlistService.wishlistItems;

  ngOnInit() {
    this.wishlistService.get().subscribe();
  }

  handleRemove(wishlistItem: any) {
    this.wishlistService.delete(wishlistItem._id).subscribe({
      next: () => {
        this.customMessageService.getSuccessMessage("Produit supprimé de la liste de souhaits");
      },
      error: (error) => {
        this.customMessageService.getErrorMessage("Une erreur est survenue lors de la suppression du produit de la liste de souhaits");
      }
    });
  }
}
