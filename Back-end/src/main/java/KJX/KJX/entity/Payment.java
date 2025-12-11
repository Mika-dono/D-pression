package KJX.KJX.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payments_status", columnList = "status"),
    @Index(name = "idx_payments_method", columnList = "payment_method"),
    @Index(name = "idx_payments_user_email", columnList = "user_email"),
    @Index(name = "idx_payments_transaction_id", columnList = "transaction_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "transaction_id", unique = true, length = 100)
    private String transactionId;
    
    @Column(name = "user_email", nullable = false)
    private String userEmail;
    
    @Column(name = "user_name")
    private String userName;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(length = 3)
    @Builder.Default
    private String currency = "EUR";
    
    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod; // CARD, PAYPAL, STRIPE, WISE
    
    @Column(name = "product_type", length = 100)
    private String productType; // MEMBERSHIP, SHOP_ITEM
    
    @Column(name = "product_id")
    private Long productId;
    
    @Column(name = "product_name")
    private String productName;
    
    @Column(length = 50)
    @Builder.Default
    private String status = "PENDING"; // PENDING, COMPLETED, FAILED, REFUNDED
    
    // Card details (masked for security - only last 4 digits)
    @Column(name = "card_last_four", length = 4)
    private String cardLastFour;
    
    @Column(name = "card_brand", length = 50)
    private String cardBrand; // VISA, MASTERCARD, AMEX
    
    // External payment provider details
    @Column(name = "external_transaction_id", length = 255)
    private String externalTransactionId;
    
    @Column(name = "provider_response", columnDefinition = "NVARCHAR(MAX)")
    private String providerResponse;
    
    @Column(name = "error_message", columnDefinition = "NVARCHAR(MAX)")
    private String errorMessage;
    
    // Billing address
    @Column(name = "billing_address", columnDefinition = "NVARCHAR(MAX)")
    private String billingAddress;
    
    @Column(name = "billing_city", length = 100)
    private String billingCity;
    
    @Column(name = "billing_postal_code", length = 20)
    private String billingPostalCode;
    
    @Column(name = "billing_country", length = 100)
    private String billingCountry;
    
    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.transactionId == null) {
            this.transactionId = "TXN-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 10000);
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
