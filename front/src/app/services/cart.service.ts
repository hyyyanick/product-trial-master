import { HttpClient } from "@angular/common/http";
import { effect, inject, Injectable, signal } from "@angular/core";
import { Product } from "app/models/product.model";
import { environment } from "environments/environment";
import { catchError, Observable, tap } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class CartService {
    private readonly http = inject(HttpClient);
    private readonly authService = inject(AuthService);
    private readonly path = environment.baseApiUrl + "/cart";

    private readonly _cartItems = signal<any[]>([]);

    public readonly cartItems = this._cartItems.asReadonly();

    constructor() {
        // Automatically fetch cart on login
        effect(() => {
            if (this.authService.isLoggedIn()) {
                this.get().subscribe();
            } else {
                this._cartItems.set([]); // Clear cart when logged out
            }
        }, {allowSignalWrites: true});
    }

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
        return this.http.patch<boolean>(`${this.path}/${productId}`, {quantity});
    }
}