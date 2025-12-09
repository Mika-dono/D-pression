package KJX.KJX.service;

import KJX.KJX.entity.Membership;
import KJX.KJX.repository.MembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MembershipService {
    
    @Autowired
    private MembershipRepository membershipRepository;
    
    public List<Membership> getAllMemberships() {
        return membershipRepository.findAll();
    }
    
    public Optional<Membership> getMembershipById(Long id) {
        return membershipRepository.findById(id);
    }
    
    public List<Membership> getActiveMemberships() {
        return membershipRepository.findByIsActiveTrue();
    }
    
    public Membership saveMembership(Membership membership) {
        return membershipRepository.save(membership);
    }
    
    public Membership updateMembership(Long id, Membership membershipDetails) {
        return membershipRepository.findById(id)
            .map(membership -> {
                membership.setName(membershipDetails.getName());
                membership.setDescription(membershipDetails.getDescription());
                membership.setPrice(membershipDetails.getPrice());
                membership.setDurationDays(membershipDetails.getDurationDays());
                membership.setBenefits(membershipDetails.getBenefits());
                membership.setIsActive(membershipDetails.getIsActive());
                return membershipRepository.save(membership);
            })
            .orElseThrow(() -> new RuntimeException("Membership not found"));
    }
    
    public void deleteMembership(Long id) {
        membershipRepository.deleteById(id);
    }
}
