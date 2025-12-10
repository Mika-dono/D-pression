package KJX.KJX.repository;

import KJX.KJX.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    
    List<Match> findByTournamentContainingIgnoreCase(String tournament);
    
    List<Match> findByHiddenFalse();
    
    List<Match> findByStatus(String status);
    
    @Query("SELECT m FROM Match m WHERE m.date >= :now AND m.hidden = false ORDER BY m.date ASC")
    List<Match> findUpcomingMatches(LocalDateTime now);
    
    List<Match> findByTeam1ContainingIgnoreCaseOrTeam2ContainingIgnoreCase(String team1, String team2);
    
    List<Match> findAllByOrderByDateDesc();
}
