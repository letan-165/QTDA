package com.app.qtda.internal.otp.repository;

import com.app.qtda.internal.otp.entity.Otp;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpRepository extends CrudRepository<Otp,String> {
}
