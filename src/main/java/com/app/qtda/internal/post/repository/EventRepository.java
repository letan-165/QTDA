package com.app.qtda.internal.post.repository;

import com.app.qtda.internal.post.entity.Event;
import com.app.qtda.internal.post.entity.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event,Long> {
    Optional<Event> findByNotification_notificationID(Long notificationID);
}
