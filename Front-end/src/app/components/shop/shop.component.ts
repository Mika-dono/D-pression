import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import gsap from 'gsap';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  image?: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  sizes?: string[];
  colors?: string[];
  featured?: boolean;
}

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, AfterViewInit {
  @ViewChild('productsGrid') productsGrid!: ElementRef;

  products: Product[] = [];
  filteredProducts: Product[] = [];
  featuredProducts: Product[] = [];
  cart: CartItem[] = [];
  selectedFilter = 'all';
  showCart = false;
  showQuickView = false;
  quickViewProduct: Product | null = null;
  searchQuery = '';
  sortBy = 'featured';
  showNotificationToast = false;
  notificationMessage = '';

  categories = [
    { id: 'all', name: 'Tout', icon: '🎯' },
    { id: 'vetement', name: 'Vêtements', icon: '👕' },
    { id: 'accessoire', name: 'Accessoires', icon: '🎧' },
    { id: 'electronique', name: 'Électronique', icon: '🖥️' },
    { id: 'edition-limitee', name: 'Édition Limitée', icon: '⭐' }
  ];

  // Default products for demo
  defaultProducts: Product[] = [
    {
      id: '1',
      name: 'Maillot Pro Player 2024',
      description: 'Maillot officiel porté par nos joueurs professionnels',
      price: 89.99,
      originalPrice: 109.99,
      category: 'vetement',
      stock: 25,
      badge: 'NOUVEAU',
      rating: 4.9,
      reviews: 156,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Noir', 'Rouge'],
      featured: true
    },
    {
      id: '2',
      name: 'Hoodie Premium D-PRESSION',
      description: 'Hoodie premium avec broderie signature',
      price: 79.99,
      category: 'vetement',
      stock: 42,
      rating: 4.8,
      reviews: 89,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Noir', 'Gris'],
      featured: true
    },
    {
      id: '3',
      name: 'Casque Gaming Pro',
      description: 'Casque 7.1 surround utilisé par nos pros',
      price: 199.99,
      originalPrice: 249.99,
      category: 'electronique',
      stock: 15,
      badge: '-20%',
      rating: 4.7,
      reviews: 234,
      featured: true
    },
    {
      id: '4',
      name: 'Souris Gaming Elite',
      description: '25000 DPI, switches optiques, RGB',
      price: 149.99,
      category: 'electronique',
      stock: 30,
      rating: 4.9,
      reviews: 312
    },
    {
      id: '5',
      name: 'Tapis de souris XXL',
      description: 'Surface optimisée pour la performance',
      price: 39.99,
      category: 'accessoire',
      stock: 100,
      rating: 4.6,
      reviews: 178
    },
    {
      id: '6',
      name: 'Casquette Team Edition',
      description: 'Casquette brodée édition équipe',
      price: 34.99,
      category: 'accessoire',
      stock: 50,
      rating: 4.5,
      reviews: 67
    },
    {
      id: '7',
      name: 'Maillot Collector 2023',
      description: 'Édition limitée signée par les joueurs',
      price: 149.99,
      category: 'edition-limitee',
      stock: 10,
      badge: 'LIMITÉ',
      rating: 5.0,
      reviews: 45,
      sizes: ['M', 'L', 'XL']
    },
    {
      id: '8',
      name: 'Clavier Mécanique Pro',
      description: 'Switches Cherry MX, RGB per-key',
      price: 179.99,
      category: 'electronique',
      stock: 20,
      rating: 4.8,
      reviews: 198
    },
    {
      id: '9',
      name: 'Pack Goodies Champion',
      description: 'Stickers, porte-clés, bracelet',
      price: 24.99,
      category: 'accessoire',
      stock: 200,
      rating: 4.4,
      reviews: 89
    },
    {
      id: '10',
      name: 'Poster Équipe 2024',
      description: 'Poster collector format A1',
      price: 19.99,
      category: 'edition-limitee',
      stock: 50,
      badge: 'EXCLUSIF',
      rating: 4.7,
      reviews: 34
    },
    {
      id: '11',
      name: 'T-Shirt Fan',
      description: 'T-shirt 100% coton premium',
      price: 29.99,
      category: 'vetement',
      stock: 80,
      rating: 4.6,
      reviews: 145,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Noir', 'Blanc', 'Rouge']
    },
    {
      id: '12',
      name: 'Bundle Ultimate',
      description: 'Maillot + Hoodie + Casquette',
      price: 169.99,
      originalPrice: 204.97,
      category: 'edition-limitee',
      stock: 15,
      badge: '-17%',
      rating: 4.9,
      reviews: 28,
      featured: true
    }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
  }

  loadProducts(): void {
    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.products = data.length > 0 ? data : this.defaultProducts;
        this.featuredProducts = this.products.filter(p => p.featured);
        this.applyFilter('all');
      },
      error: () => {
        this.products = this.defaultProducts;
        this.featuredProducts = this.products.filter(p => p.featured);
        this.applyFilter('all');
      }
    });
  }

  initScrollAnimations(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  }

  applyFilter(category: string): void {
    this.selectedFilter = category;
    let filtered = category === 'all' 
      ? [...this.products] 
      : this.products.filter(p => p.category === category);

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    this.filteredProducts = this.sortProducts(filtered);
    this.animateProducts();
  }

  sortProducts(products: Product[]): Product[] {
    switch (this.sortBy) {
      case 'price-asc': return products.sort((a, b) => a.price - b.price);
      case 'price-desc': return products.sort((a, b) => b.price - a.price);
      case 'rating': return products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest': return products.sort((a, b) => b.id.localeCompare(a.id));
      default: return products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }

  onSortChange(): void {
    this.filteredProducts = this.sortProducts([...this.filteredProducts]);
  }

  onSearch(): void {
    this.applyFilter(this.selectedFilter);
  }

  animateProducts(): void {
    setTimeout(() => {
      gsap.fromTo('.product-card', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }, 100);
  }

  openQuickView(product: Product): void {
    this.quickViewProduct = product;
    this.showQuickView = true;
    document.body.style.overflow = 'hidden';
  }

  closeQuickView(): void {
    this.showQuickView = false;
    this.quickViewProduct = null;
    document.body.style.overflow = '';
  }

  addToCart(product: Product, quantity = 1): void {
    const existing = this.cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ ...product, quantity });
    }
    this.showToast(`${product.name} ajouté au panier`);
    this.animateCartBadge();
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

  clearCart(): void {
    this.cart = [];
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartCount(): number {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  getDiscountPercent(product: Product): number {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round((1 - product.price / product.originalPrice) * 100);
    }
    return 0;
  }

  renderStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? '★' : '☆');
    }
    return stars;
  }

  getCategoryIcon(categoryId: string): string {
    return this.categories.find(c => c.id === categoryId)?.icon || '📦';
  }

  showToast(message: string): void {
    this.notificationMessage = message;
    this.showNotificationToast = true;
    setTimeout(() => this.showNotificationToast = false, 3000);
  }

  animateCartBadge(): void {
    gsap.fromTo('.cart-badge', 
      { scale: 1.5 },
      { scale: 1, duration: 0.3, ease: 'back.out' }
    );
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
    if (this.showCart) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}