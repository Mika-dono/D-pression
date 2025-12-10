package KJX.KJX.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches", indexes = {
    @Index(name = "idx_matches_date", columnList = "date"),
    @Index(name = "idx_matches_tournament", columnList = "tournament")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 255)
    private String tournament;
    
    @Column(nullable = false, length = 50)
    @Builder.Default
    private String format = "Bo1"; // "Bo1", "Bo3", "Bo5"
    
    @Column(nullable = false, length = 255)
    private String team1;
    
    @Column(nullable = false, length = 255)
    private String team2;
    
    @Column(nullable = false)
    private LocalDateTime date;
    
    @Column(length = 10)
    private String time;
    
    @Column
    @Builder.Default
    private Boolean hidden = false;
    
    @Column(length = 50)
    @Builder.Default
    private String status = "SCHEDULED"; // "SCHEDULED", "LIVE", "COMPLETED"
    
    @Column(length = 20)
    private String score; // "2-1", etc.
    
    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
