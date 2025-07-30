package com.app.qtda.internal.user.repository;

import com.app.qtda.internal.user.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff,String> {
    Optional<Staff> findByAccount_UserID(String userID);
    List<Staff> findAllByAccount_UserIDIn(List<String>userIDs);
}
