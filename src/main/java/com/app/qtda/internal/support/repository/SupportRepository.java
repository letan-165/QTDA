package com.app.qtda.internal.support.repository;

import com.app.qtda.internal.support.entity.SupportRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportRepository extends JpaRepository<SupportRequest, Long> {
}
