package com.app.qtda.internal.post.repository;

import com.app.qtda.internal.post.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration,Long> {
    List<Registration> findAllByStudent_StudentID(String studentID);
    boolean existsByStudent_StudentIDAndScholarship_ScholarshipID(String studentID, Long scholarshipID);

}
