import { Component, OnInit, inject, signal } from "@angular/core";
import { Product } from "app/models/product.model";

import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { ProductFormComponent } from "../product-form/product-form.component";
import { ProductsService } from "app/services/products.service";
import { ToastModule } from "primeng/toast";
import { CustomMessageService } from "app/services/message.service";

const emptyProduct: Product = {
  _id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent, ToastModule],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly customeMessageService = inject(CustomMessageService);

  public readonly products = this.productsService.products;

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  ngOnInit() {
    this.productsService.get().subscribe();
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product._id).subscribe({
      next: () => {
        this.customeMessageService.getSuccessMessage("Product deleted successfully");
      },
      error: (error) => {
        this.customeMessageService.getErrorMessage(error?.error?.message);
      }
    });
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe({
        next: () => {
          this.customeMessageService.getSuccessMessage("Product created successfully");
        },
        error: (error) => {
          this.customeMessageService.getErrorMessage(error?.error?.message);
        }
      });
    } else {
      this.productsService.update(product).subscribe({
        next: () => {
          this.customeMessageService.getSuccessMessage("Product updated successfully");
        },
        error: (error) => {
          this.customeMessageService.getErrorMessage(error?.error?.message);
        }
      });
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }
}