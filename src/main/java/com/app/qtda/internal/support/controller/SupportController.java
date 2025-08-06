package com.app.qtda.internal.support.controller;

import com.app.qtda.common.ApiResponse;
import com.app.qtda.internal.support.dto.request.SupportCreateRequest;
import com.app.qtda.internal.support.dto.request.SupportSaveStateRequest;
import com.app.qtda.internal.support.dto.response.SupportResponse;
import com.app.qtda.internal.support.service.SupportService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/support")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupportController {
    SupportService supportService;

    @GetMapping("/public/gets")
    ApiResponse<List<SupportResponse>> getAll(){
        return ApiResponse.<List<SupportResponse>>builder()
                .result(supportService.getAll())
                .build();
    }

    @GetMapping("/public/gets/pending")
    ApiResponse<List<SupportResponse>> getAllPending(){
        return ApiResponse.<List<SupportResponse>>builder()
                .result(supportService.getAllPending())
                .build();
    }

    @GetMapping("/public/gets/student/{studentID}")
    ApiResponse<List<SupportResponse>> getByStudent(@PathVariable String studentID){
        return ApiResponse.<List<SupportResponse>>builder()
                .result(supportService.getByStudent(studentID))
                .build();
    }

    @PostMapping("/public/create")
    ApiResponse<SupportResponse> create(@RequestBody SupportCreateRequest request){
        return ApiResponse.<SupportResponse>builder()
                .result(supportService.create(request))
                .build();
    }

    @GetMapping("/public/get/{supportID}")
    ApiResponse<SupportResponse> findByID(@PathVariable Long supportID){
        return ApiResponse.<SupportResponse>builder()
                .result(supportService.findByID(supportID))
                .build();
    }

    @PatchMapping("/public/status/{supportID}")
    ApiResponse<SupportResponse> confirmState(@PathVariable Long supportID, @RequestBody SupportSaveStateRequest request){
        return ApiResponse.<SupportResponse>builder()
                .result(supportService.confirmState(supportID,request))
                .build();
    }







}
