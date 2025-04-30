import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Product } from "app/models/product.model";
import { environment } from "environments/environment";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WishlistService {
    private readonly http = inject(HttpClient);
    private readonly path = environment.baseApiUrl + "/wishlist";

    private readonly _wishlistItems = signal<any[]>([]);

    public readonly wishlistItems = this._wishlistItems.asReadonly();

    public get(): Observable<Product[]> {
        return this.http.get<Product[]>(this.path).pipe(
            tap((wishlistItems) => this._wishlistItems.set(wishlistItems)),
        );
    }

    public create(productId: number): Observable<boolean> {
        return this.http.post<boolean>(`${this.path}/${productId}`, {}).pipe(
            tap(() => this._wishlistItems.update(wishlistItems => [productId, ...wishlistItems])),
        );
    }
    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.path}/${productId}`).pipe(
            tap(() => this._wishlistItems.update(wishlistItems => wishlistItems.filter(cartItem => cartItem._id !== productId))),
        );
    }
}