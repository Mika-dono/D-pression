package KJX.KJX.service;

import KJX.KJX.entity.Scrim;
import KJX.KJX.repository.ScrimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ScrimService {
    
    @Autowired
    private ScrimRepository scrimRepository;
    
    public List<Scrim> getAllScrims() {
        return scrimRepository.findAll();
    }
    
    public Optional<Scrim> getScrimById(Long id) {
        return scrimRepository.findById(id);
    }
    
    public List<Scrim> getScrimsByStatus(String status) {
        return scrimRepository.findByStatus(status);
    }
    
    public List<Scrim> getScrimsByTeamId(Long teamId) {
        return scrimRepository.findByTeamId(teamId);
    }
    
    public Scrim saveScrim(Scrim scrim) {
        return scrimRepository.save(scrim);
    }
    
    public Scrim updateScrim(Long id, Scrim scrimDetails) {
        return scrimRepository.findById(id)
            .map(scrim -> {
                scrim.setOpponent(scrimDetails.getOpponent());
                scrim.setDescription(scrimDetails.getDescription());
                scrim.setDate(scrimDetails.getDate());
                scrim.setStatus(scrimDetails.getStatus());
                scrim.setGame(scrimDetails.getGame());
                scrim.setNotes(scrimDetails.getNotes());
                return scrimRepository.save(scrim);
            })
            .orElseThrow(() -> new RuntimeException("Scrim not found"));
    }
    
    public void deleteScrim(Long id) {
        scrimRepository.deleteById(id);
    }
}
