package com.app.qtda.internal.otp.controller;


import com.app.qtda.common.ApiResponse;
import com.app.qtda.internal.otp.dto.request.EmailRequest;
import com.app.qtda.internal.otp.service.OtpService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/otp")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class OtpController {
    OtpService otpService;

    @PostMapping("/public")
    ApiResponse<?> create(@RequestBody EmailRequest request){
        otpService.create(request,true);
        return ApiResponse.builder()
                .message("Vui lòng kiểm tra Email")
                .build();
    }

    @PostMapping
    ApiResponse<?> createTest(@RequestBody EmailRequest request){
        otpService.create(request,false);
        return ApiResponse.builder()
                .message("Xem log")
                .build();
    }
}
