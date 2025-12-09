import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  cart: any[] = [];
  selectedFilter = 'all';
  categories = ['all', 'vetement', 'accessoire', 'electronique', 'edition-limitee'];
  showCart = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilter('all');
      },
      error: (err) => console.error('Erreur products:', err)
    });
  }

  applyFilter(category: string): void {
    this.selectedFilter = category;
    if (category === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.category === category);
    }
  }

  addToCart(product: any): void {
    const existing = this.cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.showNotification(`${product.name} ajouté au panier`);
  }

  removeFromCart(productId: string): void {
    this.cart = this.cart.filter(item => item.id !== productId);
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartCount(): number {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  showNotification(message: string): void {
    console.log('Notification:', message);
    // Implémenter un toast notification
  }
}