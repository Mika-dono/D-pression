package KJX.KJX.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts", indexes = {
    @Index(name = "idx_posts_date", columnList = "date"),
    @Index(name = "idx_posts_published", columnList = "is_published"),
    @Index(name = "idx_posts_category", columnList = "category")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String excerpt;
    
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;
    
    @Column(length = 100)
    private String category; // "announcement", "results", "interview", "boutique"
    
    @Column(length = 255)
    private String author;
    
    @Column(nullable = false)
    private LocalDateTime date;
    
    @Column(name = "is_published")
    @Builder.Default
    private Boolean isPublished = false;
    
    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;
    
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
