import { HttpClient } from '@angular/common/http';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_URL } from 'types/const';
import { IProduct } from 'types/interface/models';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './ui/product-detail.html',
  styleUrl: './ui/product-detail.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductDetail {
  @Input() product = signal<IProduct | undefined>(undefined);
  readonly slug: string;
  private route = inject(ActivatedRoute);

  constructor(private httpClient: HttpClient) {
    this.slug = this.route.snapshot.paramMap.get('slug') as string;
    console.log(this.slug);
  }

  ngOnInit() {
    this.httpClient.get(`${API_URL}/product/${this.slug}`).subscribe({
      next: (data: any) => {
        this.product.set(data.data);
      },
      error: (error: any) => {
        console.error('HTTP Error: ', error);
      },
    });
  }
  moneyFormat = (price: number) => {
    return `${new Intl.NumberFormat('vi-VN').format(price)}đ`;
  };

  calculateOriginalPrice(price?: number, discountPercent?: number) {
    if (!price || !discountPercent) return price || 0;
    const originalPrice = price / (1 - discountPercent / 100);
    return Math.round(originalPrice * 100) / 100; // Làm tròn 2 chữ số thập phân
  }
}
