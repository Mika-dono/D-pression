package KJX.KJX.service;

import KJX.KJX.entity.Match;
import KJX.KJX.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MatchService {
    
    @Autowired
    private MatchRepository matchRepository;
    
    public List<Match> getAllMatches() {
        return matchRepository.findAllByOrderByDateDesc();
    }
    
    public List<Match> getVisibleMatches() {
        return matchRepository.findByHiddenFalse();
    }
    
    public Optional<Match> getMatchById(Long id) {
        return matchRepository.findById(id);
    }
    
    public List<Match> getMatchesByTournament(String tournament) {
        return matchRepository.findByTournamentContainingIgnoreCase(tournament);
    }
    
    public List<Match> getUpcomingMatches() {
        return matchRepository.findUpcomingMatches(LocalDateTime.now());
    }
    
    public Match saveMatch(Match match) {
        return matchRepository.save(match);
    }
    
    public Match updateMatch(Long id, Match matchDetails) {
        Match match = matchRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Match not found with id: " + id));
        
        match.setTournament(matchDetails.getTournament());
        match.setFormat(matchDetails.getFormat());
        match.setTeam1(matchDetails.getTeam1());
        match.setTeam2(matchDetails.getTeam2());
        match.setDate(matchDetails.getDate());
        match.setTime(matchDetails.getTime());
        match.setHidden(matchDetails.getHidden());
        match.setStatus(matchDetails.getStatus());
        match.setScore(matchDetails.getScore());
        
        return matchRepository.save(match);
    }
    
    public Match toggleVisibility(Long id) {
        Match match = matchRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Match not found with id: " + id));
        match.setHidden(!match.getHidden());
        return matchRepository.save(match);
    }
    
    public void deleteMatch(Long id) {
        matchRepository.deleteById(id);
    }
}
