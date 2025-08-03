import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  avatar: string;
  phone: string;
  joinDate: string;
  lastLogin: string;
  orders: number;
  totalSpent: number;
}

interface Role {
  id: string;
  name: string;
  count: number;
}

interface EditFormData {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  phone: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users implements OnInit {
  // Signals
  users = signal<User[]>([]);
  filteredUsers = signal<User[]>([]);
  searchQuery = signal('');
  selectedRole = signal('');
  selectedStatus = signal('');
  showFilters = signal(false);
  showEditModal = signal(false);
  editingUser = signal<User | null>(null);

  // Computed
  totalUsers = computed(() => this.users().length);
  activeUsers = computed(
    () => this.users().filter((u) => u.status === 'active').length
  );
  totalRevenue = computed(() =>
    this.users().reduce((sum, u) => sum + u.totalSpent, 0)
  );

  // Form data for edit modal
  editForm = signal<EditFormData>({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
    phone: '',
  });

  roles: Role[] = [
    { id: 'admin', name: 'Admin', count: 0 },
    { id: 'user', name: 'User', count: 0 },
    { id: 'moderator', name: 'Moderator', count: 0 },
  ];

  statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
  ];

  ngOnInit() {
    this.loadUsers();
    this.updateRoleCounts();
  }

  loadUsers() {
    // Mock data
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        phone: '+1 234 567 890',
        joinDate: '2023-01-15',
        lastLogin: '2024-01-20',
        orders: 25,
        totalSpent: 1250.0,
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        status: 'active',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        phone: '+1 234 567 891',
        joinDate: '2023-03-20',
        lastLogin: '2024-01-19',
        orders: 18,
        totalSpent: 890.0,
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'moderator',
        status: 'inactive',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        phone: '+1 234 567 892',
        joinDate: '2023-02-10',
        lastLogin: '2024-01-15',
        orders: 12,
        totalSpent: 650.0,
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        role: 'user',
        status: 'suspended',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        phone: '+1 234 567 893',
        joinDate: '2023-04-05',
        lastLogin: '2024-01-10',
        orders: 8,
        totalSpent: 320.0,
      },
      {
        id: '5',
        name: 'David Brown',
        email: 'david@example.com',
        role: 'user',
        status: 'active',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        phone: '+1 234 567 894',
        joinDate: '2023-05-12',
        lastLogin: '2024-01-18',
        orders: 30,
        totalSpent: 2100.0,
      },
    ];

    this.users.set(mockUsers);
    this.filteredUsers.set(mockUsers);
  }

  updateRoleCounts() {
    this.roles.forEach((role) => {
      role.count = this.users().filter((u) => u.role === role.id).length;
    });
  }

  // Search and Filter
  onSearch() {
    this.applyFilters();
  }

  onRoleChange() {
    this.applyFilters();
  }

  onStatusChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.users();

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phone.includes(query)
      );
    }

    if (this.selectedRole()) {
      filtered = filtered.filter((user) => user.role === this.selectedRole());
    }

    if (this.selectedStatus()) {
      filtered = filtered.filter(
        (user) => user.status === this.selectedStatus()
      );
    }

    this.filteredUsers.set(filtered);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedRole.set('');
    this.selectedStatus.set('');
    this.filteredUsers.set(this.users());
  }

  // Modal functions
  openEditModal(user: User) {
    this.editingUser.set(user);
    this.editForm.set({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
    });
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingUser.set(null);
  }

  saveUser() {
    if (this.editingUser()) {
      const updatedUser: User = {
        ...this.editingUser()!,
        ...this.editForm(),
      };

      const users = this.users().map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );

      this.users.set(users);
      this.applyFilters();
      this.updateRoleCounts();
      this.closeEditModal();
    }
  }

  toggleFilters() {
    this.showFilters.update((current) => !current);
  }

  // Utility functions
  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}
