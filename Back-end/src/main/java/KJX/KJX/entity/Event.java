package KJX.KJX.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "events", indexes = {
    @Index(name = "idx_events_date", columnList = "date"),
    @Index(name = "idx_events_type", columnList = "event_type"),
    @Index(name = "idx_events_team_id", columnList = "team_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;
    
    @Column(name = "event_type", nullable = false, length = 100)
    private String type; // "match", "scrim", "fanmeet", "content"
    
    @Column(nullable = false)
    private LocalDateTime date;
    
    @Column(length = 10)
    private String time;
    
    @Column(length = 255)
    private String location;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;
    
    @Column(length = 255)
    private String opponent;
    
    @Column(length = 50)
    @Builder.Default
    private String status = "SCHEDULED"; // "SCHEDULED", "COMPLETED", "CANCELLED"
    
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
