package KJX.KJX.repository;

import KJX.KJX.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByType(String type);
    List<Event> findByDateAfter(LocalDateTime date);
    List<Event> findByTeamId(Long teamId);
}
