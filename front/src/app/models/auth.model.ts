export interface RegisterPostData {
    username: string;
    firstname: string;
    email: string;
    password: string;
  }
  
export interface User extends RegisterPostData {
  id: string;
}