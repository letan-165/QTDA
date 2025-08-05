package com.app.qtda.internal.support.controller;

import com.app.qtda.common.ApiResponse;
import com.app.qtda.internal.support.dto.request.SupportTypeDeletesRequest;
import com.app.qtda.internal.support.dto.request.SupportTypeSavesRequest;
import com.app.qtda.internal.support.entity.SupportType;
import com.app.qtda.internal.support.service.SupportTypeService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/support")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupportTypeController {

    SupportTypeService supportTypeService;

    @GetMapping("/public/gets")
    public ApiResponse<List<SupportType>> findAll() {
        return ApiResponse.<List<SupportType>>builder()
                .result(supportTypeService.findAll())
                .build();
    }

    @GetMapping("/public/get/{id}")
    public ApiResponse<SupportType> findById(@PathVariable Long id) {
        return ApiResponse.<SupportType>builder()
                .result(supportTypeService.findById(id))
                .build();
    }

    @PostMapping("/public/saves")
    public ApiResponse<List<SupportType>> save(@RequestBody SupportTypeSavesRequest request) {
        return ApiResponse.<List<SupportType>>builder()
                .result(supportTypeService.save(request))
                .build();
    }

    @DeleteMapping("/public/removes")
    public ApiResponse<Void> delete(@RequestBody SupportTypeDeletesRequest request) {
        supportTypeService.delete(request);
        return ApiResponse.<Void>builder().build();
    }
}
