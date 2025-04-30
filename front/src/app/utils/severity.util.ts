import { SEVERITY } from "app/models/severity.model";

export function getSeverity(status: string): SEVERITY {
    let severityText: SEVERITY;
    switch (status) {
      case 'INSTOCK':
        severityText = 'success';
        break
      case 'LOWSTOCK':
        severityText = 'warning';
        break;
      case 'OUTOFSTOCK':
        severityText = 'danger';
        break;
    }

    return severityText;
}