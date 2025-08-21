package com.app.qtda.internal.otp.service;

import com.app.qtda.common.exception.AppException;
import com.app.qtda.common.exception.ErrorCode;
import com.app.qtda.internal.otp.dto.Sender;
import com.app.qtda.internal.otp.dto.request.EmailRequest;
import com.app.qtda.internal.otp.dto.request.SendEmailRequest;
import com.app.qtda.internal.otp.entity.Otp;
import com.app.qtda.internal.otp.repository.OtpRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class OtpService {
    OtpRepository otpRepository;
    EmailService  emailService;

    public void create(EmailRequest request, boolean isEmail){
        //Delete old before create new otp
        otpRepository.deleteById(request.getEmail());
        SecureRandom secureRandom = new SecureRandom();
        int random = 100000 + secureRandom.nextInt(900000);
        Otp otp = otpRepository.save(Otp.builder()
                        .email(request.getEmail())
                        .value(random)
                        .expiryTime(300)
                .build());

        if(isEmail){
            emailService.sendEmail(SendEmailRequest.builder()
                            .to(Sender.builder()
                                    .email(request.getEmail())
                                    .build())
                        .subject("Xác thực OTP")
                        .content("Mã xác thực (OTP) của bạn là: " + random +
                                "<br/>Mã này có hiệu lực trong 5 phút.   " +
                                "<br/><br/>Vui lòng không chia sẻ mã này với bất kỳ ai.")
                    .build());
        }else {
            log.info("OTP: {}",otp.getValue());
        }
    }

    public void verify(String email, int otp) {
        Otp otpE = otpRepository.findById(email)
                .orElseThrow(()->new AppException(ErrorCode.OTP_INVALID));
        if(otpE.getValue() != otp)
            throw new AppException(ErrorCode.OTP_INVALID);

        otpRepository.deleteById(email);
    }
}
