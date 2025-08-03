import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string;
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
    {
      id: 'PROD-001',
      name: 'Ergonomic Office Chair',
      category: 'Furniture',
      price: 299.99,
      stock: 45,
      status: 'active',
      image: 'assets/images/all-img/product1.png',
      description:
        'Comfortable ergonomic office chair with adjustable features',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
    },
    {
      id: 'PROD-002',
      name: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      price: 149.99,
      stock: 0,
      status: 'out-of-stock',
      image: 'assets/images/all-img/product2.png',
      description: 'High-quality wireless headphones with noise cancellation',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
    },
    {
      id: 'PROD-003',
      name: 'Smart Fitness Watch',
      category: 'Electronics',
      price: 199.99,
      stock: 23,
      status: 'active',
      image: 'assets/images/all-img/product3.png',
      description:
        'Advanced fitness tracking smartwatch with health monitoring',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-15',
    },
    {
      id: 'PROD-004',
      name: 'Coffee Maker Pro',
      category: 'Home & Kitchen',
      price: 89.99,
      stock: 67,
      status: 'active',
      image: 'assets/images/all-img/product1.png',
      description: 'Professional coffee maker with programmable features',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-16',
    },
    {
      id: 'PROD-005',
      name: 'Gaming Laptop',
      category: 'Electronics',
      price: 1299.99,
      stock: 8,
      status: 'active',
      image: 'assets/images/all-img/product2.png',
      description: 'High-performance gaming laptop with RTX graphics',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-14',
    },
    {
      id: 'PROD-006',
      name: 'Yoga Mat Premium',
      category: 'Sports',
      price: 49.99,
      stock: 0,
      status: 'inactive',
      image: 'assets/images/all-img/product3.png',
      description: 'Premium non-slip yoga mat for professional use',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-10',
    },
  ]);

  categories = signal<Category[]>([
    { id: 'all', name: 'All Categories', count: 6 },
    { id: 'electronics', name: 'Electronics', count: 3 },
    { id: 'furniture', name: 'Furniture', count: 1 },
    { id: 'home-kitchen', name: 'Home & Kitchen', count: 1 },
    { id: 'sports', name: 'Sports', count: 1 },
  ]);

  // Available categories for form
  availableCategories = signal([
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Home & Kitchen', label: 'Home & Kitchen' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Books', label: 'Books' },
  ]);

  // Computed properties for stats
  totalProducts = computed(() => this.products().length);

  activeProducts = computed(
    () => this.products().filter((p) => p.status === 'active').length
  );

  outOfStockProducts = computed(
    () => this.products().filter((p) => p.stock === 0).length
  );

  totalStock = computed(() =>
    this.products().reduce((sum, p) => sum + p.stock, 0)
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
    this.editForm.set({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      description: product.description,
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
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
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
    if (this.selectedStatus() !== 'all') {
      filtered = filtered.filter(
        (product) => product.status === this.selectedStatus()
      );
    }

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
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.products.update((products) =>
        products.filter((p) => p.id !== product.id)
      );
      this.updateFilteredProducts();
    }
  }

  toggleProductStatus(product: Product): void {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    this.products.update((products) =>
      products.map((p) =>
        p.id === product.id ? { ...p, status: newStatus } : p
      )
    );
    this.updateFilteredProducts();
  }

  // Utility methods
  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'out-of-stock':
        return 'status-out-of-stock';
      default:
        return 'status-active';
    }
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
