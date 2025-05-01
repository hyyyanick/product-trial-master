import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CustomMessageService } from 'app/services/message.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, CardModule, InputTextModule, InputTextareaModule, ButtonModule, ToastModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private customMessageService = inject(CustomMessageService);
  readonly maxMessageLength: number = 300;

  contactForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required, Validators.maxLength(this.maxMessageLength)]),
  });

  public async onSubmit() {
    if (this.contactForm.valid) {
      const { email, message } = this.contactForm.value;
      this.customMessageService.getSuccessMessage("Demande de contact envoyée avec succès !");

      // Clear form
      this.contactForm.reset();
    }
  }

  public isFieldInvalid(field: string): boolean {
    const control: FormControl = this.contactForm.get(field) as FormControl;
    return control.invalid && (control.dirty || control.touched);
  }

  public getErrorMessage(field: string): string {
    const control: FormControl = this.contactForm.get(field) as FormControl;
    if (control.hasError('required')) {
      return 'Ce champ est obligatoire.';
    } else if (control.hasError('email')) {
      return 'Adresse e-mail invalide.';
    } else if (control.hasError('maxlength')) {
      return `Le message ne doit pas dépasser ${this.maxMessageLength} caractères.`;
    }
    return '';
  }
}
