package KJX.KJX.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "teams", indexes = {
    @Index(name = "idx_teams_game", columnList = "game"),
    @Index(name = "idx_teams_name", columnList = "name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 255)
    private String name;
    
    @Column(nullable = false, length = 100)
    private String game; // "lol", "valorant", "academy"
    
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;
    
    @Column(length = 500)
    private String logoUrl;
    
    @Column(name = "win_rate")
    @Builder.Default
    private Double winRate = 0.0;
    
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TeamMember> members;
    
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Event> events;
    
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Scrim> scrims;
    
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Schedule> schedules;
    
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
