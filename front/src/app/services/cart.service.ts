import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Product } from "app/models/product.model";
import { environment } from "environments/environment";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CartService {
    private readonly http = inject(HttpClient);
    private readonly path = environment.baseApiUrl + "/cart";

    private readonly _cartItems = signal<any[]>([]);

    public readonly cartItems = this._cartItems.asReadonly();

    public get(): Observable<Product[]> {
        return this.http.get<Product[]>(this.path).pipe(
            tap((cartItems) => this._cartItems.set(cartItems)),
        );
    }

    public create(productId: number): Observable<boolean> {
        return this.http.post<boolean>(`${this.path}/${productId}`, {}).pipe(
            tap(() => this._cartItems.update(cartItems => [productId, ...cartItems])),
        );
    }
    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.path}/${productId}`).pipe(
            tap(() => this._cartItems.update(cartItems => cartItems.filter(cartItem => cartItem._id !== productId))),
        );
    }

    public update(product: Product): Observable<boolean> {
        return this.http.patch<boolean>(`${this.path}/${product._id}`, product).pipe(
            tap(() => this._cartItems.update(cartItems => {
                return cartItems.map(p => p._id === product._id ? product : p)
            })),
        );
    }
}