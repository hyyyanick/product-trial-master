import { inject, Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
  providedIn: "root"
})
export class CustomMessageService {
  private messageService = inject(MessageService);

  public getSuccessMessage(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: "Success",
      detail: message,
    });
  }

  public getErrorMessage(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: "Error",
      detail: message,
    });
  }
}