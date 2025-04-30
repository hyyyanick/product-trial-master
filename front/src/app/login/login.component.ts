import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, CardModule, InputTextModule, PasswordModule, ButtonModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  public isFieldInvalid(field: string): boolean {
    const control: FormControl = this.loginForm.get(field) as FormControl;
    return control.invalid && (control.dirty || control.touched);
  }

  public getErrorMessage(field: string): string {
    const control: FormControl = this.loginForm.get(field) as FormControl;
    if (control.hasError('required')) {
      return 'Ce champ est obligatoire.';
    } else if (control.hasError('email')) {
      return 'Adresse e-mail invalide.';
    }
    return '';
  }
  
  onLogin() {
    const { email, password } = this.loginForm.value;
    this.authService.login(email as string, password as string).subscribe({
      next: (response) => {
        if (response) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Logged in successfully',
          });
          setTimeout(() => {
            this.router.navigate(['home']);
          }, 1000);
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong',
        });
      },
    });
  }
}
