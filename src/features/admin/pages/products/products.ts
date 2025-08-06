import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'types/const';

interface Product {
  id: string;
  slug: string;
  title: string;
  image: string;
  categories: string[];
  price: number;
  isSale: boolean;
  salePercent: number;
  isVisible: boolean;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}
interface UpdateProductDTO {
  title?: string;
  price?: number;
  categories?: string[];
  images?: string[];
  isSale?: boolean;
  isVisible?: boolean;
  salePercent?: number;
  shortDesc?: string;
  longDesc?: string;
}
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products {
  // Search and filter
  searchQuery = signal('');
  selectedCategory = signal('all');
  selectedStatus = signal('all');
  showFilters = signal(false);

  // Pagination
  currentPage = signal(1);
  itemsPerPage = signal(12);
  totalItems = signal(0);

  // Modal state
  showEditModal = signal(false);
  editingProduct = signal<Product | null>(null);
  editForm = signal({
    title: '',
    categories: [] as string[],
    price: 0,
    image: '',
    isSale: false,
    isVisible: true,
    salePercent: 0,
    shortDesc: '',
    longDesc: '',
  });

  // Products data
  products = signal<Product[]>([]);

  categories = signal<Category[]>([
    { id: 'all', name: 'All Categories', count: 6 },
    { id: 'electronics', name: 'Electronics', count: 3 },
    { id: 'furniture', name: 'Furniture', count: 1 },
    { id: 'home-kitchen', name: 'Home & Kitchen', count: 1 },
    { id: 'sports', name: 'Sports', count: 1 },
  ]);
  availableCategories = signal([
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Home & Kitchen', label: 'Home & Kitchen' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Books', label: 'Books' },
  ]);

  totalProducts = signal(0);

  constructor(private httpClient: HttpClient) {
    effect(() => {
      if (this.products().length > 0) {
        this.updateFilteredProducts();
      }
    });

    effect(() => {
      if (this.filteredProducts().length > 0) {
        this.updatePagination();
      }
    });

    this.httpClient.get(`${API_URL}/product`).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.products.set(res.data);
          this.totalProducts.set(res.data.length);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  activeProducts = computed(
    () => this.products().filter((p) => p.isVisible == true).length
  );

  onSaleProducts = computed(
    () => this.products().filter((p) => p.isSale == true).length
  );

  filteredProducts = signal<Product[]>([]);
  paginatedProducts = signal<Product[]>([]);

  openEditModal(product: Product): void {
    this.editingProduct.set(product);

    // Populate form với dữ liệu hiện tại của sản phẩm
    this.editForm.set({
      title: product.title,
      categories: [...product.categories], // Copy array để tránh reference
      price: product.price,
      image: product.image, // Sử dụng image string
      isSale: product.isSale,
      isVisible: product.isVisible,
      salePercent: product.salePercent,
      shortDesc: product.shortDesc || '',
      longDesc: product.longDesc || '',
    });

    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.editingProduct.set(null);
    this.resetEditForm();
  }

  resetEditForm(): void {
    this.editForm.set({
      name: '',
      category: '',
      price: 0,
      stock: 0,
      status: 'active',
      description: '',
    });
  }

  saveProduct(): void {
    const product = this.editingProduct();
    if (!product) return;

    this.products.update((products) =>
      products.map((p) =>
        p.id === product.id
          ? {
              ...p,
              name: this.editForm().name,
              category: this.editForm().category,
              price: this.editForm().price,
              stock: this.editForm().stock,
              status: this.editForm().status,
              description: this.editForm().description,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : p
      )
    );

    // Update filtered products and pagination
    this.updateFilteredProducts();

    // Close modal
    this.closeEditModal();
  }

  updateFilteredProducts(): void {
    let filtered = this.products();

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.id.toLowerCase().includes(query)
      );
    }

    if (this.selectedCategory() !== 'all') {
      filtered = filtered.filter(
        (product) =>
          product.categories[0].toLowerCase().replace(/\s+/g, '-') ===
          this.selectedCategory()
      );
    }

    this.filteredProducts.set(filtered);
    this.totalItems.set(filtered.length);

    const totalPages = Math.ceil(filtered.length / this.itemsPerPage());
    if (this.currentPage() > totalPages) {
      this.currentPage.set(1);
    }
  }

  updatePagination(): void {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();

    const paginated = this.filteredProducts().slice(startIndex, endIndex);

    this.paginatedProducts.set(paginated);
  }

  onSearch(): void {
    this.updateFilteredProducts();
  }

  onCategoryChange(): void {
    this.updateFilteredProducts();
  }

  onStatusChange(): void {
    this.updateFilteredProducts();
  }

  // Pagination methods
  getTotalPages(): number {
    return Math.ceil(this.totalItems() / this.itemsPerPage());
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      }
    }

    return pages;
  }
  goToPage(page: number): void {
    console.log('goToPage called with page:', page);

    if (page > 0 && page <= this.getTotalPages()) {
      this.currentPage.set(page);
    }
  }

  // Product actions
  editProduct(product: Product): void {
    this.openEditModal(product);
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
      this.products.update((products) =>
        products.filter((p) => p.id !== product.id)
      );
      this.updateFilteredProducts();
    }
  }

  toggleProductStatus(product: Product): void {
    this.products.update((products) =>
      products.map((p) =>
        p.id === product.id ? { ...p, isVisible: !product.isVisible } : p
      )
    );

    this.httpClient
      .patch(`${API_URL}/product/sale/${product.slug}`, {})
      .subscribe({
        next: (res: any) => {
          console.log(res);
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.updateFilteredProducts();
  }

  // Utility methods
  getStatusClass(isVisible: boolean): string {
    return isVisible ? 'status-active' : 'status-inactive';
  }

  public moneyFormat(price: number) {
    return `${new Intl.NumberFormat('vi-VN').format(price)}đ`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Math utility for template
  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  // Toggle filters
  toggleFilters(): void {
    this.showFilters.update((value) => !value);
  }
}
