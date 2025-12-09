package KJX.KJX.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedules", indexes = {
    @Index(name = "idx_schedules_team_id", columnList = "team_id"),
    @Index(name = "idx_schedules_day", columnList = "day_of_week")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;
    
    @Column(name = "day_of_week", nullable = false, length = 10)
    private String dayOfWeek; // "LUNDI", "MARDI", etc.
    
    @Column(name = "start_time", length = 10)
    private String startTime; // "10:00"
    
    @Column(name = "end_time", length = 10)
    private String endTime; // "13:00"
    
    @Column(length = 255)
    private String activity; // "Entraînement", "Scrim", "Repos", etc.
    
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String notes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
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
