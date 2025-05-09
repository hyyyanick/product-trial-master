import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Product } from "app/models/product.model";
import { environment } from "environments/environment";
import { catchError, Observable, tap } from "rxjs";

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
            catchError((err) => {
                this._cartItems.set([]);
                return [];
            }),
            tap((cartItems) => {
                this._cartItems.set(cartItems);
            }),
        );
    }

    public create(productId: number): Observable<boolean> {
        return this.http.post<boolean>(`${this.path}/${productId}`, {}).pipe(
            tap(() => this._cartItems.update(cartItems => {
                const product = cartItems.find(cartItem => cartItem.product === productId);
                if (product) {
                    return [...cartItems];
                }
                return [{ product: productId, quantity: 1 }, ...cartItems];
            })),
        );
    }
    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.path}/${productId}`).pipe(
            tap(() => this._cartItems.update(cartItems => cartItems.filter(cartItem => cartItem.product._id !== productId))),
        );
    }

    public update(productId: string, quantity: number): Observable<boolean> {
      return this.http.patch<boolean>(`${this.path}/${productId}`, {quantity}).pipe(
        tap(() => this._cartItems.update(cartItems => {
            const cartItem = cartItems.find(item => item.product._id === productId);
            if (cartItem) {
                cartItem.quantity = quantity;
            }
            return [...cartItems];
        })),
    );
    }
}