package com.app.qtda.internal.post.controller;

import com.app.qtda.common.ApiResponse;
import com.app.qtda.internal.post.dto.request.RegistrationCreateRequest;
import com.app.qtda.internal.post.dto.request.RegistrationStatusRequest;
import com.app.qtda.internal.post.dto.response.RegistrationResponse;
import com.app.qtda.internal.post.service.RegistrationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/registration")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RegistrationController {
    RegistrationService registrationService;

    @GetMapping("/public/gets/student/{studentID}")
    public ApiResponse<List<RegistrationResponse>> getAllByStudent(@PathVariable String studentID) {
        return ApiResponse.<List<RegistrationResponse>>builder()
                .result(registrationService.getAllByStudent(studentID))
                .build();
    }

    @GetMapping("/public/gets/status")
    public ApiResponse<List<RegistrationResponse>> getAllStatus(@RequestBody RegistrationStatusRequest request) {
        return ApiResponse.<List<RegistrationResponse>>builder()
                .result(registrationService.getAllStatus(request))
                .build();
    }

    @PostMapping("/public/create")
    public ApiResponse<RegistrationResponse> create(@RequestBody RegistrationCreateRequest request) {
        return ApiResponse.<RegistrationResponse>builder()
                .result(registrationService.create(request))
                .build();
    }

    @PatchMapping("/public/status/{registrationID}")
    public ApiResponse<RegistrationResponse> saveStatus(@PathVariable Long registrationID,@RequestBody RegistrationStatusRequest request) {
        return ApiResponse.<RegistrationResponse>builder()
                .result(registrationService.saveStatus(registrationID, request))
                .build();
    }
}
