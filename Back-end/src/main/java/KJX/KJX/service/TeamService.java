package KJX.KJX.service;

import KJX.KJX.entity.Team;
import KJX.KJX.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TeamService {
    
    @Autowired
    private TeamRepository teamRepository;
    
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }
    
    public Optional<Team> getTeamById(Long id) {
        return teamRepository.findById(id);
    }
    
    public List<Team> getTeamsByGame(String game) {
        return teamRepository.findByGame(game);
    }
    
    public Team saveTeam(Team team) {
        return teamRepository.save(team);
    }
    
    public Team updateTeam(Long id, Team teamDetails) {
        return teamRepository.findById(id)
            .map(team -> {
                team.setName(teamDetails.getName());
                team.setGame(teamDetails.getGame());
                team.setDescription(teamDetails.getDescription());
                team.setLogoUrl(teamDetails.getLogoUrl());
                team.setWinRate(teamDetails.getWinRate());
                return teamRepository.save(team);
            })
            .orElseThrow(() -> new RuntimeException("Team not found"));
    }
    
    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }
}
