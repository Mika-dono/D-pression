package KJX.KJX.repository;

import KJX.KJX.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
    List<Membership> findByIsActiveTrue();
}
