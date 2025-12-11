package KJX.KJX.controller;

import KJX.KJX.entity.Payment;
import KJX.KJX.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class PaymentController {
    
    private final PaymentService paymentService;
    
    // =============== GET ENDPOINTS ===============
    
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Payment> getPaymentByTransactionId(@PathVariable String transactionId) {
        return paymentService.getPaymentByTransactionId(transactionId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Payment>> getPaymentsByUser(@PathVariable String email) {
        return ResponseEntity.ok(paymentService.getPaymentsByUserEmail(email));
    }
    
    @GetMapping("/completed")
    public ResponseEntity<List<Payment>> getCompletedPayments() {
        return ResponseEntity.ok(paymentService.getCompletedPayments());
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPaymentStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", paymentService.getTotalRevenue());
        stats.put("cardPayments", paymentService.getPaymentCountByMethod("CARD"));
        stats.put("paypalPayments", paymentService.getPaymentCountByMethod("PAYPAL"));
        stats.put("stripePayments", paymentService.getPaymentCountByMethod("STRIPE"));
        stats.put("wisePayments", paymentService.getPaymentCountByMethod("WISE"));
        return ResponseEntity.ok(stats);
    }
    
    // =============== CARD PAYMENT (FAKE API) ===============
    
    /**
     * Process credit card payment - FAKE/TEST API
     * Validates card details and simulates payment processing
     */
    @PostMapping("/card")
    public ResponseEntity<?> processCardPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            log.info("Processing card payment request");
            Payment payment = paymentService.processCardPayment(paymentData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", "COMPLETED".equals(payment.getStatus()));
            response.put("transactionId", payment.getTransactionId());
            response.put("status", payment.getStatus());
            response.put("message", "COMPLETED".equals(payment.getStatus()) 
                ? "Payment processed successfully" 
                : payment.getErrorMessage());
            response.put("payment", payment);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Card payment error: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // =============== EXTERNAL PAYMENTS ===============
    
    /**
     * Create payment intent for PayPal
     */
    @PostMapping("/paypal/create")
    public ResponseEntity<?> createPayPalPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            paymentData.put("paymentMethod", "PAYPAL");
            Payment payment = paymentService.createExternalPayment(paymentData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("transactionId", payment.getTransactionId());
            response.put("paymentId", payment.getId());
            // In real implementation, this would return PayPal approval URL
            response.put("approvalUrl", "https://www.sandbox.paypal.com/checkoutnow?token=" + payment.getTransactionId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("PayPal create error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Confirm PayPal payment after user approval
     */
    @PostMapping("/paypal/confirm")
    public ResponseEntity<?> confirmPayPalPayment(@RequestBody Map<String, Object> confirmData) {
        try {
            String transactionId = (String) confirmData.get("transactionId");
            String paypalOrderId = (String) confirmData.get("paypalOrderId");
            
            Payment payment = paymentService.confirmExternalPayment(transactionId, paypalOrderId, true);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "transactionId", payment.getTransactionId(),
                "status", payment.getStatus(),
                "message", "PayPal payment confirmed successfully"
            ));
        } catch (Exception e) {
            log.error("PayPal confirm error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Create Stripe payment intent
     */
    @PostMapping("/stripe/create")
    public ResponseEntity<?> createStripePayment(@RequestBody Map<String, Object> paymentData) {
        try {
            paymentData.put("paymentMethod", "STRIPE");
            Payment payment = paymentService.createExternalPayment(paymentData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("transactionId", payment.getTransactionId());
            response.put("paymentId", payment.getId());
            // In real implementation, this would return Stripe client secret
            response.put("clientSecret", "pi_test_" + payment.getTransactionId() + "_secret_xxx");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Stripe create error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Confirm Stripe payment
     */
    @PostMapping("/stripe/confirm")
    public ResponseEntity<?> confirmStripePayment(@RequestBody Map<String, Object> confirmData) {
        try {
            String transactionId = (String) confirmData.get("transactionId");
            String stripePaymentIntentId = (String) confirmData.get("paymentIntentId");
            
            Payment payment = paymentService.confirmExternalPayment(transactionId, stripePaymentIntentId, true);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "transactionId", payment.getTransactionId(),
                "status", payment.getStatus(),
                "message", "Stripe payment confirmed successfully"
            ));
        } catch (Exception e) {
            log.error("Stripe confirm error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Create Wise transfer
     */
    @PostMapping("/wise/create")
    public ResponseEntity<?> createWiseTransfer(@RequestBody Map<String, Object> paymentData) {
        try {
            paymentData.put("paymentMethod", "WISE");
            Payment payment = paymentService.createExternalPayment(paymentData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("transactionId", payment.getTransactionId());
            response.put("paymentId", payment.getId());
            // In real implementation, this would return Wise transfer details
            response.put("transferUrl", "https://wise.com/pay/" + payment.getTransactionId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Wise create error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Confirm Wise transfer
     */
    @PostMapping("/wise/confirm")
    public ResponseEntity<?> confirmWiseTransfer(@RequestBody Map<String, Object> confirmData) {
        try {
            String transactionId = (String) confirmData.get("transactionId");
            String wiseTransferId = (String) confirmData.get("transferId");
            
            Payment payment = paymentService.confirmExternalPayment(transactionId, wiseTransferId, true);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "transactionId", payment.getTransactionId(),
                "status", payment.getStatus(),
                "message", "Wise transfer confirmed successfully"
            ));
        } catch (Exception e) {
            log.error("Wise confirm error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // =============== UPDATE STATUS ===============
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestBody Map<String, String> statusData) {
        try {
            String newStatus = statusData.get("status");
            Payment payment = paymentService.updatePaymentStatus(id, newStatus);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
