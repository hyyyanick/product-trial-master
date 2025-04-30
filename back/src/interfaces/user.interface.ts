export interface User {
    id: number;
    username: string;
    firstname: string;
    email: string;
    password: string;
    createdAt: number;
    cart: Array<any>;
    wishlist: Array<any>;
}