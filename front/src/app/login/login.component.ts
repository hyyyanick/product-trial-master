import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { CustomMessageService } from 'app/services/message.service';

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
  private customMessageService = inject(CustomMessageService);

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
          this.customMessageService.getSuccessMessage("Logging in successfully");
          setTimeout(() => {
            this.router.navigate(['home']);
          }, 500);
        }
      },
      error: () => {
        this.customMessageService.getErrorMessage("Erreur lors de la connexion");
      },
    });
  }
}
