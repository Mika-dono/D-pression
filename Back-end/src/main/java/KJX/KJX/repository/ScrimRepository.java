package KJX.KJX.repository;

import KJX.KJX.entity.Scrim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScrimRepository extends JpaRepository<Scrim, Long> {
    List<Scrim> findByStatus(String status);
    List<Scrim> findByTeamId(Long teamId);
}
