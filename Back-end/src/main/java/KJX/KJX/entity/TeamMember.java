package KJX.KJX.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "team_members", indexes = {
    @Index(name = "idx_team_members_team_id", columnList = "team_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamMember {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;
    
    @Column(nullable = false, length = 255)
    private String name;
    
    @Column(nullable = false, length = 100)
    private String position; // "Top", "Jungle", "Mid", "ADC", "Support"
    
    @Column(length = 100)
    private String role;
    
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String championPool;
    
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String stats; // JSON stats
    
    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
