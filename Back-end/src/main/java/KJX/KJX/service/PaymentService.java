package KJX.KJX.service;

import KJX.KJX.entity.Payment;
import KJX.KJX.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
    
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }
    
    public Optional<Payment> getPaymentByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId);
    }
    
    public List<Payment> getPaymentsByUserEmail(String email) {
        return paymentRepository.findByUserEmailOrderByCreatedAtDesc(email);
    }
    
    public List<Payment> getCompletedPayments() {
        return paymentRepository.findCompletedPayments();
    }
    
    @Transactional
    public Payment createPayment(Payment payment) {
        log.info("Creating payment for user: {}", payment.getUserEmail());
        return paymentRepository.save(payment);
    }
    
    @Transactional
    public Payment updatePaymentStatus(Long id, String status) {
        Payment payment = paymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment not found: " + id));
        payment.setStatus(status);
        if ("COMPLETED".equals(status)) {
            payment.setCompletedAt(LocalDateTime.now());
        }
        return paymentRepository.save(payment);
    }
    
    /**
     * Simulate credit card payment (test/fictitious API)
     * Validates card details and simulates a payment process
     */
    @Transactional
    public Payment processCardPayment(Map<String, Object> paymentData) {
        log.info("Processing card payment...");
        
        // Extract card details
        String cardNumber = (String) paymentData.get("cardNumber");
        String expiryDate = (String) paymentData.get("expiryDate");
        String cvv = (String) paymentData.get("cvv");
        String cardHolder = (String) paymentData.get("cardHolder");
        
        // Validate card
        if (!validateCard(cardNumber, expiryDate, cvv)) {
            throw new RuntimeException("Invalid card details");
        }
        
        // Create payment record
        Payment payment = Payment.builder()
            .userEmail((String) paymentData.get("email"))
            .userName(cardHolder)
            .amount(new BigDecimal(paymentData.get("amount").toString()))
            .currency((String) paymentData.getOrDefault("currency", "EUR"))
            .paymentMethod("CARD")
            .productType((String) paymentData.get("productType"))
            .productName((String) paymentData.get("productName"))
            .cardLastFour(cardNumber.substring(cardNumber.length() - 4))
            .cardBrand(detectCardBrand(cardNumber))
            .billingAddress((String) paymentData.get("billingAddress"))
            .billingCity((String) paymentData.get("billingCity"))
            .billingPostalCode((String) paymentData.get("billingPostalCode"))
            .billingCountry((String) paymentData.get("billingCountry"))
            .status("PENDING")
            .build();
        
        payment = paymentRepository.save(payment);
        
        // Simulate payment processing (fake API)
        boolean paymentSuccess = simulateCardPayment(cardNumber);
        
        if (paymentSuccess) {
            payment.setStatus("COMPLETED");
            payment.setCompletedAt(LocalDateTime.now());
            payment.setExternalTransactionId("FAKE-" + System.currentTimeMillis());
            payment.setProviderResponse("{\"success\": true, \"message\": \"Payment processed successfully\"}");
            log.info("Card payment COMPLETED: {}", payment.getTransactionId());
        } else {
            payment.setStatus("FAILED");
            payment.setErrorMessage("Payment declined - insufficient funds or invalid card");
            log.warn("Card payment FAILED: {}", payment.getTransactionId());
        }
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Create payment for external providers (PayPal, Stripe, Wise)
     */
    @Transactional
    public Payment createExternalPayment(Map<String, Object> paymentData) {
        String method = (String) paymentData.get("paymentMethod");
        log.info("Creating {} payment...", method);
        
        Payment payment = Payment.builder()
            .userEmail((String) paymentData.get("email"))
            .userName((String) paymentData.get("userName"))
            .amount(new BigDecimal(paymentData.get("amount").toString()))
            .currency((String) paymentData.getOrDefault("currency", "EUR"))
            .paymentMethod(method.toUpperCase())
            .productType((String) paymentData.get("productType"))
            .productName((String) paymentData.get("productName"))
            .status("PENDING")
            .build();
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Confirm external payment (called after callback from PayPal/Stripe/Wise)
     */
    @Transactional
    public Payment confirmExternalPayment(String transactionId, String externalId, boolean success) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
            .orElseThrow(() -> new RuntimeException("Payment not found: " + transactionId));
        
        payment.setExternalTransactionId(externalId);
        
        if (success) {
            payment.setStatus("COMPLETED");
            payment.setCompletedAt(LocalDateTime.now());
            log.info("External payment COMPLETED: {}", transactionId);
        } else {
            payment.setStatus("FAILED");
            payment.setErrorMessage("External payment failed");
            log.warn("External payment FAILED: {}", transactionId);
        }
        
        return paymentRepository.save(payment);
    }
    
    // =============== VALIDATION HELPERS ===============
    
    private boolean validateCard(String cardNumber, String expiryDate, String cvv) {
        // Remove spaces and dashes
        cardNumber = cardNumber.replaceAll("[\\s-]", "");
        
        // Check card number length (13-19 digits)
        if (cardNumber.length() < 13 || cardNumber.length() > 19) {
            return false;
        }
        
        // Check if all digits
        if (!cardNumber.matches("\\d+")) {
            return false;
        }
        
        // Luhn algorithm check
        if (!luhnCheck(cardNumber)) {
            return false;
        }
        
        // Validate expiry (MM/YY format)
        if (!expiryDate.matches("(0[1-9]|1[0-2])/\\d{2}")) {
            return false;
        }
        
        // Check if not expired
        String[] parts = expiryDate.split("/");
        int month = Integer.parseInt(parts[0]);
        int year = 2000 + Integer.parseInt(parts[1]);
        LocalDateTime expiry = LocalDateTime.of(year, month, 1, 0, 0).plusMonths(1).minusDays(1);
        if (expiry.isBefore(LocalDateTime.now())) {
            return false;
        }
        
        // Validate CVV (3-4 digits)
        if (!cvv.matches("\\d{3,4}")) {
            return false;
        }
        
        return true;
    }
    
    private boolean luhnCheck(String cardNumber) {
        int sum = 0;
        boolean alternate = false;
        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int n = Integer.parseInt(cardNumber.substring(i, i + 1));
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            sum += n;
            alternate = !alternate;
        }
        return (sum % 10 == 0);
    }
    
    private String detectCardBrand(String cardNumber) {
        cardNumber = cardNumber.replaceAll("[\\s-]", "");
        if (cardNumber.startsWith("4")) return "VISA";
        if (cardNumber.matches("^5[1-5].*")) return "MASTERCARD";
        if (cardNumber.matches("^3[47].*")) return "AMEX";
        if (cardNumber.matches("^6(?:011|5).*")) return "DISCOVER";
        return "UNKNOWN";
    }
    
    private boolean simulateCardPayment(String cardNumber) {
        // Simulate: Cards ending with 0000 fail, others succeed
        // This allows testing both success and failure scenarios
        if (cardNumber.endsWith("0000")) {
            return false;
        }
        // 95% success rate for random simulation
        return Math.random() > 0.05;
    }
    
    // =============== STATISTICS ===============
    
    public Double getTotalRevenue() {
        Double revenue = paymentRepository.getTotalRevenue();
        return revenue != null ? revenue : 0.0;
    }
    
    public Long getPaymentCountByMethod(String method) {
        return paymentRepository.countByPaymentMethod(method);
    }
}
