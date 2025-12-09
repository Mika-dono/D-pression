package KJX.KJX.repository;

import KJX.KJX.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByCategory(String category);
    List<Post> findByIsPublishedTrue();
}
