import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PaymentService, CardPaymentRequest, PaymentRequest } from '../../services/payment.service';

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit, AfterViewInit {
  memberships: any[] = [];
  selectedPlan: string | null = null;
  
  // Payment Modal State
  showPaymentModal = false;
  selectedMembership: any = null;
  paymentStep: 'select' | 'card' | 'paypal' | 'stripe' | 'wise' | 'processing' | 'success' | 'error' = 'select';
  selectedPaymentMethod: string = '';
  
  // Card Form
  cardForm = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    email: '',
    billingAddress: '',
    billingCity: '',
    billingPostalCode: '',
    billingCountry: 'France'
  };
  cardBrand = 'unknown';
  cardErrors: { [key: string]: string } = {};
  
  // Payment Result
  paymentResult: any = null;
  paymentError: string = '';
  
  // Stripe Elements
  stripeElements: any = null;
  
  // Default plans if API returns empty
  defaultPlans = [
    {
      id: 'free',
      name: 'Fan',
      price: 0,
      period: 'Gratuit',
      description: 'Accès basique à la communauté',
      benefits: [
        'Accès au Discord public',
        'Newsletter mensuelle',
        'Wallpapers exclusifs',
        'Badge membre'
      ],
      popular: false,
      icon: '🎮'
    },
    {
      id: 'supporter',
      name: 'Supporter',
      price: 4.99,
      period: '/mois',
      description: 'Soutenez l\'équipe au quotidien',
      benefits: [
        'Tous les avantages Fan',
        'Discord privé supporters',
        'Émotes exclusives',
        'Vote dans les sondages',
        '-10% boutique'
      ],
      popular: false,
      icon: '⭐'
    },
    {
      id: 'elite',
      name: 'Élite',
      price: 9.99,
      period: '/mois',
      description: 'L\'expérience premium ultime',
      benefits: [
        'Tous les avantages Supporter',
        'Q&A mensuels avec les joueurs',
        'Contenus behind-the-scenes',
        'Badge animé Discord',
        '-20% boutique',
        'Accès early aux drops'
      ],
      popular: true,
      icon: '👑'
    },
    {
      id: 'legend',
      name: 'Légende',
      price: 24.99,
      period: '/mois',
      description: 'Le cercle des légendes Kyojin KJX',
      benefits: [
        'Tous les avantages Élite',
        'Meet & Greet annuel',
        'Merchandise exclusif',
        'Nom dans les crédits',
        '-30% boutique',
        'Support prioritaire',
        'Invitations events VIP'
      ],
      popular: false,
      icon: '🏆'
    }
  ];

  // Stats
  communityStats = {
    members: 50000,
    supporters: 12000,
    discordMembers: 35000,
    countries: 45
  };

  // Testimonials
  testimonials = [
    {
      name: 'Alex_Pro',
      plan: 'Élite',
      avatar: '👤',
      text: 'Le meilleur investissement pour un vrai fan. Les Q&A avec les joueurs sont incroyables!'
    },
    {
      name: 'ShadowGamer',
      plan: 'Légende',
      avatar: '👤',
      text: 'Le Meet & Greet a été une expérience inoubliable. La communauté est géniale.'
    },
    {
      name: 'NightOwl',
      plan: 'Supporter',
      avatar: '👤',
      text: 'Discord privé au top, émotes exclusives et réductions boutique. Je recommande!'
    }
  ];

  constructor(
    private apiService: ApiService, 
    private paymentService: PaymentService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadMemberships();
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
    this.animateCounters();
  }

  loadMemberships(): void {
    this.apiService.getMemberships().subscribe({
      next: (data) => {
        this.memberships = data.length > 0 ? data : this.defaultPlans;
      },
      error: (err) => {
        console.error('Erreur memberships:', err);
        this.memberships = this.defaultPlans;
      }
    });
  }

  selectPlan(planId: string): void {
    this.selectedPlan = planId;
  }

  subscribeTo(membership: any): void {
    console.log('Opening payment for:', membership.name);
    this.selectedMembership = membership;
    this.paymentStep = 'select';
    this.paymentError = '';
    this.paymentResult = null;
    this.resetCardForm();
    this.showPaymentModal = true;
  }
  
  // =============== PAYMENT MODAL METHODS ===============
  
  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedMembership = null;
    this.paymentStep = 'select';
    this.selectedPaymentMethod = '';
    this.resetCardForm();
  }
  
  resetCardForm(): void {
    this.cardForm = {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolder: '',
      email: '',
      billingAddress: '',
      billingCity: '',
      billingPostalCode: '',
      billingCountry: 'France'
    };
    this.cardErrors = {};
    this.cardBrand = 'unknown';
  }
  
  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
    this.paymentStep = method as any;
    
    if (method === 'paypal') {
      setTimeout(() => this.initPayPal(), 100);
    } else if (method === 'stripe') {
      setTimeout(() => this.initStripe(), 100);
    }
  }
  
  backToMethodSelection(): void {
    this.paymentStep = 'select';
    this.selectedPaymentMethod = '';
    this.paymentError = '';
  }
  
  // =============== CARD PAYMENT ===============
  
  onCardNumberInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    this.cardForm.cardNumber = this.paymentService.formatCardNumber(value);
    
    const validation = this.paymentService.validateCardNumber(value);
    this.cardBrand = validation.brand;
    
    if (value.length >= 13) {
      this.cardErrors['cardNumber'] = validation.valid ? '' : 'Numéro de carte invalide';
    }
  }
  
  onExpiryInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.substring(0, 4);
    this.cardForm.expiryDate = this.paymentService.formatExpiryDate(value);
    
    if (value.length === 4) {
      const formatted = this.cardForm.expiryDate;
      this.cardErrors['expiryDate'] = this.paymentService.validateExpiryDate(formatted) ? '' : 'Date expirée ou invalide';
    }
  }
  
  onCvvInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    const maxLength = this.cardBrand === 'amex' ? 4 : 3;
    this.cardForm.cvv = value.substring(0, maxLength);
    
    if (value.length >= 3) {
      this.cardErrors['cvv'] = this.paymentService.validateCvv(this.cardForm.cvv, this.cardBrand) ? '' : 'CVV invalide';
    }
  }
  
  validateCardForm(): boolean {
    this.cardErrors = {};
    let valid = true;
    
    // Card number
    const cardValidation = this.paymentService.validateCardNumber(this.cardForm.cardNumber);
    if (!cardValidation.valid) {
      this.cardErrors['cardNumber'] = 'Numéro de carte invalide';
      valid = false;
    }
    
    // Expiry
    if (!this.paymentService.validateExpiryDate(this.cardForm.expiryDate)) {
      this.cardErrors['expiryDate'] = 'Date expirée ou invalide';
      valid = false;
    }
    
    // CVV
    if (!this.paymentService.validateCvv(this.cardForm.cvv, this.cardBrand)) {
      this.cardErrors['cvv'] = 'CVV invalide';
      valid = false;
    }
    
    // Card holder
    if (!this.cardForm.cardHolder.trim() || this.cardForm.cardHolder.length < 3) {
      this.cardErrors['cardHolder'] = 'Nom du titulaire requis';
      valid = false;
    }
    
    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.cardForm.email)) {
      this.cardErrors['email'] = 'Email invalide';
      valid = false;
    }
    
    return valid;
  }
  
  processCardPayment(): void {
    if (!this.validateCardForm()) return;
    
    this.paymentStep = 'processing';
    this.paymentError = '';
    
    const paymentData: CardPaymentRequest = {
      cardNumber: this.cardForm.cardNumber.replace(/\s/g, ''),
      expiryDate: this.cardForm.expiryDate,
      cvv: this.cardForm.cvv,
      cardHolder: this.cardForm.cardHolder,
      email: this.cardForm.email,
      amount: this.selectedMembership.price,
      currency: 'EUR',
      productType: 'MEMBERSHIP',
      productName: `Membership ${this.selectedMembership.name}`,
      productId: this.selectedMembership.id,
      billingAddress: this.cardForm.billingAddress,
      billingCity: this.cardForm.billingCity,
      billingPostalCode: this.cardForm.billingPostalCode,
      billingCountry: this.cardForm.billingCountry
    };
    
    this.paymentService.processCardPayment(paymentData).subscribe({
      next: (response) => {
        if (response.success) {
          this.paymentResult = response;
          this.paymentStep = 'success';
        } else {
          this.paymentError = response.message || 'Paiement refusé';
          this.paymentStep = 'error';
        }
      },
      error: (err) => {
        console.error('Payment error:', err);
        this.paymentError = err.error?.error || 'Erreur de connexion au serveur';
        this.paymentStep = 'error';
      }
    });
  }
  
  // =============== PAYPAL ===============
  
  initPayPal(): void {
    const paymentData: PaymentRequest = {
      email: '',
      amount: this.selectedMembership.price,
      productType: 'MEMBERSHIP',
      productName: `Membership ${this.selectedMembership.name}`
    };
    
    this.paymentService.initPayPalButton(
      'paypal-button-container',
      this.selectedMembership.price,
      paymentData,
      (result) => {
        this.paymentResult = result;
        this.paymentStep = 'success';
      },
      (error) => {
        console.error('PayPal error:', error);
        this.paymentError = 'Erreur PayPal: ' + (error.message || 'Paiement annulé');
        this.paymentStep = 'error';
      }
    );
  }
  
  // =============== STRIPE ===============
  
  initStripe(): void {
    this.paymentService.initStripeElements('stripe-card-element').then((elements) => {
      this.stripeElements = elements;
    }).catch((err) => {
      console.error('Stripe init error:', err);
      this.paymentError = 'Erreur chargement Stripe';
    });
  }
  
  processStripePayment(): void {
    if (!this.stripeElements || !this.cardForm.email) {
      this.cardErrors['email'] = 'Email requis';
      return;
    }
    
    this.paymentStep = 'processing';
    
    const paymentData: PaymentRequest = {
      email: this.cardForm.email,
      amount: this.selectedMembership.price,
      productType: 'MEMBERSHIP',
      productName: `Membership ${this.selectedMembership.name}`
    };
    
    this.paymentService.createStripePayment(paymentData).subscribe({
      next: async (response) => {
        const { stripe, cardElement } = this.stripeElements;
        
        const { error, paymentIntent } = await stripe.confirmCardPayment(response.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: { email: this.cardForm.email }
          }
        });
        
        if (error) {
          this.paymentError = error.message;
          this.paymentStep = 'error';
        } else {
          this.paymentService.confirmStripePayment(response.transactionId, paymentIntent.id).subscribe({
            next: (result) => {
              this.paymentResult = result;
              this.paymentStep = 'success';
            },
            error: () => {
              this.paymentResult = { transactionId: response.transactionId };
              this.paymentStep = 'success';
            }
          });
        }
      },
      error: (err) => {
        this.paymentError = err.error?.error || 'Erreur Stripe';
        this.paymentStep = 'error';
      }
    });
  }
  
  // =============== WISE ===============
  
  processWisePayment(): void {
    if (!this.cardForm.email) {
      this.cardErrors['email'] = 'Email requis';
      return;
    }
    
    this.paymentStep = 'processing';
    
    const paymentData: PaymentRequest = {
      email: this.cardForm.email,
      userName: this.cardForm.cardHolder,
      amount: this.selectedMembership.price,
      productType: 'MEMBERSHIP',
      productName: `Membership ${this.selectedMembership.name}`
    };
    
    this.paymentService.createWiseTransfer(paymentData).subscribe({
      next: (response) => {
        // In a real app, redirect to Wise
        // For demo, simulate success
        setTimeout(() => {
          this.paymentService.confirmWiseTransfer(response.transactionId, 'WISE-' + Date.now()).subscribe({
            next: (result) => {
              this.paymentResult = result;
              this.paymentStep = 'success';
            },
            error: () => {
              this.paymentResult = { transactionId: response.transactionId };
              this.paymentStep = 'success';
            }
          });
        }, 2000);
      },
      error: (err) => {
        this.paymentError = err.error?.error || 'Erreur Wise';
        this.paymentStep = 'error';
      }
    });
  }
  
  retryPayment(): void {
    this.paymentError = '';
    this.paymentStep = this.selectedPaymentMethod as any || 'select';
  }
  
  getCardBrandIcon(): string {
    switch (this.cardBrand) {
      case 'visa': return '💳 Visa';
      case 'mastercard': return '💳 Mastercard';
      case 'amex': return '💳 Amex';
      case 'discover': return '💳 Discover';
      default: return '💳';
    }
  }

  formatPrice(price: number): string {
    if (price === 0) return 'Gratuit';
    return price.toFixed(2) + '€';
  }

  private initScrollAnimations(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    this.elementRef.nativeElement.querySelectorAll('.animate-on-scroll').forEach((el: Element) => {
      observer.observe(el);
    });
  }

  private animateCounters(): void {
    // Animation des stats - simplified
  }
}