import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'types/const';

interface Product {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: string;
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

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products implements OnInit {
  // Search and filter
  searchQuery = signal('');
  selectedCategory = signal('all');
  selectedStatus = signal('all');
  showFilters = signal(false);

  // Pagination
  currentPage = signal(1);
  itemsPerPage = signal(10);
  totalItems = signal(0);

  // Modal state
  showEditModal = signal(false);
  editingProduct = signal<Product | null>(null);
  editForm = signal({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    status: 'active' as 'active' | 'inactive' | 'out-of-stock',
    description: '',
  });

  // Products data
  products = signal<Product[]>([
  ]);

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
    this.httpClient.get(`${API_URL}/product`).subscribe({
      next: (res:any) => {
        if(res.success) {
          this.products.set(res.data)
          this.totalProducts.set(res.pagination.totalItems)
        }
      },
      error: (error) => {
        console.log(error)
      }
    });
  }
  // Computed properties for stats

  activeProducts = computed(
    () => this.products().filter((p) => p.isVisible == true).length
  );

  onSaleProducts = computed(
    () => this.products().filter((p) => p.isSale == true).length
  );

  // Computed properties
  filteredProducts = signal<Product[]>([]);
  paginatedProducts = signal<Product[]>([]);

  ngOnInit(): void {
    this.updateFilteredProducts();
    this.updatePagination();
  }

  // Modal methods
  openEditModal(product: Product): void {
    this.editingProduct.set(product);
    // this.editForm.set({
    //   title: product.title,
    //   category: product.category,
    //   price: product.price,
    //   stock: product.stock,
    //   status: product.status,
    //   description: product.description,
    // });
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

    // Update the product
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

  // Filter and search methods
  updateFilteredProducts(): void {
    let filtered = this.products();

    // Search filter
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.id.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (this.selectedCategory() !== 'all') {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase().replace(/\s+/g, '-') ===
          this.selectedCategory()
      );
    }

    // Status filter
    // if (this.selectedStatus() !== 'all') {
    //   filtered = filtered.filter(
    //     (product) => product.isVisible === this.selectedStatus()
    //   );
    // }

    this.filteredProducts.set(filtered);
    this.totalItems.set(filtered.length);
    this.currentPage.set(1);
    this.updatePagination();
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
    if (page > 0 && page <= this.getTotalPages()) {
      this.currentPage.set(page);
      this.updatePagination();
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
    this.updateFilteredProducts();
  }

  // Utility methods
  getStatusClass(isVisible: boolean): string {
    return isVisible ? 'status-active' : 'status-inactive';
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'stock-empty';
    if (stock < 10) return 'stock-low';
    return 'stock-ok';
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
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
