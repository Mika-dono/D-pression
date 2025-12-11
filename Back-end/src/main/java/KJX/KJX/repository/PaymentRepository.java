package KJX.KJX.repository;

import KJX.KJX.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByTransactionId(String transactionId);
    
    List<Payment> findByUserEmail(String userEmail);
    
    List<Payment> findByStatus(String status);
    
    List<Payment> findByPaymentMethod(String paymentMethod);
    
    List<Payment> findByProductType(String productType);
    
    @Query("SELECT p FROM Payment p WHERE p.userEmail = :email ORDER BY p.createdAt DESC")
    List<Payment> findByUserEmailOrderByCreatedAtDesc(@Param("email") String email);
    
    @Query("SELECT p FROM Payment p WHERE p.status = 'COMPLETED' ORDER BY p.createdAt DESC")
    List<Payment> findCompletedPayments();
    
    @Query("SELECT p FROM Payment p WHERE p.createdAt BETWEEN :startDate AND :endDate")
    List<Payment> findPaymentsBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    Double getTotalRevenue();
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'COMPLETED' AND p.paymentMethod = :method")
    Long countByPaymentMethod(@Param("method") String method);
}
