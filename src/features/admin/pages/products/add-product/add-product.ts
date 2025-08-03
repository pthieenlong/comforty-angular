import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface ProductForm {
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  description: string;
  image: string;
}

interface Category {
  value: string;
  label: string;
}

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css'],
})
export class AddProduct implements OnInit {
  // Form state
  productForm = signal<ProductForm>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    status: 'active',
    description: '',
    image: 'assets/images/all-img/product1.png', // Default image
  });

  // Form validation
  formErrors = signal<Partial<Record<keyof ProductForm, string>>>({});
  isSubmitting = signal(false);

  // Available categories
  categories = signal<Category[]>([
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Home & Kitchen', label: 'Home & Kitchen' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Books', label: 'Books' },
    { value: 'Beauty', label: 'Beauty & Personal Care' },
    { value: 'Toys', label: 'Toys & Games' },
    { value: 'Automotive', label: 'Automotive' },
    { value: 'Health', label: 'Health & Wellness' },
  ]);

  // Image upload
  selectedImage = signal<File | null>(null);
  imagePreview = signal<string>('');

  constructor(private router: Router) {}

  ngOnInit(): void {}

  // Form validation
  validateForm(): boolean {
    const errors: Partial<Record<keyof ProductForm, string>> = {};
    const form = this.productForm();

    if (!form.name.trim()) {
      errors.name = 'Product name is required';
    } else if (form.name.length < 3) {
      errors.name = 'Product name must be at least 3 characters';
    }

    if (!form.category) {
      errors.category = 'Category is required';
    }

    if (form.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (form.stock < 0) {
      errors.stock = 'Stock cannot be negative';
    }

    if (!form.description.trim()) {
      errors.description = 'Description is required';
    } else if (form.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    this.formErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  // Image handling
  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImage.set(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
        this.productForm.update((form) => ({
          ...form,
          image: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  }

  // Form submission
  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting.set(true);

    // Simulate API call
    setTimeout(() => {
      const newProduct = {
        id: `PROD-${Date.now()}`,
        ...this.productForm(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      console.log('New product:', newProduct);

      // Here you would typically save to your backend
      // For now, we'll just navigate back to products page
      this.router.navigate(['/admin/products']);
    }, 1000);
  }

  // Form reset
  resetForm(): void {
    this.productForm.set({
      name: '',
      category: '',
      price: 0,
      stock: 0,
      status: 'active',
      description: '',
      image: 'assets/images/all-img/product1.png',
    });
    this.formErrors.set({});
    this.selectedImage.set(null);
    this.imagePreview.set('');
  }

  // Utility methods
  getFieldError(field: keyof ProductForm): string {
    return this.formErrors()[field] || '';
  }

  hasFieldError(field: keyof ProductForm): boolean {
    return !!this.getFieldError(field);
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  // Navigation
  goBack(): void {
    this.router.navigate(['/admin/products']);
  }
}
