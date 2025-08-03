import {
  Component,
  OnInit,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

interface StatsCard {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
  iconColor: string;
  description?: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  email: string;
  avatar: string;
  product: string;
  category: string;
  amount: string;
  status: 'completed' | 'pending' | 'cancelled' | 'processing';
  date: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit, AfterViewInit {
  @ViewChild('salesChart', { static: false })
  salesChartRef!: ElementRef<HTMLCanvasElement>;

  private salesChart: Chart | null = null;

  statsCards = signal<StatsCard[]>([
    {
      id: 'users',
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      iconColor: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive',
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      iconColor: 'bg-green-100 text-green-600',
    },
    {
      id: 'target',
      title: 'Monthly Target',
      value: '$45,678',
      change: '+15.3%',
      changeType: 'positive',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      iconColor: 'bg-purple-100 text-purple-600',
      description: 'Target: $60,000',
    },
  ]);

  recentOrders = signal<RecentOrder[]>([
    {
      id: 'ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      avatar: 'assets/images/profile-photo.png',
      product: 'Ergonomic Chair',
      category: 'Furniture',
      amount: '299.99',
      status: 'completed',
      date: '2024-01-15',
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'assets/images/profile-photo.png',
      product: 'Wireless Headphones',
      category: 'Electronics',
      amount: '149.99',
      status: 'pending',
      date: '2024-01-14',
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      avatar: 'assets/images/profile-photo.png',
      product: 'Smart Watch',
      category: 'Electronics',
      amount: '399.99',
      status: 'processing',
      date: '2024-01-13',
    },
    {
      id: 'ORD-004',
      customer: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: 'assets/images/profile-photo.png',
      product: 'Coffee Maker',
      category: 'Home & Kitchen',
      amount: '89.99',
      status: 'cancelled',
      date: '2024-01-12',
    },
    {
      id: 'ORD-005',
      customer: 'David Brown',
      email: 'david@example.com',
      avatar: 'assets/images/profile-photo.png',
      product: 'Gaming Laptop',
      category: 'Electronics',
      amount: '1,299.99',
      status: 'completed',
      date: '2024-01-11',
    },
  ]);

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initSalesChart();
  }

  private initSalesChart(): void {
    const ctx = this.salesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#e2e8f0',
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 12,
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 12,
              },
            },
          },
        },
        elements: {
          point: {
            hoverBackgroundColor: '#667eea',
          },
        },
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  }
}
