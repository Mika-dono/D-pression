import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var paypal: any;
declare var Stripe: any;

export interface PaymentRequest {
  email: string;
  userName?: string;
  amount: number;
  currency?: string;
  productType: string;
  productName: string;
  productId?: number;
}

export interface CardPaymentRequest extends PaymentRequest {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
  billingAddress?: string;
  billingCity?: string;
  billingPostalCode?: string;
  billingCountry?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  status?: string;
  message?: string;
  error?: string;
  payment?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8081/api/payments';
  
  // Stripe test publishable key (use your own in production)
  private stripePublicKey = 'pk_test_TYooMQauvdEDq54NiTphI7jx';
  
  // PayPal sandbox client ID (use your own in production)
  private paypalClientId = 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R';

  constructor(private http: HttpClient) { }

  // =============== CARD PAYMENT (FAKE/TEST) ===============
  
  processCardPayment(paymentData: CardPaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/card`, paymentData);
  }

  // =============== PAYPAL ===============
  
  createPayPalPayment(paymentData: PaymentRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/paypal/create`, paymentData);
  }
  
  confirmPayPalPayment(transactionId: string, paypalOrderId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/paypal/confirm`, { transactionId, paypalOrderId });
  }
  
  initPayPalButton(containerId: string, amount: number, paymentData: PaymentRequest, 
                   onSuccess: (data: any) => void, onError: (err: any) => void): void {
    // Load PayPal SDK if not loaded
    if (typeof paypal === 'undefined') {
      this.loadPayPalSdk().then(() => {
        this.renderPayPalButton(containerId, amount, paymentData, onSuccess, onError);
      }).catch(onError);
    } else {
      this.renderPayPalButton(containerId, amount, paymentData, onSuccess, onError);
    }
  }
  
  private loadPayPalSdk(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="paypal.com/sdk"]')) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.paypalClientId}&currency=EUR`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
      document.body.appendChild(script);
    });
  }
  
  private renderPayPalButton(containerId: string, amount: number, paymentData: PaymentRequest,
                              onSuccess: (data: any) => void, onError: (err: any) => void): void {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '';
    
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            description: paymentData.productName,
            amount: {
              currency_code: 'EUR',
              value: amount.toFixed(2)
            }
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        const order = await actions.order.capture();
        // Create payment in our backend
        this.createPayPalPayment(paymentData).subscribe({
          next: (response) => {
            this.confirmPayPalPayment(response.transactionId, order.id).subscribe({
              next: onSuccess,
              error: onError
            });
          },
          error: onError
        });
      },
      onError: onError
    }).render(`#${containerId}`);
  }

  // =============== STRIPE ===============
  
  createStripePayment(paymentData: PaymentRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/stripe/create`, paymentData);
  }
  
  confirmStripePayment(transactionId: string, paymentIntentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/stripe/confirm`, { transactionId, paymentIntentId });
  }
  
  initStripeElements(containerId: string): Promise<any> {
    return this.loadStripeSdk().then(() => {
      const stripe = Stripe(this.stripePublicKey);
      const elements = stripe.elements();
      const cardElement = elements.create('card', {
        style: {
          base: {
            color: '#ffffff',
            fontFamily: '"Inter", sans-serif',
            fontSize: '16px',
            '::placeholder': { color: '#6b7280' }
          },
          invalid: { color: '#ef4444' }
        }
      });
      cardElement.mount(`#${containerId}`);
      return { stripe, cardElement };
    });
  }
  
  private loadStripeSdk(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof Stripe !== 'undefined') {
        resolve();
        return;
      }
      if (document.querySelector('script[src*="stripe.com"]')) {
        const checkStripe = setInterval(() => {
          if (typeof Stripe !== 'undefined') {
            clearInterval(checkStripe);
            resolve();
          }
        }, 100);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Stripe SDK'));
      document.body.appendChild(script);
    });
  }

  // =============== WISE ===============
  
  createWiseTransfer(paymentData: PaymentRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/wise/create`, paymentData);
  }
  
  confirmWiseTransfer(transactionId: string, transferId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/wise/confirm`, { transactionId, transferId });
  }

  // =============== HELPERS ===============
  
  getPaymentsByUser(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${email}`);
  }
  
  getPaymentByTransactionId(transactionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/transaction/${transactionId}`);
  }
  
  getPaymentStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  // =============== CARD VALIDATION (Client-side) ===============
  
  validateCardNumber(cardNumber: string): { valid: boolean; brand: string } {
    const cleanNumber = cardNumber.replace(/[\s-]/g, '');
    
    if (!/^\d{13,19}$/.test(cleanNumber)) {
      return { valid: false, brand: 'unknown' };
    }
    
    // Luhn check
    let sum = 0;
    let alternate = false;
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let n = parseInt(cleanNumber[i], 10);
      if (alternate) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alternate = !alternate;
    }
    
    const valid = sum % 10 === 0;
    const brand = this.detectCardBrand(cleanNumber);
    
    return { valid, brand };
  }
  
  detectCardBrand(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/[\s-]/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
    return 'unknown';
  }
  
  validateExpiryDate(expiry: string): boolean {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return false;
    
    const [month, year] = expiry.split('/').map(Number);
    const fullYear = 2000 + year;
    const expiryDate = new Date(fullYear, month, 0);
    
    return expiryDate > new Date();
  }
  
  validateCvv(cvv: string, brand: string): boolean {
    if (brand === 'amex') {
      return /^\d{4}$/.test(cvv);
    }
    return /^\d{3}$/.test(cvv);
  }
  
  formatCardNumber(value: string): string {
    const cleanValue = value.replace(/\D/g, '');
    const groups = cleanValue.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleanValue;
  }
  
  formatExpiryDate(value: string): string {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 2) {
      return cleanValue.slice(0, 2) + '/' + cleanValue.slice(2, 4);
    }
    return cleanValue;
  }
}
