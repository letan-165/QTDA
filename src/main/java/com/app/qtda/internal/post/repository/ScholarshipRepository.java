package com.app.qtda.internal.post.repository;

import com.app.qtda.internal.post.entity.Scholarship;
import com.app.qtda.internal.user.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScholarshipRepository extends JpaRepository<Scholarship,Long> {
    Optional<Scholarship> findByNotification_notificationID(Long notificationID);
}
