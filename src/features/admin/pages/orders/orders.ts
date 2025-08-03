import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  products: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderDate: string;
  deliveryDate?: string;
  shippingAddress: string;
  paymentMethod: string;
}

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css'],
})
export class Orders implements OnInit {
  // Signals
  orders = signal<Order[]>([]);
  searchQuery = signal('');
  statusFilter = signal('all');
  dateFilter = signal('all');
  showFilters = signal(false);
  selectedOrder = signal<Order | null>(null);
  showOrderModal = signal(false);

  // Computed properties
  filteredOrders = computed(() => {
    let filtered = this.orders();

    // Search filter
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.email.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (this.statusFilter() !== 'all') {
      filtered = filtered.filter(
        (order) => order.status === this.statusFilter()
      );
    }

    // Date filter
    if (this.dateFilter() !== 'all') {
      const now = new Date();

      switch (this.dateFilter()) {
        case 'today':
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.orderDate);
            return orderDate.toDateString() === now.toDateString();
          });
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.orderDate);
            return orderDate >= weekAgo;
          });
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.orderDate);
            return orderDate >= monthAgo;
          });
          break;
      }
    }

    return filtered;
  });

  orderStats = computed(() => {
    const orders = this.orders();
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  });

  totalRevenue = computed(() => {
    return this.orders()
      .filter((order) => order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);
  });

  constructor() {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    // Mock data
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'assets/images/profile-photo.png',
        },
        products: [
          {
            name: 'Ergonomic Chair',
            quantity: 1,
            price: 299.99,
            image: 'assets/images/all-img/chair.png',
          },
        ],
        total: 299.99,
        status: 'delivered',
        paymentStatus: 'paid',
        orderDate: '2024-01-15T10:30:00Z',
        deliveryDate: '2024-01-18T14:20:00Z',
        shippingAddress: '123 Main St, New York, NY 10001',
        paymentMethod: 'Credit Card',
      },
      {
        id: 'ORD-002',
        customer: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: 'assets/images/profile-photo.png',
        },
        products: [
          {
            name: 'Modern Table',
            quantity: 2,
            price: 199.99,
            image: 'assets/images/all-img/product1.png',
          },
          {
            name: 'Desk Lamp',
            quantity: 1,
            price: 89.99,
            image: 'assets/images/all-img/product2.png',
          },
        ],
        total: 489.97,
        status: 'processing',
        paymentStatus: 'paid',
        orderDate: '2024-01-16T09:15:00Z',
        shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
        paymentMethod: 'PayPal',
      },
      {
        id: 'ORD-003',
        customer: {
          name: 'Mike Johnson',
          email: 'mike@example.com',
          avatar: 'assets/images/profile-photo.png',
        },
        products: [
          {
            name: 'Sofa Set',
            quantity: 1,
            price: 899.99,
            image: 'assets/images/all-img/product3.png',
          },
        ],
        total: 899.99,
        status: 'pending',
        paymentStatus: 'pending',
        orderDate: '2024-01-17T16:45:00Z',
        shippingAddress: '789 Pine Rd, Chicago, IL 60601',
        paymentMethod: 'Credit Card',
      },
      {
        id: 'ORD-004',
        customer: {
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          avatar: 'assets/images/profile-photo.png',
        },
        products: [
          {
            name: 'Bookshelf',
            quantity: 1,
            price: 159.99,
            image: 'assets/images/all-img/product1.png',
          },
        ],
        total: 159.99,
        status: 'shipped',
        paymentStatus: 'paid',
        orderDate: '2024-01-18T11:20:00Z',
        shippingAddress: '321 Elm St, Miami, FL 33101',
        paymentMethod: 'Credit Card',
      },
      {
        id: 'ORD-005',
        customer: {
          name: 'David Brown',
          email: 'david@example.com',
          avatar: 'assets/images/profile-photo.png',
        },
        products: [
          {
            name: 'Dining Table',
            quantity: 1,
            price: 599.99,
            image: 'assets/images/all-img/product2.png',
          },
        ],
        total: 599.99,
        status: 'cancelled',
        paymentStatus: 'refunded',
        orderDate: '2024-01-19T13:10:00Z',
        shippingAddress: '654 Maple Dr, Seattle, WA 98101',
        paymentMethod: 'Credit Card',
      },
    ];

    this.orders.set(mockOrders);
  }

  // Methods
  toggleFilters() {
    this.showFilters.update((current) => !current);
  }

  viewOrder(order: Order) {
    this.selectedOrder.set(order);
    this.showOrderModal.set(true);
  }

  updateOrderStatus(orderId: string, status: Order['status']) {
    const orders = this.orders();
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    this.orders.set(updatedOrders);
  }

  closeOrderModal() {
    this.showOrderModal.set(false);
    this.selectedOrder.set(null);
  }

  getStatusColor(status: Order['status']) {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  }

  getPaymentStatusColor(status: Order['paymentStatus']) {
    switch (status) {
      case 'paid':
        return 'payment-paid';
      case 'pending':
        return 'payment-pending';
      case 'failed':
        return 'payment-failed';
      case 'refunded':
        return 'payment-refunded';
      default:
        return 'payment-pending';
    }
  }

  formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}
