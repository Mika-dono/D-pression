package KJX.KJX.repository;

import KJX.KJX.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    List<Schedule> findByTeamId(Long teamId);
    
    Optional<Schedule> findByDayOfWeek(String dayOfWeek);
    
    List<Schedule> findByDayOfWeekIn(List<String> days);
    
    List<Schedule> findAllByOrderByIdAsc();
}
