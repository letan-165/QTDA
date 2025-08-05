package com.app.qtda.internal.support.repository;

import com.app.qtda.internal.support.entity.SupportType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportTypeRepository extends JpaRepository<SupportType, Long> {
}
