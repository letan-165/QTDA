package com.app.qtda.internal.user.repository;

import com.app.qtda.internal.user.entity.Staff;
import com.app.qtda.internal.user.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student,String> {
    Optional<Student> findByAccount_UserID(String userID);
}
