import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { PaymentService } from '../../services/payment.service';
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

  // Payment Modal
  showPaymentModal = false;
  paymentStep: 'select' | 'card' | 'paypal' | 'stripe' | 'wise' | 'processing' | 'success' | 'error' = 'select';
  selectedPaymentMethod = '';
  transactionId = '';
  paymentError = '';

  // Card Form
  cardForm = {
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: ''
  };
  cardErrors = {
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };
  detectedCardBrand = '';

  // Wise Form
  wiseEmail = '';

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
      name: 'Hoodie Premium Kyojin KJX',
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

  constructor(private apiService: ApiService, private paymentService: PaymentService) {}

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

  // ============ PAYMENT METHODS ============
  openPaymentModal(): void {
    if (this.cart.length === 0) return;
    this.showPaymentModal = true;
    this.paymentStep = 'select';
    this.showCart = false;
    document.body.style.overflow = 'hidden';
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.paymentStep = 'select';
    this.resetCardForm();
    document.body.style.overflow = '';
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
    this.paymentStep = method as any;
  }

  goBackToMethods(): void {
    this.paymentStep = 'select';
    this.resetCardForm();
  }

  resetCardForm(): void {
    this.cardForm = { cardNumber: '', cardName: '', expiryDate: '', cvv: '', email: '' };
    this.cardErrors = { cardNumber: '', expiryDate: '', cvv: '' };
    this.detectedCardBrand = '';
    this.wiseEmail = '';
  }

  // Card Number Formatting
  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    const groups = value.match(/.{1,4}/g);
    this.cardForm.cardNumber = groups ? groups.join(' ') : value;
    this.detectedCardBrand = this.paymentService.detectCardBrand(value);
    this.cardErrors.cardNumber = '';
  }

  // Expiry Date Formatting
  onExpiryInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.cardForm.expiryDate = value;
    this.cardErrors.expiryDate = '';
  }

  // CVV Input
  onCvvInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const maxLength = this.detectedCardBrand === 'amex' ? 4 : 3;
    this.cardForm.cvv = input.value.replace(/\D/g, '').substring(0, maxLength);
    this.cardErrors.cvv = '';
  }

  // Validate Card Form
  validateCardForm(): boolean {
    let isValid = true;
    const cardNumber = this.cardForm.cardNumber.replace(/\s/g, '');

    const cardValidation = this.paymentService.validateCardNumber(cardNumber);
    if (!cardValidation.valid) {
      this.cardErrors.cardNumber = 'Numéro de carte invalide';
      isValid = false;
    }

    if (!this.paymentService.validateExpiryDate(this.cardForm.expiryDate)) {
      this.cardErrors.expiryDate = 'Date d\'expiration invalide';
      isValid = false;
    }

    const cvvLength = this.detectedCardBrand === 'amex' ? 4 : 3;
    if (this.cardForm.cvv.length !== cvvLength) {
      this.cardErrors.cvv = `CVV doit contenir ${cvvLength} chiffres`;
      isValid = false;
    }

    return isValid;
  }

  // Process Card Payment
  async processCardPayment(): Promise<void> {
    if (!this.validateCardForm()) return;

    this.paymentStep = 'processing';
    const total = this.getCartTotal() + (this.getCartTotal() >= 50 ? 0 : 4.99);
    const cartSummary = this.cart.map(item => `${item.name} x${item.quantity}`).join(', ');

    try {
      const result = await this.paymentService.processCardPayment({
        cardNumber: this.cardForm.cardNumber.replace(/\s/g, ''),
        cardHolder: this.cardForm.cardName,
        expiryDate: this.cardForm.expiryDate,
        cvv: this.cardForm.cvv,
        amount: total,
        email: this.cardForm.email,
        productType: 'SHOP',
        productName: cartSummary
      }).toPromise();

      if (result && result.status === 'COMPLETED') {
        this.transactionId = result.transactionId || '';
        this.paymentStep = 'success';
        this.clearCart();
      } else {
        this.paymentError = result?.message || 'Paiement refusé';
        this.paymentStep = 'error';
      }
    } catch (error: any) {
      this.paymentError = error.error?.message || 'Erreur de connexion';
      this.paymentStep = 'error';
    }
  }

  // Init PayPal
  initPayPal(): void {
    const total = this.getCartTotal() + (this.getCartTotal() >= 50 ? 0 : 4.99);
    const cartSummary = this.cart.map(item => `${item.name} x${item.quantity}`).join(', ');
    const paymentData = { email: '', amount: total, productType: 'SHOP', productName: cartSummary };

    setTimeout(() => {
      this.paymentService.initPayPalButton('paypal-button-container-shop', total, paymentData,
        (data: any) => {
          this.transactionId = data.transactionId || 'PAYPAL-' + Date.now();
          this.paymentStep = 'success';
          this.clearCart();
        },
        (error: any) => {
          this.paymentError = typeof error === 'string' ? error : 'Erreur PayPal';
          this.paymentStep = 'error';
        }
      );
    }, 500);
  }

  // Stripe Elements instance
  private stripeInstance: any = null;
  private cardElement: any = null;

  // Init Stripe
  initStripe(): void {
    setTimeout(async () => {
      try {
        const result = await this.paymentService.initStripeElements('stripe-card-element-shop');
        this.stripeInstance = result.stripe;
        this.cardElement = result.cardElement;
      } catch (error) {
        console.error('Stripe init error:', error);
      }
    }, 500);
  }

  // Process Stripe Payment
  async processStripePayment(): Promise<void> {
    if (!this.stripeInstance || !this.cardElement) {
      this.paymentError = 'Stripe non initialisé';
      this.paymentStep = 'error';
      return;
    }

    this.paymentStep = 'processing';
    const total = this.getCartTotal() + (this.getCartTotal() >= 50 ? 0 : 4.99);
    const cartSummary = this.cart.map(item => `${item.name} x${item.quantity}`).join(', ');
    const paymentData = { email: '', amount: total, productType: 'SHOP', productName: cartSummary };

    try {
      // Create payment intent on backend
      const intentResult = await this.paymentService.createStripePayment(paymentData).toPromise();
      
      if (intentResult && intentResult.transactionId) {
        // Simulate successful payment for demo
        this.transactionId = intentResult.transactionId;
        this.paymentStep = 'success';
        this.clearCart();
      } else {
        this.paymentError = 'Erreur création paiement Stripe';
        this.paymentStep = 'error';
      }
    } catch (error: any) {
      this.paymentError = error.error?.message || 'Erreur Stripe';
      this.paymentStep = 'error';
    }
  }

  // Process Wise Payment
  async processWisePayment(): Promise<void> {
    if (!this.wiseEmail) return;

    this.paymentStep = 'processing';
    const total = this.getCartTotal() + (this.getCartTotal() >= 50 ? 0 : 4.99);
    const cartSummary = this.cart.map(item => `${item.name} x${item.quantity}`).join(', ');
    const paymentData = { email: this.wiseEmail, amount: total, productType: 'SHOP', productName: cartSummary };

    try {
      const result = await this.paymentService.createWiseTransfer(paymentData).toPromise();
      if (result && result.transactionId) {
        this.transactionId = result.transactionId;
        this.paymentStep = 'success';
        this.clearCart();
      } else {
        this.paymentError = 'Erreur lors de la création du transfert';
        this.paymentStep = 'error';
      }
    } catch (error) {
      this.paymentError = 'Erreur de connexion Wise';
      this.paymentStep = 'error';
    }
  }

  retryPayment(): void {
    this.paymentStep = 'select';
    this.resetCardForm();
    this.paymentError = '';
  }
}