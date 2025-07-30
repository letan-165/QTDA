package com.app.qtda.internal.auth.controller;


import com.app.qtda.common.ApiResponse;
import com.app.qtda.internal.auth.dto.request.LoginRequest;
import com.app.qtda.internal.auth.dto.request.TokenRequest;
import com.app.qtda.internal.auth.service.AuthService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AuthController {
     AuthService authService;

     @PostMapping("/login")
     public ApiResponse<String> login(@RequestBody LoginRequest request){
        return ApiResponse.<String>builder()
                .result(authService.login(request))
                .build();
     }

     @PostMapping("/instropect")
     public ApiResponse<Boolean> instropect(@RequestBody TokenRequest request) throws ParseException, JOSEException {
        return ApiResponse.<Boolean>builder()
                .result(authService.instropect(request))
                .build();
     }

     @PostMapping("/find")
     public ApiResponse<String> findUserID(@RequestBody TokenRequest request) {
        return ApiResponse.<String>builder()
                .result(authService.findUserID(request.getToken()))
                .build();
     }




}
