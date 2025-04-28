import { Component, OnInit, inject, signal } from "@angular/core";
import { Product } from "app/models/product.model";
import { ProductsService } from "app/products/products.service";
import { ProductFormComponent } from "app/products/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
// import { CardModule } from "primeng/card";
// import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [TableModule, RatingModule, TagModule, IconFieldModule, InputIconModule, DialogModule, ButtonModule,CommonModule,FormsModule, ProductFormComponent],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  public readonly products = this.productsService.products;

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  public testProducts = [
    {
      "id": 1006,
      "code": "bib36pfvm",
      "name": "Chakra Bracelet",
      "description": "Product Description",
      "image": "chakra-bracelet.jpg",
      "price": 32,
      "category": "Accessories",
      "createdAt": 1718114215761,
      "updatedAt": 1718114215761,
      "shellId": 15,
      "internalReference": "REF-123-456",
      "inventoryStatus": "LOWSTOCK",
      "rating": 3
    },
    {
      "id": 1007,
      "code": "mbvjkgip5",
      "name": "Galaxy Earrings",
      "description": "Product Description",
      "image": "galaxy-earrings.jpg",
      "price": 34,
      "category": "Accessories",
      "createdAt": 1718114215761,
      "updatedAt": 1718114215761,
      "shellId": 15,
      "internalReference": "REF-123-456",
      "inventoryStatus": "INSTOCK",
      "rating": 5
    },
  ]

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
    this.productsService.delete(product._id).subscribe();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  public getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
    }
}

  private closeDialog() {
    this.isDialogVisible = false;
  }
}
