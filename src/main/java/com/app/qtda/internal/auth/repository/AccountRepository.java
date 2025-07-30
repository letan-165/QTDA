package com.app.qtda.internal.auth.repository;

import com.app.qtda.internal.auth.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account,String> {
    Optional<Account> findByUsername(String name);
    boolean existsByUsername(String name);
}
